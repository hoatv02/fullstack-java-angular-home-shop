export interface ITransaction {
    id: string;
    requestTime: string;       // hoặc Date nếu muốn parse về Date
    responseTime: string;      // hoặc Date
    responseStatus: string;    // "200" → có thể để string hoặc number
    requestMethod: string;     // "POST", "GET", ...
    requestIp: string;
    requestPath: string;
    actionCode: string;
    actionName: string;
    group: string;
    message: string;
    traceId: string;
    hmac: string;
    userId: string;
    username: string;
    fullName: string;
    processTime: number;
}
