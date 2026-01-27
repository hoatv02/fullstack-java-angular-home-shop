import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../assets/i18n/translation.service';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from '../../layout/service/responseHandler.service';
import { ITransactionLog } from '../../models/ITransactionLog';
import { otpRouter, systemLogRouter } from '../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class StatisticalOtpService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy thống kê Smart OTP */
    getStatisticalSmartOtp(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(otpRouter.smartOtpLogFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.STATISTICAL_OTP.SMART_OTP.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.STATISTICAL_OTP.SMART_OTP.FAIL')
            }
        );
    }

    /** Xuất file RAS Service */
    exportRasServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportRasService, payload, fileName, typeFile);
    }

    /** Xuất file SAM Service */
    exportSamServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportSamService, payload, fileName, typeFile);
    }

    /** Xuất file OTP Service */
    exportOTPServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportOTPService, payload, fileName, typeFile);
    }

    /** Xuất file RAS Service */
    exportStatisticalOtpExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.exportStatisticalOtp, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }


}
