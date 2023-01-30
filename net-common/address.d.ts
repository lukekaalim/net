export interface AddressInfo {
  address: string;
  family: string;
  port: number;
}

export const getLocalAddress: (info: AddressInfo | string, protocol: string) => string;