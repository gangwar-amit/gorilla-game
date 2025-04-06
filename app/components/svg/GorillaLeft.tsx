// app/components/svg/GorillaLeft.tsx
import React from 'react';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';

interface GorillaLeftProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

const GorillaLeft: React.FC<GorillaLeftProps> = ({ width = 30, height = 30, ...props }) => {
  return (
    <Svg viewBox="0 0 30 30" width={width} height={height} {...props}>
      <Ellipse cx="15" cy="15" rx="10" ry="12" fill="#8B4513"/>
      <Circle cx="10" cy="12" r="2" fill="black"/>
      <Circle cx="16" cy="12" r="2" fill="black"/>
      <Ellipse cx="13" cy="17" rx="4" ry="2" fill="#6B3100"/>
      <Path d="M6,15 L1,8 L3,6 Z" fill="#8B4513"/>
      <Path d="M24,15 L26,20 L23,22 Z" fill="#8B4513"/>
      <Circle cx="7" cy="8" r="2" fill="#8B4513" stroke="#6B3100" strokeWidth="0.5"/>
      <Circle cx="19" cy="8" r="2" fill="#8B4513" stroke="#6B3100" strokeWidth="0.5"/>
      <Path d="M10,25 L8,30 L12,30 Z" fill="#8B4513"/>
      <Path d="M16,25 L14,30 L18,30 Z" fill="#8B4513"/>
    </Svg>
  );
};

export default GorillaLeft;