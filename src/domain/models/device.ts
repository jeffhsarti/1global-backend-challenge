import { DEVICE_STATE } from '@domain/enums/device-state';

export class Device {
  public readonly id: string;
  public name: string;
  public brand: string;
  public state: DEVICE_STATE;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    brand: string;
    state?: DEVICE_STATE;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.brand = params.brand;
    this.state = params.state ?? DEVICE_STATE.ACTIVE;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
