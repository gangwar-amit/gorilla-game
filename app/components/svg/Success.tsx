// app/components/svg/Success.tsx
import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

interface SuccessProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

const Success: React.FC<SuccessProps> = ({ width = 100, height = 100, ...props }) => {
  return (
    <Svg viewBox="0 0 100 100" width={width} height={height} {...props}>
      <Circle cx="50" cy="50" r="45" fill="#10B981"/>
      <Circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="3" opacity="0.7"/>
      <Path d="M30,50 L45,65 L70,35" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <Circle cx="20" cy="30" r="3" fill="white" opacity="0.8"/>
      <Circle cx="80" cy="70" r="3" fill="white" opacity="0.8"/>
      <Circle cx="75" cy="20" r="2" fill="white" opacity="0.8"/>
      <Circle cx="35" cy="75" r="2" fill="white" opacity="0.8"/>
    </Svg>
  );
};

export default Success;