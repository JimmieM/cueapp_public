import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Button } from 'native-base';
import { useTheme } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const SignalChoice = ({
    id,
    icon,
    name,
    color,
    onSelect,
}: {
    id: number;
    icon: string;
    name: string;
    color: string;
    onSelect: (id: number, cb: (success: boolean) => void) => void;
}) => {
    const [clicked, setClicked] = useState(false);
    const { colors } = useTheme();

    const getIconTopPadding = useCallback(() => {
        if (clicked && icon.length <= 3) {
            return 23;
        } else if (clicked && icon.length > 2) {
            return 26;
        }
        return 17;
    }, [clicked, icon]);

    const getIconSize = useCallback(() => {
        if (clicked && icon.length <= 3) {
            return 38;
        } else if (clicked && icon.length > 2) {
            return 30;
        }
        return 23;
    }, [clicked, icon]);

    const styles = StyleSheet.create({
        textStyle: {
            paddingTop: 5,
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingLeft: 4,
            paddingRight: 4,
            fontSize: 12,
        },
        iconStyle: {
            paddingTop: getIconTopPadding(),
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: clicked ? 30 : 23,
        },
    });

    return (
        <TouchableOpacity
            onPress={() => {      
                onSelect(id, (success) => {
                    if (success) {                        
                        setClicked(!clicked);
                    }
                });
            }}
            style={{ backgroundColor: 'none', marginBottom: 0 }}>
            <View
                style={{
                    width: Dimensions.get('window').width / 4 - 13,
                    height: Dimensions.get('window').width / 4 - 13,
                    margin: 5,
                    backgroundColor: clicked ? colors.primary : color,
                    borderRadius: 7,
                    borderColor: '#7e7e7e',
                }}>
                <Text
                    style={{
                        ...styles.iconStyle,
                        fontSize: getIconSize(),
                    }}>
                    {icon}
                </Text>
                {!clicked && <Text style={styles.textStyle}>{name}</Text>}
            </View>
        </TouchableOpacity>
    );
};
