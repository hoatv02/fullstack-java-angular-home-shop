export interface ICustomer {
    id?: string;
    code: string;
    name: string;
    description: string;
    status: boolean;
    createdUserId: string;
    createdDate: string | Date;
    modifiedUserId: string;
    modifiedDate: string | Date;
}

export interface IDeviceInfo {
  id: string;
  createdAt: string;     // ISO datetime string
  updatedAt: string;     // ISO datetime string
  userId: string;
  deviceId: string;
  deviceName: string;
  serialNumber: string;
  imei: string;
  os: string;
  osVersion: string;
  ipAddress: string;
  macAddress: string;
  lastActivity: string;  // ISO datetime string
  type: 'MOBILE' | 'DESKTOP' | 'TABLET' | string; // nếu sau này có nhiều loại khác
  status: number;        // 0 = inactive?, 1 = active? (tùy backend quy định)
  brandName: string;
  model: string;
}
