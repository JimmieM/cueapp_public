import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

interface TagProps {
    name: string;
    hideClose?: boolean;
    onClose?: () => void;
    small?: boolean;
}
export const Tag: React.FC<TagProps> = (props) => {
    const { colors } = useTheme();
    return (
        <View
            style={{
                borderRadius: 3,
                backgroundColor: colors.primary,

                padding: props.small ? 2 : 5,
                marginRight: 10,
                marginTop: 5,
                marginBottom: 5,
            }}>
            <Text
                style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: props.small ? 12 : 13,
                    paddingLeft: 7,
                    paddingRight: !props.hideClose ? 19 : 7,
                }}>
                {props.name}
            </Text>
            {!props.hideClose && (
                <Ionicons
                    onPress={() => {
                        props.onClose && props.onClose();
                    }}
                    color="white"
                    size={25}
                    name={'ios-close'}
                    style={{
                        position: 'absolute',
                        top: 2,
                        right: 10,
                    }}
                />
            )}
        </View>
    );
};
