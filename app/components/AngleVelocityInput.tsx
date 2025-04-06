// app/components/AngleVelocityInput.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { COLORS } from '../constants';

// Use a different approach for the Slider based on platform
// On web, use a standard input element with a range type
import { default as Slider } from '@react-native-community/slider';

interface AngleVelocityInputProps {
  angle: number;
  velocity: number;
  setAngle: (angle: number) => void;
  setVelocity: (velocity: number) => void;
  onFire: () => void;
  onShowTrajectory: () => void;
  showTrajectory: boolean;
  useAccelerometer?: boolean;
}

const AngleVelocityInput: React.FC<AngleVelocityInputProps> = ({ 
  angle, 
  velocity, 
  setAngle, 
  setVelocity, 
  onFire,
  onShowTrajectory,
  showTrajectory,
  useAccelerometer = false
}) => {
  // Handle the slider for web platform differently to avoid issues
  const renderSlider = (
    value: number, 
    onChange: (value: number) => void, 
    min: number, 
    max: number
  ) => {
    return (
      <Slider
        style={styles.slider}
        minimumValue={min}
        maximumValue={max}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={COLORS.sliderTrack}
        maximumTrackTintColor={COLORS.sliderBackground}
        thumbTintColor={COLORS.sliderThumb}
        step={1}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliders}>
        <Text style={styles.label}>
          Angle: {angle.toFixed(0)}° {useAccelerometer ? "(Tilt Control Active)" : ""}
        </Text>
        
        {!useAccelerometer && renderSlider(angle, setAngle, 0, 90)}
        
        <Text style={styles.label}>Velocity: {velocity.toFixed(0)}</Text>
        {renderSlider(velocity, setVelocity, 10, 100)}
      </View>
      
      <View style={styles.buttons}>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.trajectoryButton, 
            showTrajectory && styles.activeButton
          ]} 
          onPress={onShowTrajectory}
        >
          <Text style={styles.buttonText}>
            {showTrajectory ? "Hide Path" : "Show Path"}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.fireButton]} 
          onPress={onFire}
        >
          <Text style={styles.buttonText}>FIRE!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: COLORS.inputBackground,
  },
  sliders: {
    marginBottom: 15,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    height: 40,
    marginBottom: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireButton: {
    backgroundColor: COLORS.primary,
    flex: 1,
    marginLeft: 10,
  },
  trajectoryButton: {
    backgroundColor: COLORS.secondary,
    flex: 1,
  },
  activeButton: {
    backgroundColor: COLORS.active,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AngleVelocityInput;