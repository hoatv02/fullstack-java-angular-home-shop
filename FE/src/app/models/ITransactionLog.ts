export interface ITransactionLog {
    id: string;
    sessionId: string;
    paymentId: string;
    deviceId: string;
    paymentInfo: string;
    type: number;
    userId: string;
    status: number;
    reason: string;
    createdAt: string;
}