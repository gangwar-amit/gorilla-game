// app/components/svg/Banana.tsx
import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface BananaProps {
  width?: number;
  height?: number;
  [key: string]: any;
}

const Banana: React.FC<BananaProps> = ({ width = 10, height = 10, ...props }) => {
  return (
    <Svg viewBox="0 0 10 10" width={width} height={height} {...props}>
      <Path d="M2,1 C5,-1 9,2 8,4 C7,6 3,8 1,6 C-1,4 0,2 2,1 Z" fill="#FFD700" stroke="#CC9900" strokeWidth="0.5"/>
      <Path d="M2,2 C4,2 6,3 7,4" stroke="#CC9900" strokeWidth="0.5" fill="none"/>
    </Svg>
  );
};

export default Banana;