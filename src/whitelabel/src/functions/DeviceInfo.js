import DeviceInfo from 'react-native-device-info';

export default function getFreeDiskStorage() {
  DeviceInfo.getFreeDiskStorage().then((freeDiskStorage) => {
    let freeStorageInMB = freeDiskStorage / 1024 / 1024;
    freeStorageInMB = parseInt(freeStorageInMB + '');
    return freeStorageInMB;
  });
}
