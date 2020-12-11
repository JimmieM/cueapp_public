import React from 'react';
import { Button } from 'native-base';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Heading } from './heading';

interface ModalAlertProps {
    onClose: (pressedYes: boolean) => void;
    title: string;
    description: string;
    continueBtnTitle: string;
}

export const ModalAlert: React.FC<ModalAlertProps> = (props) => {
    const { onClose, title, description, continueBtnTitle } = props;
    const { colors } = useTheme();

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 0,
        },
        center: {
            alignItems: 'center',
        },
        modalView: {
            width: '85%',
            minHeight: '23%',
            display: 'flex',
            margin: 20,
            backgroundColor: colors.card,
            borderRadius: 15,
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 5,
        },
        containersWrapper: {
            alignItems: 'center',
        },
        buttons: {
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
            padding: 10,
        },
        button: {
            backgroundColor: colors.primary,
            flex: 1,
            margin: 5,
        },
        buttonText: {
            textAlign: 'center',
            alignSelf: 'center',
            fontWeight: 'bold',
            fontSize: 18,
            color: 'white',
            flex: 1,
        },
    });

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Modal animationType="slide" transparent={true} visible={true}>
                    <View style={styles.centeredView}>
                        <View
                            style={{
                                ...styles.modalView,
                            }}>
                            <Heading size={28} title={title} />
                            <Text
                                style={{
                                    color: 'white',
                                    marginTop: 5,
                                    marginLeft: 15,
                                    marginBottom: 7,
                                    fontSize: 15,
                                    width: '90%',
                                }}>
                                {description}
                            </Text>

                            <View style={styles.buttons}>
                                <Button
                                    style={{
                                        ...styles.button,
                                        backgroundColor: '#545454',
                                    }}
                                    onPress={() => {
                                        onClose(false);
                                    }}>
                                    <Text style={styles.buttonText}>Stäng</Text>
                                </Button>
                                <Button
                                    style={styles.button}
                                    onPress={() => {
                                        onClose(true);
                                    }}>
                                    <Text style={styles.buttonText}>
                                        {continueBtnTitle}
                                    </Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
