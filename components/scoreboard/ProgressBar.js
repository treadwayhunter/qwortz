import { View, Animated } from 'react-native';
import { useThemeContext } from '../contexts/ThemeContext';
import { useEffect, useRef } from 'react';
// score and minScore
// a component, where the inner component is a percentage of the total component
export function ProgressBar({ score, minScore }) {
    const { theme, setTheme } = useThemeContext();
    const growAnim = useRef(new Animated.Value(0)).current;

    let progress = (score / minScore) * 100;
    if (progress > 100) progress = 100;

    function growBar() {
        Animated.timing(growAnim, {
            toValue: progress,
            duration: 1000,
            useNativeDriver: false
        }).start();
    }

    useEffect(() => {
        growBar();
    }, [score]);

    const widthAnim = growAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%']
    });

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
                width: widthAnim, 
                backgroundColor: '#0b9f5b' 
            }} />
        </View>
    );
}
