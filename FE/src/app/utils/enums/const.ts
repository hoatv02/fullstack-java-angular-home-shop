export interface expandedRows {
    [key: string]: boolean;
}
// AUTHENTICATION
export const LOCAL_STORAGE_AUTH_KEY = 'AUTH_DATA';
export const NOSPECIALCHARREGEX = /^[\p{L}\p{N}\s_-]*$/u;
export const NOSPECIALCHARREGEX_CODE = /^[A-Za-z0-9_-]*$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
export const PHONE_REGEX = /^[0-9+\-\s]{8,15}$/;
export const POSITIVE_INTEGER_REGEX = /^[1-9][0-9]*$/;