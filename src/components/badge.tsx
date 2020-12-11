import React from 'react';
import { Text, Badge } from 'native-base';

import { useTheme } from '@react-navigation/native';

export const CustomBadge: React.FC<{
    value: string;
    style?: React.CSSProperties;
}> = (props) => {
    const { colors } = useTheme();

    let styles = {
        backgroundColor: colors.primary,
    };
    if (props.style) {
        styles = {
            ...props.style,
            ...styles,
        };
    }

    return (
        <Badge style={styles}>
            <Text
                style={{
                    fontWeight: 'bold',
                    fontSize: 14,
                }}>
                {props.value}
            </Text>
        </Badge>
    );
};
