// app/services/openAIService.ts
import axios from 'axios';
import { PlayerType } from '../constants';

// Replace with your actual OpenAI API key handling
// In a real production app, this should be handled securely through environment variables
// or a backend service
const API_KEY = 'YOUR_OPENAI_API_KEY';

interface AIGameState {
  playerPositions?: {
    human: { x: number; y: number };
    ai: { x: number; y: number };
  };
  buildings?: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    damaged?: boolean;
    damagePositions: Array<{ x: number; y: number }>;
  }>;
  wind: number;
  currentLevel?: number;
}

interface AIDecision {
  angle: number;
  velocity: number;
}

/**
 * Call OpenAI API to get the AI player's decision
 */
export const callOpenAI = async (
  base64Image: string,
  difficulty: number,
  wind: number,
  level: number
): Promise<AIDecision> => {
  try {
    // This is a simplified example that would need to be adjusted
    // based on the actual OpenAI Vision API implementation
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'system',
            content: `You are the AI opponent in a Gorillas game, a classic artillery game. 
                     Your goal is to hit the human player by calculating the correct angle and velocity.
                     Only respond with a JSON object containing angle (0-90) and velocity (10-100).
                     The game has wind that affects the banana trajectory. Current wind: ${wind} (positive is right, negative is left).
                     This is level ${level}. Adjust your difficulty level to ${difficulty} (0-1, where 1 is perfect aim).`,
          },
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
              {
                type: 'text',
                text: 'What angle and velocity would you use for your throw? Respond with only a JSON object with angle and velocity properties.',
              },
            ],
          },
        ],
        max_tokens: 100,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
      }
    );

    // Parse the response to get the angle and velocity
    const content = response.data.choices[0].message.content;
    const match = content.match(/\{.*\}/s);
    
    if (match) {
      const json = JSON.parse(match[0]);
      return {
        angle: json.angle || 45,
        velocity: json.velocity || 50,
      };
    }
    
    // Fallback in case parsing fails
    return {
      angle: 45,
      velocity: 50,
    };
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    
    // Return a random decision as fallback
    return mockAIDecision({
      wind,
      currentLevel: level
    }, difficulty);
  }
};

/**
 * Mock implementation for AI decision making
 * This provides a reasonably smart AI opponent without requiring the OpenAI API
 */
export const mockAIDecision = (
  gameState: AIGameState,
  difficulty: number
): AIDecision => {
  const { 
    playerPositions, 
    buildings, 
    wind, 
    currentLevel 
  } = gameState;
  
  // If we don't have full game state info, make a reasonable guess
  if (!playerPositions) {
    const randomness = 1 - (difficulty || 0.5);
    
    const perfectAngle = 45; 
    const perfectVelocity = 60;
    
    const angle = perfectAngle + (Math.random() * 40 - 20) * randomness;
    const velocity = perfectVelocity + (Math.random() * 40 - 20) * randomness;
    
    return {
      angle: Math.max(0, Math.min(90, angle)),
      velocity: Math.max(10, Math.min(100, velocity)),
    };
  }
  
  // Calculate optimal angle and velocity based on player positions
  // This is a simplified physics model for a projectile
  
  // Get AI and human positions
  const aiPos = playerPositions.ai;
  const humanPos = playerPositions.human;
  
  // Calculate horizontal distance
  const dx = Math.abs(aiPos.x - humanPos.x);
  
  // Calculate height difference (negative if human is lower than AI)
  const dy = aiPos.y - humanPos.y;
  
  // Gravity constant (should match the one in physics.ts)
  const g = 0.2;
  
  // Calculate base angle and velocity
  // This is a simplified calculation that doesn't account for all physics
  // but provides a reasonable approximation
  
  // Base angle calculation (simplified projectile motion formula)
  // For a more accurate simulation we'd solve the projectile equation
  let baseAngle = 45; // Default is 45 degrees
  
  // Adjust for height difference
  if (dy !== 0) {
    baseAngle += (dy / dx) * 30; // Adjust more for greater height differences
  }
  
  // Adjust for wind
  baseAngle += wind * 5; // Wind influence increases with wind strength
  
  // Calculate a reasonable velocity based on distance
  // In a real projectile simulation, we'd need to solve for v given the angle and distance
  const baseVelocity = Math.sqrt(dx) * 7; // Simple scaling with distance
  
  // Add some randomness based on difficulty
  // A difficulty of 1.0 means perfect aim, 0.0 means completely random
  const randomFactor = 1 - difficulty;
  
  // The higher the level, the more precise the AI gets
  const levelAdjustedRandomness = randomFactor / (1 + 0.1 * (currentLevel || 1));
  
  const angle = baseAngle + (Math.random() * 50 - 25) * levelAdjustedRandomness;
  const velocity = baseVelocity + (Math.random() * 30 - 15) * levelAdjustedRandomness;
  
  // Ensure values are within valid ranges
  return {
    angle: Math.max(0, Math.min(90, angle)),
    velocity: Math.max(20, Math.min(100, velocity)),
  };
};