// app/components/Building.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

interface BuildingProps {
  building: {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    damaged?: boolean;
    damagePositions: Array<{ x: number; y: number }>;
  };
  index: number;
}

const Building: React.FC<BuildingProps> = ({ building, index }) => {
  const buildingStyle = {
    position: 'absolute' as 'absolute',
    left: building.x,
    bottom: 0,
    width: building.width,
    height: building.height,
    backgroundColor: building.color,
  };
  
  // Render windows on the building
  const renderWindows = () => {
    const windows = [];
    const windowSize = Math.max(building.width / 10, 5);
    const windowGap = Math.max(building.width / 20, 2);
    
    const horizontalCount = Math.floor(building.width / (windowSize + windowGap));
    const verticalCount = Math.floor(building.height / (windowSize + windowGap));
    
    for (let y = 0; y < verticalCount; y++) {
      for (let x = 0; x < horizontalCount; x++) {
        // Skip some windows randomly for variety
        if (Math.random() > 0.8) continue;
        
        // Check if this window area is damaged
        let isDamaged = false;
        if (building.damagePositions) {
          const windowX = x * (windowSize + windowGap) + windowGap;
          const windowY = building.height - (y * (windowSize + windowGap) + windowGap) - windowSize;
          
          isDamaged = building.damagePositions.some(dmg => {
            return (
              dmg.x >= windowX && 
              dmg.x <= windowX + windowSize && 
              dmg.y >= windowY && 
              dmg.y <= windowY + windowSize
            );
          });
        }
        
        if (!isDamaged) {
          windows.push(
            <View 
              key={`window-${index}-${x}-${y}`}
              style={{
                position: 'absolute',
                left: x * (windowSize + windowGap) + windowGap,
                bottom: y * (windowSize + windowGap) + windowGap,
                width: windowSize,
                height: windowSize,
                backgroundColor: Math.random() > 0.5 ? 'rgba(255, 255, 100, 0.8)' : 'rgba(200, 200, 200, 0.5)',
              }}
            />
          );
        }
      }
    }
    
    return windows;
  };
  
  // Render damage (explosions) on the building
  const renderDamage = () => {
    if (!building.damagePositions) return null;
    
    return building.damagePositions.map((dmg, i) => (
      <View 
        key={`damage-${index}-${i}`}
        style={{
          position: 'absolute',
          left: dmg.x - 10,
          bottom: building.height - dmg.y - 10,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />
    ));
  };
  
  return (
    <View style={buildingStyle}>
      {renderWindows()}
      {renderDamage()}
    </View>
  );
};

export default Building;