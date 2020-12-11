import { IPosition } from './position';

export interface IUser {
    id: number;
    device_os: string;
    device_token: string;
    premium: boolean;
    created: Date;
    position: IPosition;
}
