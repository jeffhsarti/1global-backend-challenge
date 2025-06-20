export class DeviceNotFoundError extends Error {
  constructor(id: string) {
    super(`Device with id ${id} not found`);
    this.name = 'DeviceNotFoundError';
  }
}

export class ForbiddenInUseDeviceOperation extends Error {
  constructor(operation: 'update' | 'delete') {
    super(`Cannot ${operation} device while state is IN_USE`);
    this.name = 'ForbiddenInUseDeviceOperation';
  }
}

export class InvalidDeviceStateError extends Error {
  constructor(state: any) {
    super(`State ${state} is not a valid device state`);
    this.name = 'InvalidDeviceStateError';
  }
}
