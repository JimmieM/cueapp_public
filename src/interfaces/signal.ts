import { IPosition } from './position';

export type ListenerType = 'city' | 'street' | 'radius';

export interface ISignal {
    id: number;
    userId: number;
    position: IPosition;
    eventType: number[];
    name: string;
    durationMinutes: number;
    notified: boolean;
    listenerType: ListenerType;
    keywords: string[];
    strictKeywords: boolean;
}

export interface ICreateSignal {
    userId: number;
    position: IPosition;
    keywords: string[];
    strictKeywords: boolean;
    name: string;
    listenerType: ListenerType;
    eventType: number[];
}
