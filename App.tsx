import * as Font from 'expo-font';
import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { Text } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { Root } from 'native-base';
import { NavigationContainer, Theme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home } from './src/components/screens/home';
import { Signals } from './src/components/screens/signals';
import { AsyncStorage, View } from 'react-native';
import { usePush } from './src/hooks/use-push';
import { Tutorial } from './src/components/screens/tutorial';
import { Profile } from './src/components/screens/profile';
import { AppStateProvider } from './src/components/app-state';
import { EventsMap } from './src/components/screens/events-map';
import { EventMapSelector } from './src/components/events/events-map-selector';
import { IEvent } from './src/interfaces/event';
import { useEvents } from './src/hooks/use-events';

export const primaryColor = '#06d6a0'; //#06d6a0
export const secondPrimaryColor = '#c77dff';

export const AppRoot = () => {
    const Tab = createBottomTabNavigator();
    const [profileOpen, setProfileOpen] = useState(false);

    const { suggestLocation } = useEvents(true);

    const [
        showProposeLocationModal,
        setShowProposeLocationModal,
    ] = useState<IEvent | null>(null);

    // 619b8a
    // 84a59d
    // 9381ff
    // 02c39a
    // e56b6f
    // ce796b
    // da627d
    // 3dccc7

    const darkTheme: Theme = {
        dark: true,
        colors: {
            primary: primaryColor,
            background: '#151515',
            text: '#e3e3e3',
            border: '',
            card: '#212121',
            notification: '',
        },
    };

    const tabBarOptions = {
        inactiveBackgroundColor: '#151515',
        activeBackgroundColor: '#212121',
        showLabel: false,
        safeAreaInsets: {
            bottom: 0,
            top: 0,
        },

        style: {
            minHeight: 75,
            backgroundColor: '#151515',
            borderColor: '#151515',
        },
    };

    //const scheme = useColorScheme();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: '#151515',
            }}>
            <Root>
                <NavigationContainer theme={darkTheme}>
                    {showProposeLocationModal && (
                        <EventMapSelector
                            onClose={(region, radius) => {
                                if (region) {
                                    suggestLocation(
                                        {
                                            eventId:
                                                showProposeLocationModal.id,
                                            location: {
                                                gps: {
                                                    lat: region?.latitude,
                                                    lng: region?.longitude,
                                                },
                                                radius: radius || 0,
                                                timestamp: Date.now(),
                                            },
                                        },
                                        () => {
                                            setShowProposeLocationModal(null);
                                        },
                                    );
                                }
                                setShowProposeLocationModal(null);
                            }}
                            event={showProposeLocationModal}
                            promptOptions={{
                                title: 'Föreslå händelse position här?',
                                description: '',
                                input: false,
                                ContinueBtntitle: 'Föreslå',
                            }}
                            consentModal={{
                                title: 'Föreslå händelseplats',
                                description:
                                    'Använd kartan för att föreslå en specifik plats där du tror eller vet att denna händelse utspelade sig.',
                            }}
                        />
                    )}

                    {
                        <Profile
                            open={profileOpen}
                            onClose={() => {
                                setProfileOpen(false);
                            }}
                        />
                    }
                    <Tab.Navigator
                        screenOptions={({ route }) => ({
                            tabBarIcon: () => {
                                let iconName = '🦊';
                                if (route.name === 'Flöde') {
                                    iconName = '📰';
                                } else if (route.name === 'Signaler') {
                                    iconName = '🔔';
                                } else {
                                    iconName = '🗺️';
                                }
                                return (
                                    <Text
                                        style={{
                                            fontSize: 28,
                                        }}>
                                        {iconName}
                                    </Text>
                                );
                            },
                        })}
                        tabBarOptions={tabBarOptions}>
                        <Tab.Screen name="Flöde" component={Home} />
                        <Tab.Screen name="Karta" component={EventsMap} />
                        <Tab.Screen name="Signaler" component={Signals} />
                    </Tab.Navigator>
                </NavigationContainer>
            </Root>
        </View>
    );
};

function App() {
    const [loaded, setLoaded] = useState(false);
    const [state, setState] = useState<'loading' | 'tutorial' | 'root'>(
        'loading',
    );
    const [updateDeviceToken] = usePush();

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                Roboto: require('native-base/Fonts/Roboto.ttf'),
                Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
                ...Ionicons.font,
            });
        };

        const LoadTutorial = async () => {
            try {
                const value = await AsyncStorage.getItem('TutorialDone');
                if (value !== null) {
                    setState('root');
                } else {
                    setState('tutorial');
                }
            } catch (e) {
                setState('tutorial');
            }
        };

        loadFonts();
        LoadTutorial();

        setLoaded(true);
    }, []);

    useEffect(() => {
        if (state === 'root') {
            updateDeviceToken();
        }
    }, [state, updateDeviceToken]);

    const RenderContent = useCallback(() => {
        return state === 'loading' ? (
            <View
                style={{
                    flex: 1,
                    backgroundColor: '#151515',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        alignSelf: 'center',
                        color: '#e3e3e3',
                    }}>
                    Laddar ...
                </Text>
            </View>
        ) : state === 'tutorial' ? (
            <Tutorial
                onTutorialDone={() => {
                    setState('root');
                }}
            />
        ) : (
            <AppRoot />
        );
    }, [state]);

    return loaded ? (
        RenderContent()
    ) : (
        <View
            style={{
                backgroundColor: '#151515',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        />
    );
}

export default () => (
    <AppStateProvider>
        <App />
    </AppStateProvider>
);
