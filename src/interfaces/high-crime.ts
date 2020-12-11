import { ILatLng, IPosition } from './position';

export interface IHighCrime {
    id?: number;
    position: IPosition;
    eventType: number;
    created?: Date;
    updated?: Date;
    eventIds: number[];
    eventLocations: ILatLng[];
    eventsIsWithinMinutes: number;
}
