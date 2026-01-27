
export class PaginationResponse<T> {
  pageNumber!: number;
  pageSize!:   number;
  totalCount!: number;
  dataCount!:  number;
  data!:       T[];
}

export class BaseResponse<T> {
  data!:       T;
  code!:       number;
  statusCode!: number;
  status!: number;
  message!:    string;
  traceId!:    string;
}


export class BaseFilter {
  pageSize!:   number;
  pageNumber!: number;
  status!:     number | boolean | null;
  textSearch!: string;
}
export class BaseFilterField extends BaseFilter {
  propertyName!: string;
  ascending!: string;
}

export interface DropDownModel{
  id: string;
  code: string
  name: string;
}

export interface ApiOptions<T> {
  successMessage?: string;
  errorMessage?: string;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;

  showSpinner?: boolean;
  spinnerId?: string;

  retry?: {
    count?: number;
    delay?: number;
    maxRetries?: number;
    retryCondition?: (error: any) => boolean;
  };
isBlob?: boolean; 
  timeout?: {
    time?: number;
    errorMessage?: string;
  };
}

export interface CheckUrlModel {
  isReachable:  boolean;
  statusCode:   number;
  message:      string;
  responseBody: string | null | undefined;
}
