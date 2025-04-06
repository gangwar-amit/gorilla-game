// app/components/LevelComplete.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Success } from './svg';
import { COLORS } from '../constants';

interface LevelCompleteProps {
  level: number;
  score: {
    human: number;
    ai: number;
  };
  onNextLevel: () => void;
}

const LevelComplete: React.FC<LevelCompleteProps> = ({ level, score, onNextLevel }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Level {level} Complete!</Text>
        
        <Success width={100} height={100} style={styles.image} />
        
        <Text style={styles.score}>
          Score: You {score.human} - AI {score.ai}
        </Text>
        
        <Text style={styles.message}>
          Great job! The AI's bananas were no match for your throwing skills.
          Ready for a tougher challenge?
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={onNextLevel}
        >
          <Text style={styles.buttonText}>NEXT LEVEL</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.skyBackground,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: COLORS.modalBackground,
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 20,
  },
  image: {
    marginBottom: 20,
  },
  score: {
    fontSize: 22,
    color: COLORS.text,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LevelComplete;