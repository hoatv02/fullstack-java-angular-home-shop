// 3. Operator Model

// 4. Operator Service sử dụng ResponseHandlerService
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../assets/i18n/translation.service';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from '../../layout/service/responseHandler.service';
import { ITransaction } from '../../models/ITransaction';
import { activityRouter, requestLogFromCustomRouter } from '../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class RequestLogFromCustomService {
    private http = inject(HttpClient);
    private fileExportService = inject(FileExportService);

    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private apiUrl = environment.APP_API_URL;
    getListData(body: any): Observable<BaseResponse<PaginationResponse<ITransaction[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(requestLogFromCustomRouter.requestLogFromCustomFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('RequestLogFromCustom.LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('RequestLogFromCustom.LOAD_FAIL')
        });
    }

    exportActivityExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(requestLogFromCustomRouter.requestLogFromCustomExport, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }

}
