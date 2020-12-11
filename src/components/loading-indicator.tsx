import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface LoadingIndicatorProps {
    display: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = (props) => {
    const { colors } = useTheme();
    return props.display ? (
        <View
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -40,
                marginLeft: -40,
                width: 70,
                height: 70,
                backgroundColor: colors.card,
                padding: 20,
                borderRadius: 7,
                zIndex: 999,
            }}>
            <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
    ) : null;
};
