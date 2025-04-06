// app/components/TrajectoryPreview.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { calculateTrajectory } from '../utils/physics';

interface TrajectoryPreviewProps {
  startPosition: {
    x: number;
    y: number;
  };
  angle: number;
  velocity: number;
  wind: number;
}

const TrajectoryPreview: React.FC<TrajectoryPreviewProps> = ({ 
  startPosition, 
  angle, 
  velocity, 
  wind 
}) => {
  // Calculate a simplified trajectory (fewer points for preview)
  const trajectory = calculateTrajectory(
    startPosition, 
    angle, 
    velocity, 
    wind, 
    false,
    true // simplified for preview
  );
  
  return (
    <View style={styles.container}>
      {trajectory.map((point, index) => (
        <View 
          key={`trajectory-${index}`}
          style={[
            styles.dot,
            {
              left: point.x - 2,
              top: point.y - 2,
              opacity: 1 - (index / trajectory.length),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  dot: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default TrajectoryPreview;