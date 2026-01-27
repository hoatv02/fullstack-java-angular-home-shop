import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../assets/i18n/translation.service';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from '../../layout/service/responseHandler.service';
import { FileExportService } from './FileExport.service';
import { configRouter, systemLogRouter } from '../../utils/consts/router';

@Injectable({
    providedIn: 'root'
})
export class ConfigOtpService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    // ==================== OTP CONFIG ====================
    getListDataOtpConfig(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.OtpConfigFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.OTP_CONFIG.LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.OTP_CONFIG.LOAD_FAIL')
        });
    }

    createConfigOtp(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.creatOtpConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.OTP_CONFIG.CREATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.OTP_CONFIG.CREATE_FAIL')
        });
    }

    getConfigOtp(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getOtpConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.OTP_CONFIG.DETAIL_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.OTP_CONFIG.DETAIL_FAIL')
        });
    }

    updateConfigOtp(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.put<any>(configRouter.creatOtpConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.OTP_CONFIG.UPDATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.OTP_CONFIG.UPDATE_FAIL')
        });
    }
    getOtpOcraSMS(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getOtpOcraSMS + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }
    getOtpMail(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getOtpMail + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }
    deleteConfigOtp(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.delete<any>(configRouter.getOtpConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.OTP_CONFIG.DELETE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.OTP_CONFIG.DELETE_FAIL')
        });
    }

    // ==================== PIN CONFIG ====================
    getListDataPinOtpConfig(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.PinConfigFilter, body), {
            showSuccessMessage: false,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.LOAD_FAIL')
        });
    }

    createConfigPinOtp(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.creatPinConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.CREATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.CREATE_FAIL')
        });
    }

    getConfigPin(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getPinConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DEATAIL_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DEATAIL_FAIL')
        });
    }
    getConfigPinDefault(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getPinConfigDefault), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DEATAIL_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DEATAIL_FAIL')
        });
    }

    updateConfigPIN(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.put<any>(configRouter.updatePinConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.UPDATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.UPDATE_FAIL')
        });
    }
    sendOtpPin(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getOtpPin + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }
    deleteConfigPin(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.delete<any>(configRouter.getPinConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DELETE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.PIN_CONFIG.DELETE_FAIL')
        });
    }

    // ==================== EMAIL CONFIG ====================
    getListDataEmailConfig(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.emailConfigFilter, body), {
            showSuccessMessage: false,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.LOAD_FAIL')
        });
    }

    createConfigEmail(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.post<any>(configRouter.createEmailConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.CREATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.CREATE_FAIL')
        });
    }

    getConfigEmail(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getEmailConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DETAIL_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DETAIL_FAIL')
        });
    }
    getConfigEmailDefault(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(configRouter.getEmailConfigDefault), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DETAIL_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DETAIL_FAIL')
        });
    }

    updateConfigEmail(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.put<any>(configRouter.updateEmailConfig, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.UPDATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.UPDATE_FAIL')
        });
    }

    deleteConfigEmail(id: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.delete<any>(configRouter.deleteEmailConfig + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DELETE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.EMAIL_CONFIG.DELETE_FAIL')
        });
    }

    // ==================== EXPORT FILES ====================
    exportRasServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportRasService, payload, fileName, typeFile);
    }

    exportSamServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportSamService, payload, fileName, typeFile);
    }

    exportOTPServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportOTPService, payload, fileName, typeFile);
    }
}
