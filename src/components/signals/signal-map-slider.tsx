import React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@react-navigation/native';
import { Heading } from '../heading';

export const PIN_MARKER_RADIUS = 1500;

export interface SignalMapSliderProps {
    radius: number;
    onRadiusChange: (radius: number) => void;
    onCreate: () => void;
    onClose: () => void;
}

export const SignalMapSlider: React.FC<SignalMapSliderProps> = (props) => {
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        container: {
            height: '100%',
            backgroundColor: colors.background,
            paddingLeft: 30,
            paddingRight: 30,
        },
        panel: {
            backgroundColor: colors.background,
            zIndex: 999,
            width: '100%',
            height: 200,
            position: 'absolute',
            bottom: 0,
        },
        panelHeader: {
            backgroundColor: colors.background,
            paddingLeft: 20,
        },
        textHeader: {
            fontSize: 23,
            color: '#FFF',
        },
    });

    return (
        <View style={styles.panel}>
            <View style={styles.panelHeader}>
                <Heading size={21} title={'Avstånd'} />
            </View>
            <View style={styles.container}>
                <View style={{ alignItems: 'center' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            width: '100%',
                        }}>
                        <Text
                            style={{
                                color:
                                    props.radius === 0
                                        ? colors.primary
                                        : colors.text,
                                fontSize: 11,
                                fontWeight: '700',
                                paddingTop: 8,
                                paddingRight: 10,
                                paddingLeft: 5,
                            }}>
                            Given väg
                        </Text>

                        <Text
                            style={{
                                color:
                                    props.radius > 0 &&
                                    props.radius < PIN_MARKER_RADIUS
                                        ? colors.primary
                                        : colors.text,
                                fontSize: 11,
                                fontWeight: '700',
                                paddingTop: 8,
                                paddingRight: 10,
                                paddingLeft: 0,
                            }}>
                            {props.radius === 0 ||
                            props.radius === PIN_MARKER_RADIUS
                                ? 'Dra för att ändra'
                                : props.radius + ' m från markering'}
                        </Text>

                        <Text
                            style={{
                                color:
                                    props.radius === PIN_MARKER_RADIUS
                                        ? colors.primary
                                        : colors.text,
                                fontSize: 11,
                                fontWeight: '700',
                                paddingTop: 8,
                                paddingRight: 10,
                                paddingLeft: 0,
                            }}>
                            Hela staden
                        </Text>
                    </View>

                    <Slider
                        onValueChange={(val) => {
                            setTimeout(() => {
                                props.onRadiusChange(val);
                            }, 200);
                        }}
                        style={{
                            width: '90%',
                            height: 30,
                            alignItems: 'center',
                        }}
                        minimumValue={0}
                        step={1}
                        maximumValue={PIN_MARKER_RADIUS}
                        minimumTrackTintColor={colors.primary}
                        maximumTrackTintColor="#e3e3e3"
                    />
                </View>
                <Button
                    title="Skapa på vald position"
                    color={colors.primary}
                    onPress={props.onCreate}
                />
                <Button
                    title="Avbryt"
                    color={colors.text}
                    onPress={props.onClose}
                />
            </View>
        </View>
    );
};
