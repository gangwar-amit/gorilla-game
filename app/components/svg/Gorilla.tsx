// app/components/svg/Gorilla.tsx
import React from 'react';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';

interface GorillaProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

const Gorilla: React.FC<GorillaProps> = ({ width = 150, height = 150, ...props }) => {
  return (
    <Svg viewBox="0 0 150 150" width={width} height={height} {...props}>
      <Ellipse cx="75" cy="75" rx="50" ry="60" fill="#8B4513"/>
      <Circle cx="55" cy="60" r="8" fill="black"/>
      <Circle cx="95" cy="60" r="8" fill="black"/>
      <Ellipse cx="75" cy="85" rx="20" ry="10" fill="#6B3100"/>
      <Path d="M30,75 L15,40 L25,30 Z" fill="#8B4513"/>
      <Path d="M120,75 L135,40 L125,30 Z" fill="#8B4513"/>
      <Circle cx="35" cy="40" r="10" fill="#8B4513" stroke="#6B3100" strokeWidth="2"/>
      <Circle cx="115" cy="40" r="10" fill="#8B4513" stroke="#6B3100" strokeWidth="2"/>
      <Path d="M50,125 L40,150 L60,150 Z" fill="#8B4513"/>
      <Path d="M100,125 L90,150 L110,150 Z" fill="#8B4513"/>
      <Path d="M25,40 C15,35 10,45 15,50 C20,55 30,50 25,40 Z" fill="#FFD700" stroke="#CC9900" strokeWidth="2" transform="rotate(-30, 25, 40)"/>
      <Path d="M125,40 C135,35 140,45 135,50 C130,55 120,50 125,40 Z" fill="#FFD700" stroke="#CC9900" strokeWidth="2" transform="rotate(30, 125, 40)"/>
      <Ellipse cx="65" cy="55" rx="5" ry="3" fill="white" opacity="0.5"/>
      <Ellipse cx="85" cy="55" rx="5" ry="3" fill="white" opacity="0.5"/>
    </Svg>
  );
};

export default Gorilla;