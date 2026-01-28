import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { ITransaction } from '../../../models/ITransaction';
import { lisenceRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';

@Injectable({
    providedIn: 'root'
})
export class LisenceService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy thông tin license */
    getData(): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(lisenceRouter.lisenceFilter),
            {
                showSuccessMessage: false,
                successMessage: this.translationService.translate('SERVICE.LICENSE.GET.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.LICENSE.GET.FAIL')
            }
        );
    }
    getDataExpired(): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(lisenceRouter.lisenceExpired),
            {
                showSuccessMessage: false,
                successMessage: this.translationService.translate('SERVICE.LICENSE.GET.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.LICENSE.GET.FAIL')
            }
        );
    }
    getDataNotification(body: any): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(lisenceRouter.getListNotification, body),
            {
                showSuccessMessage: false,
                showSpinner: false,
                successMessage: this.translationService.translate('SERVICE.LICENSE.GET.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.LICENSE.GET.FAIL')
            }
        );
    }

    readNotification(body: any): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(lisenceRouter.readNotification, body),
            {
                showSuccessMessage: false,
                showSpinner: false,
                successMessage: this.translationService.translate('SERVICE.LICENSE.GET.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.LICENSE.GET.FAIL')
            }
        );
    }
    /** Upload file license XML mới */
    uploadFileXML(body: any): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(lisenceRouter.uploadFileXml, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.LICENSE.UPLOAD.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.LICENSE.UPLOAD.FAIL')
            }
        );
    }
    // 

}
