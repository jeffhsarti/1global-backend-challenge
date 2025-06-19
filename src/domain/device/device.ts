import { DEVICE_STATE } from '../enums/device-state';

export interface Device {
  id: string;
  name: string;
  brand: string;
  state: DEVICE_STATE;
  createdAt: Date;
  updatedAt: Date;
}
