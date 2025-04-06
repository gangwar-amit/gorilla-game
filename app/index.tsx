// app/index.tsx
import React, { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Alert, Dimensions, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { Accelerometer } from 'expo-sensors';
import Constants from 'expo-constants';
import { Gorilla } from './components/svg';
import { COLORS, PLAYER_TYPES, GAME_STATES, GameState, PlayerType } from './constants';

// Import components
import GameEngine from './components/GameEngine';
import AngleVelocityInput from './components/AngleVelocityInput';
import LevelComplete from './components/LevelComplete';
import { generateLevel } from './utils/levelGenerator';
import { calculateTrajectory } from './utils/physics';
import { mockAIDecision } from './services/openAIService';

// Define TypeScript interfaces
interface PlayerPosition {
  x: number;
  y: number;
}

interface PlayerPositions {
  human: PlayerPosition;
  ai: PlayerPosition;
}

interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  damaged?: boolean;
  damagePositions: { x: number; y: number }[];
}

interface Projectile {
  trajectory: { x: number; y: number; rotation?: number }[];
  currentIndex: number;
  isMoving: boolean;
  owner: PlayerType;
}

interface Score {
  human: number;
  ai: number;
}

interface HitResult {
  hit: boolean;
  hitType: string | null;
  buildingIndex: number;
  hitPosition: { x: number; y: number } | null;
}

