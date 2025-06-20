import { ForbiddenInUseDeviceOperation } from '@config/errors/device';
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
    this.state = params.state ?? DEVICE_STATE.AVAILABLE;
    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? new Date();
  }

  updateTimestamp() {
    this.updatedAt = new Date();
  }

  /**
   * Updates the state of the device and refreshes the updated timestamp.
   * @param newState - The new state to set for the device.
   */
  updateState(newState: DEVICE_STATE) {
    // Other business logic for updating device state goes here
    this.state = newState;
    this.updateTimestamp();
  }

  /**
   * Updates the name and brand of the device.
   * @throws {ForbiddenInUseDeviceOperation} if the device is currently in use.
   * @param name - The new name for the device.
   * @param brand - The new brand for the device.
   * This method is used to update the device's information, ensuring it is not in use.
   */
  updateInfo(name: string, brand: string) {
    if (this.state === DEVICE_STATE.IN_USE) {
      throw new ForbiddenInUseDeviceOperation('update');
    }
    // Other business logic for updating device info goes here
    this.name = name;
    this.brand = brand;
    this.updateTimestamp();
  }

  /**
   * Determines if the device can be deleted.
   * @returns A boolean indicating whether the device is not in use and can be deleted.
   * This method is used to check if the device is eligible for deletion based on its state.
   */
  canDelete(): boolean {
    return this.state !== DEVICE_STATE.IN_USE;
  }
}
