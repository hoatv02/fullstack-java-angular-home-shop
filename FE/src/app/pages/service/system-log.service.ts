import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../assets/i18n/translation.service';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from '../../layout/service/responseHandler.service';
import { ITransactionLog } from '../../models/ITransactionLog';
import { systemLogRouter } from '../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class SystemLogService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy danh sách nhật ký SAM Service */
    getListDataSam(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.samLogFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.SAM.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.SAM.FAIL')
            }
        );
    }

    /** Lấy danh sách nhật ký RAS Service */
    getListDataRas(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.rasLogFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.RAS.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.RAS.FAIL')
            }
        );
    }
    /** Filter service */
    getListDataService(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.filterService, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.RASService.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.RASService.FAIL')
            }
        );
    }
    /** Lấy danh sách nhật ký OTP Service */
    getListDataOTP(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.otpLogFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.OTP.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.SYSTEM_LOG.OTP.FAIL')
            }
        );
    }

    /** Xuất file RAS Service */
    exportSystemLogServiceExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.exportRasService, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }

    /** Xuất file SAM Service */
    exportSamServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportSamService, payload, fileName, typeFile);
    }

    /** Xuất file OTP Service */
    exportOTPServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportOTPService, payload, fileName, typeFile);
    }
}
