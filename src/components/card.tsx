import React from 'react';
import { Text, Card, CardItem, Body } from 'native-base';

export interface CustomCardProps {
    title: string;
    text: string;
}
export const CustomCard: React.FC<CustomCardProps> = (props) => {
    return (
        <Card
            style={{
                borderRadius: 10,
                width: '95%',
                backgroundColor: '#2a2a2a',
                borderWidth: 0,
                height: 120,
                borderColor: 'transparent',
            }}>
            <CardItem
                style={{
                    backgroundColor: '#2a2a2a',
                    borderWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: 10,
                }}>
                <Text
                    style={{
                        color: '#e3e3e3',
                        fontSize: 24,
                        fontWeight: 'bold',
                    }}>
                    {props.title}
                </Text>
            </CardItem>

            <CardItem
                style={{
                    backgroundColor: '#2a2a2a',
                    borderWidth: 0,
                    borderColor: 'transparent',
                    borderRadius: 10,
                }}>
                <Body>
                    <Text style={{ color: '#e3e3e3' }}>{props.text}</Text>
                </Body>
            </CardItem>
        </Card>
    );
};
