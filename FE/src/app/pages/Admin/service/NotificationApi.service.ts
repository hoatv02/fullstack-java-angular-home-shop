import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { lisenceRouter } from '../../../utils/consts/router';
@Injectable({ providedIn: 'root' })
export class NotificationApiService {
    constructor(private http: HttpClient) { }

    getNotifications(operatorId: string) {
        return this.http.post<any>(lisenceRouter.getListNotification, { operatorId })
            .pipe(
                catchError(() => of({ code: 500, data: [] }))
            );
    }



    countNotification(operatorId: string) {
        return this.http.post<any>(lisenceRouter.countNotification, { operatorId })
            .pipe(
                catchError(() => of({ code: 500, data: null }))
            );
    }
}
