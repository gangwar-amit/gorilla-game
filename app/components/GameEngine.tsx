// app/components/GameEngine.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Building from './Building';
import Player from './Player';
import Projectile from './Projectile';
import TrajectoryPreview from './TrajectoryPreview';
import { COLORS, PLAYER_TYPES, PlayerType } from '../constants';

interface GameEngineProps {
  buildings: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    damaged?: boolean;
    damagePositions: Array<{ x: number; y: number }>;
  }>;
  playerPositions: {
    human: { x: number; y: number };
    ai: { x: number; y: number };
  };
  projectile: {
    trajectory: Array<{ x: number; y: number; rotation?: number }>;
    currentIndex: number;
    isMoving: boolean;
    owner: PlayerType;
  } | null;
  wind: number;
  playerTurn: PlayerType;
  showTrajectory: boolean;
  angle: number;
  velocity: number;
}

const GameEngine: React.FC<GameEngineProps> = ({ 
  buildings, 
  playerPositions, 
  projectile, 
  wind,
  playerTurn,
  showTrajectory,
  angle,
  velocity
}) => {
  return (
    <View style={styles.container}>
      {/* Sky background */}
      <View style={styles.sky}>
        {/* Sun */}
        <View style={styles.sun} />
      </View>
      
      {/* Buildings */}
      {buildings.map((building, index) => (
        <Building 
          key={`building-${index}`} 
          building={building} 
          index={index}
        />
      ))}
      
      {/* Players */}
      <Player 
        position={playerPositions.human}
        type={PLAYER_TYPES.HUMAN}
        isActive={playerTurn === PLAYER_TYPES.HUMAN}
      />
      <Player 
        position={playerPositions.ai}
        type={PLAYER_TYPES.AI}
        isActive={playerTurn === PLAYER_TYPES.AI}
      />
      
      {/* Trajectory preview - only shown for human player */}
      {showTrajectory && (
        <TrajectoryPreview 
          startPosition={playerPositions.human}
          angle={angle}
          velocity={velocity}
          wind={wind}
        />
      )}
      
      {/* Projectile */}
      {projectile && (
        <Projectile 
          position={projectile.trajectory[projectile.currentIndex]}
          owner={projectile.owner}
        />
      )}
      
      {/* Wind indicator */}
      <View style={styles.windIndicator}>
        <View 
          style={[
            styles.windArrow, 
            { width: Math.abs(wind) * 20 },
            wind > 0 ? styles.windRight : styles.windLeft,
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  sky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.skyBackground,
  },
  sun: {
    position: 'absolute',
    top: 30,
    right: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.sun,
  },
  windIndicator: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  windArrow: {
    height: 4,
    backgroundColor: COLORS.windIndicator,
  },
  windRight: {
    marginLeft: 100,
  },
  windLeft: {
    marginRight: 100,
  },
});

export default GameEngine;