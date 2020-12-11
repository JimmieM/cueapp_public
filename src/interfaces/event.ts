import { IPosition } from './position';

export type LocationGPSType = 'initial' | 'authorized' | 'suggested';
export interface IEvent {
    id: number;
    datetime: string | Date;
    updated: string | Date;
    authorized: boolean;
    approves?: number;
    timeago: string;
    updatedTimeago: string;
    name: string;
    summary: string;
    url: string;
    suggestedEvents?: IEvent[];
    type: string;
    extraTypes?: string[];
    keywords: string[];
    LocationGPSType: LocationGPSType;
    location: IPosition;
    crime_rate_recorded: boolean;
    archived: boolean;
}

export interface ICreateSuggestedEvent {
    type: number;
    location: IPosition;
    description: string;
}

export interface ISuggestEventLocation {
    eventId: number;
    id?: number;
    location: IPosition;
}
