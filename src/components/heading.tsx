import React from 'react';
import { Text } from 'native-base';
import { FadeInOut } from './fade-text';

export interface AnimatedHeadingProps {
    title: string;
    size?: number;
    toggleFade: boolean;
    initialVisible: boolean;
}
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
    title,
    size,
    toggleFade,
    initialVisible,
}) => {
    return (
        <FadeInOut
            toggleFade={toggleFade}
            duration={500}
            text={title}
            initialVisible={initialVisible}
            style={{
                fontSize: size ? size : 34,
                paddingTop: 19,
                padding: 13,
                paddingBottom: 15,
                textAlign: 'left',
                alignSelf: 'flex-start',
                color: '#e0e0e0',
                fontFamily: 'System',
                fontWeight: 'bold',
                backgroundColor: 'transparent',
            }}
        />
    );
};

export const Heading = ({ title, size }: { title: string; size?: number }) => (
    <Text
        style={{
            fontSize: size ? size : 34,
            paddingTop: 19,
            padding: 13,
            paddingBottom: 15,
            textAlign: 'left',
            alignSelf: 'flex-start',
            color: '#e0e0e0',
            fontFamily: 'System',
            fontWeight: 'bold',
            backgroundColor: 'transparent',
        }}>
        {title}
    </Text>
);
