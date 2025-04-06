// app/utils/levelGenerator.ts
import { Dimensions } from 'react-native';
import { BUILDING_COLORS } from '../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  damaged?: boolean;
  damagePositions: Array<{ x: number; y: number }>;
}

interface PlayerPosition {
  x: number;
  y: number;
}

interface PlayerPositions {
  human: PlayerPosition;
  ai: PlayerPosition;
}

interface LevelData {
  buildings: Building[];
  playerPositions: PlayerPositions;
  wind: number;
}

/**
 * Generate a level with buildings and player positions
 */
export const generateLevel = (level: number): LevelData => {
  // More buildings and taller buildings as levels increase
  const buildingCount = Math.min(5 + Math.floor(level / 2), 12);
  const maxBuildingHeight = Math.min(
    SCREEN_HEIGHT * 0.3 + (level * SCREEN_HEIGHT * 0.02),
    SCREEN_HEIGHT * 0.7
  );
  
  // More wind as levels increase
  const maxWindSpeed = Math.min(0.5 + (level * 0.1), 3);
  const wind = (Math.random() * 2 - 1) * maxWindSpeed;
  
  // Generate buildings
  const buildings: Building[] = [];
  const buildingWidth = SCREEN_WIDTH / buildingCount;
  
  for (let i = 0; i < buildingCount; i++) {
    const height = Math.max(
      SCREEN_HEIGHT * 0.1,
      Math.random() * maxBuildingHeight
    );
    
    buildings.push({
      x: i * buildingWidth,
      y: SCREEN_HEIGHT - height,
      width: buildingWidth,
      height,
      color: BUILDING_COLORS[i % BUILDING_COLORS.length],
      damagePositions: [],
    });
  }
  
  // Place players on buildings
  // Human on the left side, AI on the right side
  const humanBuildingIndex = Math.floor(Math.random() * (buildingCount / 3));
  const aiBuildingIndex = buildingCount - 1 - Math.floor(Math.random() * (buildingCount / 3));
  
  const humanBuilding = buildings[humanBuildingIndex];
  const aiBuilding = buildings[aiBuildingIndex];
  
  const playerPositions: PlayerPositions = {
    human: {
      x: humanBuilding.x + humanBuilding.width / 2,
      y: humanBuilding.y,
    },
    ai: {
      x: aiBuilding.x + aiBuilding.width / 2,
      y: aiBuilding.y,
    },
  };
  
  return {
    buildings,
    playerPositions,
    wind,
  };
};