export default function App() {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GAME_STATES.MENU);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [playerTurn, setPlayerTurn] = useState<PlayerType>(PLAYER_TYPES.HUMAN);
  const [score, setScore] = useState<Score>({ human: 0, ai: 0 });
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [playerPositions, setPlayerPositions] = useState<PlayerPositions>({
    human: { x: 0, y: 0 },
    ai: { x: 0, y: 0 }
  });
  const [wind, setWind] = useState<number>(0);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [angle, setAngle] = useState<number>(45);
  const [velocity, setVelocity] = useState<number>(50);
  const [aiDecision, setAiDecision] = useState<{ angle: number; velocity: number }>({ angle: 0, velocity: 0 });
  const [showTrajectory, setShowTrajectory] = useState<boolean>(false);
  const [useAccelerometer, setUseAccelerometer] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<any>(null);
  
  // Refs
  const gameViewRef = useRef<View>(null);
  
  // Initialize game level
  useEffect(() => {
    if (gameState === GAME_STATES.PLAYING) {
      const levelData = generateLevel(currentLevel);
      setBuildings(levelData.buildings);
      setPlayerPositions(levelData.playerPositions);
      setWind(levelData.wind);
    }
  }, [gameState, currentLevel]);
  
  // Handle accelerometer for tilt controls
  useEffect(() => {
    if (useAccelerometer && playerTurn === PLAYER_TYPES.HUMAN && Platform.OS !== 'web') {
      _subscribe();
    } else {
      _unsubscribe();
    }
    
    return () => _unsubscribe();
  }, [useAccelerometer, playerTurn]);
  
  const _subscribe = () => {
    if (Platform.OS !== 'web') {
      setSubscription(
        Accelerometer.addListener(accelerometerData => {
          // Convert tilt to angle (simple implementation)
          const tiltAngle = Math.atan2(accelerometerData.y, accelerometerData.x) * 180 / Math.PI;
          const normalizedAngle = Math.max(0, Math.min(90, 90 - tiltAngle));
          setAngle(normalizedAngle);
        })
      );
    }
  };
  
  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };
  
  // Handle AI turn
  useEffect(() => {
    async function handleAiTurn() {
      if (playerTurn === PLAYER_TYPES.AI && gameState === GAME_STATES.PLAYING) {
        // Add slight delay to make AI turns feel more natural
        setTimeout(async () => {
          try {
            // Use mock AI implementation
            const difficulty = Math.min(0.7 + (currentLevel * 0.03), 0.95);
            const aiResponse = mockAIDecision({
              playerPositions,
              buildings,
              wind,
              currentLevel
            }, difficulty);
            
            // Set the AI's decision
            setAiDecision(aiResponse);
            
            // Small delay for better game feel
            setTimeout(() => {
              // Fire the projectile based on AI's decision
              fireProjectile(aiResponse.angle, aiResponse.velocity);
            }, 800);
          } catch (error) {
            console.error("Error during AI turn:", error);
            // Fallback to random decisions if API fails
            const randomAngle = Math.floor(Math.random() * 90);
            const randomVelocity = 40 + Math.floor(Math.random() * 40);
            setAiDecision({ angle: randomAngle, velocity: randomVelocity });
            fireProjectile(randomAngle, randomVelocity);
          }
        }, 1000);
      }
    }
    
    handleAiTurn();
  }, [playerTurn, gameState]);

  // Fire projectile based on angle and velocity
  const fireProjectile = (ang: number, vel: number) => {
    const startPos = playerTurn === PLAYER_TYPES.HUMAN 
      ? playerPositions.human 
      : playerPositions.ai;
    
    const trajectory = calculateTrajectory(
      startPos, 
      ang, 
      vel, 
      wind, 
      playerTurn === PLAYER_TYPES.AI
    );
    
    setProjectile({
      trajectory,
      currentIndex: 0,
      isMoving: true,
      owner: playerTurn
    });
  };
  
  // Handle projectile movement and collision
  useEffect(() => {
    if (projectile && projectile.isMoving) {
      const timer = setInterval(() => {
        setProjectile(prev => {
          if (!prev) return null;
          
          const nextIndex = prev.currentIndex + 1;
          
          // Check if projectile has completed its path
          if (nextIndex >= prev.trajectory.length) {
            clearInterval(timer);
            setProjectile(null);
            
            // Switch turns after projectile animation completes
            setPlayerTurn(prev.owner === PLAYER_TYPES.HUMAN ? PLAYER_TYPES.AI : PLAYER_TYPES.HUMAN);
            return null;
          }
          
          const currentPos = prev.trajectory[nextIndex];
          
          // Check for collisions with buildings or players
          const hitResult = checkCollisions(currentPos);
          
          if (hitResult.hit) {
            clearInterval(timer);
            
            if (hitResult.hitType === 'player') {
              // Player was hit
              handlePlayerHit(prev.owner);
            } else {
              // Building was hit, update building state
              updateBuildings(hitResult.buildingIndex, hitResult.hitPosition!);
              // Switch turns
              setPlayerTurn(prev.owner === PLAYER_TYPES.HUMAN ? PLAYER_TYPES.AI : PLAYER_TYPES.HUMAN);
            }
            
            return null;
          }
          
          // Continue projectile movement
          return {
            ...prev,
            currentIndex: nextIndex
          };
        });
      }, 50); // Update position every 50ms
      
      return () => clearInterval(timer);
    }
  }, [projectile]);
  
  // Check for collisions
  const checkCollisions = (position: { x: number, y: number }): HitResult => {
    // Default result - no collision
    const result: HitResult = { 
      hit: false, 
      hitType: null, 
      buildingIndex: -1, 
      hitPosition: null 
    };
    
    // Check collision with opposing player
    const targetPlayer = playerTurn === PLAYER_TYPES.HUMAN ? playerPositions.ai : playerPositions.human;
    const playerHitBox = { 
      left: targetPlayer.x - 15, 
      right: targetPlayer.x + 15,
      top: targetPlayer.y - 15,
      bottom: targetPlayer.y + 15
    };
    
    if (position.x >= playerHitBox.left && position.x <= playerHitBox.right &&
        position.y >= playerHitBox.top && position.y <= playerHitBox.bottom) {
      result.hit = true;
      result.hitType = 'player';
      return result;
    }
    
    // Check collision with buildings
    buildings.forEach((building, index) => {
      if (position.x >= building.x && position.x <= building.x + building.width &&
          position.y >= building.y && position.y <= building.y + building.height) {
        result.hit = true;
        result.hitType = 'building';
        result.buildingIndex = index;
        result.hitPosition = position;
      }
    });
    
    return result;
  };
  
  // Update buildings after a hit
  const updateBuildings = (buildingIndex: number, hitPosition: { x: number, y: number }) => {
    if (buildingIndex < 0) return;
    
    setBuildings(prev => {
      const updatedBuildings = [...prev];
      // Create damage in building
      const damagedBuilding = {...updatedBuildings[buildingIndex]};
      damagedBuilding.damaged = true;
      damagedBuilding.damagePositions = [
        ...(damagedBuilding.damagePositions || []),
        { x: hitPosition.x - damagedBuilding.x, y: hitPosition.y - damagedBuilding.y }
      ];
      updatedBuildings[buildingIndex] = damagedBuilding;
      return updatedBuildings;
    });
  };
  
  // Handle a player being hit
  const handlePlayerHit = (shooter: PlayerType) => {
    // Update score
    setScore(prev => ({
      ...prev,
      [shooter]: prev[shooter] + 1
    }));
    
    // Check win condition
    if (shooter === PLAYER_TYPES.HUMAN) {
      // Human won the round
      setGameState(GAME_STATES.LEVEL_COMPLETE);
    } else {
      // AI won the round
      Alert.alert(
        "Game Over",
        "The AI has defeated you!",
        [{ text: "Try Again", onPress: () => resetLevel() }]
      );
    }
  };
  
  // Reset current level
  const resetLevel = () => {
    setProjectile(null);
    setPlayerTurn(PLAYER_TYPES.HUMAN);
    setGameState(GAME_STATES.PLAYING);
  };
  
  // Advance to next level
  const nextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setProjectile(null);
    setPlayerTurn(PLAYER_TYPES.HUMAN);
    setGameState(GAME_STATES.PLAYING);
  };
  
  // Handle player input submission
  const handleFire = () => {
    if (playerTurn === PLAYER_TYPES.HUMAN && !projectile) {
      fireProjectile(angle, velocity);
    }
  };
  
  // Toggle accelerometer controls
  const toggleAccelerometer = () => {
    setUseAccelerometer(prev => !prev);
  };
  
  // Start game from menu
  const startGame = () => {
    setScore({ human: 0, ai: 0 });
    setCurrentLevel(1);
    setGameState(GAME_STATES.PLAYING);
    setPlayerTurn(PLAYER_TYPES.HUMAN);
  };

  // Render different game states
  const renderContent = () => {
    switch (gameState) {
      case GAME_STATES.MENU:
        return (
          <View style={styles.menuContainer}>
            <Text style={styles.title}>GORILLAS</Text>
            <View style={styles.gorillaContainer}>
              <Gorilla width={150} height={150} />
            </View>
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={startGame}
            >
              <Text style={styles.menuButtonText}>START GAME</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.menuButton, 
                styles.settingsButton,
                useAccelerometer && styles.activeButton
              ]} 
              onPress={toggleAccelerometer}
            >
              <Text style={styles.menuButtonText}>
                {useAccelerometer ? "DISABLE TILT CONTROLS" : "ENABLE TILT CONTROLS"}
              </Text>
            </TouchableOpacity>
          </View>
        );
        
      case GAME_STATES.PLAYING:
        return (
          <View style={styles.container}>
            <View style={styles.gameHeader}>
              <Text style={styles.levelText}>Level {currentLevel}</Text>
              <Text style={styles.windText}>Wind: {wind > 0 ? '→' : '←'} {Math.abs(wind).toFixed(1)}</Text>
              <Text style={styles.scoreText}>
                You: {score.human} | AI: {score.ai}
              </Text>
            </View>
            
            <View 
              ref={gameViewRef} 
              style={styles.gameContainer}
            >
              <GameEngine 
                buildings={buildings}
                playerPositions={playerPositions}
                projectile={projectile}
                wind={wind}
                playerTurn={playerTurn}
                showTrajectory={showTrajectory && playerTurn === PLAYER_TYPES.HUMAN}
                angle={angle}
                velocity={velocity}
              />
            </View>
            
            {playerTurn === PLAYER_TYPES.HUMAN && !projectile ? (
              <AngleVelocityInput
                angle={angle}
                velocity={velocity}
                setAngle={setAngle}
                setVelocity={setVelocity}
                onFire={handleFire}
                onShowTrajectory={() => setShowTrajectory(!showTrajectory)}
                showTrajectory={showTrajectory}
                useAccelerometer={useAccelerometer}
              />
            ) : (
              <View style={styles.aiThinkingContainer}>
                <Text style={styles.aiThinkingText}>
                  {playerTurn === PLAYER_TYPES.AI 
                    ? aiDecision.angle ? `AI firing at angle: ${aiDecision.angle.toFixed(1)}° velocity: ${aiDecision.velocity.toFixed(1)}` : "AI is thinking..." 
                    : "Banana flying!"}
                </Text>
              </View>
            )}
          </View>
        );
        
      case GAME_STATES.LEVEL_COMPLETE:
        return (
          <LevelComplete 
            level={currentLevel} 
            score={score}
            onNextLevel={nextLevel}
          />
        );
        
      default:
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Unknown game state</Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 10 : (Constants.statusBarHeight || 0) + 10,
    paddingBottom: 10,
    backgroundColor: COLORS.headerBackground,
  },
  levelText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  windText: {
    color: COLORS.text,
    fontSize: 16,
  },
  scoreText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameContainer: {
    flex: 1,
    backgroundColor: COLORS.skyBackground,
  },
  aiThinkingContainer: {
    padding: 20,
    backgroundColor: COLORS.inputBackground,
    alignItems: 'center',
  },
  aiThinkingText: {
    color: COLORS.text,
    fontSize: 18,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.skyBackground,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 40,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  gorillaContainer: {
    marginBottom: 40,
  },
  menuButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
    minWidth: 250,
    alignItems: 'center',
  },
  menuButtonText: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    backgroundColor: COLORS.secondary,
  },
  activeButton: {
    backgroundColor: COLORS.active,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.text,
    fontSize: 18,
    marginBottom: 20,
  }
});