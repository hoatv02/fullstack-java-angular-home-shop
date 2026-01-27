import { LOCAL_STORAGE_AUTH_KEY } from "../../utils/enums/const";

export default function deCodeAccessToken() {
    const dataAuth = JSON.parse(localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) || '{}');
    const token = dataAuth.accessToken;
    if (!token) return null;

    try {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = atob(payloadBase64);
        return JSON.parse(decodedPayload);
    } catch (error) {
        return null;
    }
}
export function formatLabel(key: string) {
    return key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());
}
