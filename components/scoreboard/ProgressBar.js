import { View, Animated, Text } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useGameContext } from '../contexts/GameContext';
import { useEffect, useRef, useState } from 'react';

export function ProgressBar() {
    const { theme, setTheme } = useThemeContext();
    const { gameState, gameDispatch } = useGameContext();

    const minGrowAnim = useRef(new Animated.Value(0)).current;
    const proGrowAnim = useRef(new Animated.Value(0)).current;
    
    const minWidthAnim = minGrowAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });
    const proWidthAnim = proGrowAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });
    
    let minProgress = (gameState.score / gameState.minScore) * 100;
    if (minProgress > 100) minProgress = 100;
    let proProgress = (gameState.score / gameState.proScore) * 100;
    if (proProgress > 100) proProgress = 100;

    function minGrowBar() {
        Animated.timing(minGrowAnim, {
            toValue: minProgress,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    function proGrowBar() {
        Animated.timing(proGrowAnim, {
            toValue: proProgress,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    useEffect(() => {
        minGrowBar();
        proGrowBar();
    }, [gameState.score]);


    return (
        <View style={{
            height: 40,
            width: '80%',
            borderWidth: 3,
            borderRadius: 8,
            margin: 16,
            overflow: 'hidden',
            borderColor: theme === 'light' ? '#000' : '#fff'
        }}>
            <Animated.View style={{
                height: '100%',
                width: minWidthAnim,
                backgroundColor: '#0b9f5b',
                justifyContent: 'center'
            }}>
                <Animated.View style={{
                    height: '100%',
                    width: proWidthAnim,
                    backgroundColor: '#094387',
                }}>
                </Animated.View>
            </Animated.View>

        </View>
    );
}
