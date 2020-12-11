import React, { useEffect } from 'react';
import { Animated } from 'react-native';

export const FadeIn: React.FC<{
    text: string;
    duration: number;
    style?: React.CSSProperties;
}> = ({ text, duration, style }) => {
    const fadeIn = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 1,
            duration: duration,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.Text style={{ ...style, opacity: fadeIn }}>
            {text}
        </Animated.Text>
    );
};

export const FadeInOut: React.FC<{
    text: string;
    duration: number;
    toggleFade: boolean;
    initialVisible: boolean;
    style?: React.CSSProperties;
}> = ({ text, duration, style, toggleFade, initialVisible }) => {
    const value = new Animated.Value(initialVisible ? 1 : 0);

    useEffect(() => {
        Animated.timing(value, {
            toValue: toggleFade ? 1 : 0,
            duration: duration,
            useNativeDriver: true,
        }).start();
    }, [toggleFade]);

    return (
        <Animated.Text style={{ ...style, opacity: value }}>
            {text}
        </Animated.Text>
    );
};

export const FadeOut: React.FC<{
    text: string;
    duration: number;
    style?: React.CSSProperties;
}> = ({ text, duration, style }) => {
    const fadeIn = new Animated.Value(1);

    useEffect(() => {
        Animated.timing(fadeIn, {
            toValue: 0,
            duration: duration,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.Text style={{ ...style, opacity: fadeIn }}>
            {text}
        </Animated.Text>
    );
};
