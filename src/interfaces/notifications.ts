import { IEvent } from './event';

export interface INotification {
    id: number;
    signalId: number;
    event: IEvent;
    datetime: Date;
    timeago: string;
}
