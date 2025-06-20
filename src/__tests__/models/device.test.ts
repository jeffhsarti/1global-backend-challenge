import { Device } from '../../domain/models/device';
import { DEVICE_STATE } from '../../domain/enums/device-state';
import { ForbiddenInUseDeviceOperation } from '../../config/errors/device';

describe('Device Model', () => {
  it('should update state and timestamp', () => {
    const device = new Device({
      id: '1',
      name: 'Test Device',
      brand: 'Test Brand',
    });

    const initialUpdatedAt = device.updatedAt;
    device.updateState(DEVICE_STATE.IN_USE);

    expect(device.state).toBe(DEVICE_STATE.IN_USE);
    expect(device.updatedAt).not.toBe(initialUpdatedAt);
  });

  it('should throw error when updating info of a device in use', () => {
    const device = new Device({
      id: '1',
      name: 'Test Device',
      brand: 'Test Brand',
      state: DEVICE_STATE.IN_USE,
    });

    expect(() => {
      device.updateInfo('New Name', 'New Brand');
    }).toThrow(ForbiddenInUseDeviceOperation);
  });

  it('should update name and brand when device is not in use', () => {
    const device = new Device({
      id: '1',
      name: 'Original Name',
      brand: 'Original Brand',
      state: DEVICE_STATE.AVAILABLE,
    });

    device.updateInfo('New Name', 'New Brand');

    expect(device.name).toBe('New Name');
    expect(device.brand).toBe('New Brand');
  });

  it('should return false for canDelete when device is in use', () => {
    const device = new Device({
      id: '1',
      name: 'Test Device',
      brand: 'Test Brand',
      state: DEVICE_STATE.IN_USE,
    });

    expect(device.canDelete()).toBe(false);
  });

  it('should return true for canDelete when device is not in use', () => {
    const device = new Device({
      id: '1',
      name: 'Test Device',
      brand: 'Test Brand',
      state: DEVICE_STATE.AVAILABLE,
    });

    expect(device.canDelete()).toBe(true);
  });
});
