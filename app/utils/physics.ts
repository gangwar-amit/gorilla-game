// app/utils/physics.ts
import { Dimensions } from 'react-native';

const GRAVITY = 0.2;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Position {
  x: number;
  y: number;
}

interface TrajectoryPoint extends Position {
  rotation?: number;
}

/**
 * Calculate projectile trajectory based on starting position, angle, velocity and wind
 */
export const calculateTrajectory = (
  startPos: Position, 
  angle: number, 
  velocity: number, 
  wind: number, 
  isAI: boolean = false,
  isPreview: boolean = false
): TrajectoryPoint[] => {
  // Convert angle to radians
  const angleRad = (isAI ? 180 - angle : angle) * Math.PI / 180;
  
  // Initial velocity components
  const vx = velocity * Math.cos(angleRad);
  const vy = -velocity * Math.sin(angleRad); // Negative because y increases downwards in UI
  
  const trajectory: TrajectoryPoint[] = [];
  let x = startPos.x;
  let y = startPos.y;
  let t = 0;
  let currentVX = vx;
  
  // Calculate trajectory points
  const maxPoints = isPreview ? 20 : 500; // Fewer points for preview
  const timeStep = isPreview ? 0.5 : 0.1; // Larger time step for preview
  
  while (
    x >= 0 && 
    x <= SCREEN_WIDTH && 
    y >= 0 && 
    y <= SCREEN_HEIGHT && 
    trajectory.length < maxPoints
  ) {
    // Apply wind effect to horizontal velocity
    currentVX += wind * 0.01;
    
    // Update position
    x += currentVX * timeStep;
    y += (vy + GRAVITY * t) * timeStep;
    
    // Calculate rotation angle for banana
    const rotation = Math.atan2(vy + GRAVITY * t, currentVX) * 180 / Math.PI + 90;
    
    trajectory.push({ x, y, rotation });
    t += timeStep;
  }
  
  return trajectory;
};