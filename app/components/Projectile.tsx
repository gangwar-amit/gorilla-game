// app/components/Projectile.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Banana } from './svg';
import { PlayerType } from '../constants';

interface ProjectileProps {
  position: {
    x: number;
    y: number;
    rotation?: number;
  };
  owner: PlayerType;
}

const Projectile: React.FC<ProjectileProps> = ({ position, owner }) => {
  const projectileStyle = {
    position: 'absolute' as 'absolute',
    left: position.x - 5,
    top: position.y - 5,
    width: 10,
    height: 10,
    transform: [{ rotate: `${position.rotation || 0}deg` }],
  };
  
  return (
    <View style={projectileStyle}>
      <Banana width={10} height={10} />
    </View>
  );
};

export default Projectile;