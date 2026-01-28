import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { dashboardRouter, systemLogRouter } from '../../../utils/consts/router';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy báo cáo tổng quan Admin */
    getAdminSummaryReport(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(dashboardRouter.adminSummaryReport), {
            showSuccessMessage: false,
            successMessage: this.translationService.translate('SERVICE.REPORT.ADMIN_SUMMARY.SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.REPORT.ADMIN_SUMMARY.FAIL')
        });
    }

    /** Lấy báo cáo tổng quan OTP */
    getAdminSummaryReportOTP(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(dashboardRouter.adminSummaryReportOTP), {
            showSuccessMessage: false,
            successMessage: this.translationService.translate('SERVICE.REPORT.ADMIN_SUMMARY_OTP.SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.REPORT.ADMIN_SUMMARY_OTP.FAIL')
        });
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
}
