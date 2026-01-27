export class FormInputModel {
  textSearch?: string = '';
  pageSize?: number = 10;
  pageNumber?: number = 0;
  size?: number = 10;
  page?: number = 0;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  status?: string | number;
  httpCode?: string;
  from?: string | null;
  to?: string | null;
  httpStatusCode?: string | null;
  fromDate?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  toDate?: string | null;
  userType?: string | number;
  userId?: string;
  os?: string;
  type?: string;
  validationStatus?: string;
  storageType?: string;
  otpGroup?: string;
  transactionCode?: string;
  transactionType?: string;
  serviceName?: string;
  roleId?: string;
  customerType?: number;
  username?: string;
  httpMethod?: string;
  httpStatus?: string;
  typeTransaction?: string;
  constructor(init?: Partial<FormInputModel>) {
    Object.assign(this, init);
  }
}
