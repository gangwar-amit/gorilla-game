// app/components/svg/GorillaRight.tsx
import React from 'react';
import Svg, { Ellipse, Circle, Path, Rect } from 'react-native-svg';

interface GorillaRightProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

const GorillaRight: React.FC<GorillaRightProps> = ({ width = 30, height = 30, ...props }) => {
  return (
    <Svg viewBox="0 0 30 30" width={width} height={height} {...props}>
      <Ellipse cx="15" cy="15" rx="10" ry="12" fill="#8B4513"/>
      <Rect x="9" y="5" width="12" height="3" fill="#CC0000" opacity="0.7"/>
      <Circle cx="14" cy="12" r="2" fill="black"/>
      <Circle cx="20" cy="12" r="2" fill="black"/>
      <Ellipse cx="17" cy="17" rx="4" ry="2" fill="#6B3100"/>
      <Path d="M6,15 L4,20 L7,22 Z" fill="#8B4513"/>
      <Path d="M24,15 L29,8 L27,6 Z" fill="#8B4513"/>
      <Circle cx="11" cy="8" r="2" fill="#8B4513" stroke="#6B3100" strokeWidth="0.5"/>
      <Circle cx="23" cy="8" r="2" fill="#8B4513" stroke="#6B3100" strokeWidth="0.5"/>
      <Path d="M10,25 L8,30 L12,30 Z" fill="#8B4513"/>
      <Path d="M16,25 L14,30 L18,30 Z" fill="#8B4513"/>
    </Svg>
  );
};

export default GorillaRight;