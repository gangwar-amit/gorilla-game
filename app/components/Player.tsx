// app/components/Player.tsx
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { GorillaLeft, GorillaRight } from './svg';
import { PLAYER_TYPES, PlayerType } from '../constants';

interface PlayerProps {
  position: {
    x: number;
    y: number;
  };
  type: PlayerType;
  isActive: boolean;
}

const Player: React.FC<PlayerProps> = ({ position, type, isActive }) => {
  // Animation for the active player indicator
  const bounceAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      bounceAnim.setValue(0);
    }
  }, [isActive]);
  
  const playerStyle = {
    position: 'absolute' as 'absolute',
    left: position.x - 15,
    top: position.y - 15,
    width: 30,
    height: 30,
  };
  
  const indicatorTransform = {
    transform: [
      {
        translateY: bounceAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -5],
        }),
      },
    ],
  };
  
  return (
    <View style={playerStyle}>
      {/* Use SVG components based on player type */}
      {type === PLAYER_TYPES.HUMAN ? 
        <GorillaLeft width={30} height={30} /> : 
        <GorillaRight width={30} height={30} />
      }
      
      {/* Active player indicator */}
      {isActive && (
        <Animated.View style={[styles.activeIndicator, indicatorTransform]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  activeIndicator: {
    position: 'absolute',
    top: -10,
    left: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'yellow',
  },
});

export default Player;