// 3. Operator Model

// 4. Operator Service sử dụng ResponseHandlerService
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { ITransactionLog } from '../../../models/ITransactionLog';
import { activityRouter, deviceRouter, systemLogRouter, transactionLogRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    getListData(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(deviceRouter.deviceFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.DEVICE.LIST.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.DEVICE.LIST.FAIL')
            }
        );
    }
    historyDevice(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(deviceRouter.historyDevice, body),
            {
                showSuccessMessage: false,
                successMessage: this.translationService.translate('SERVICE.DEVICE.LIST.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.DEVICE.LIST.FAIL')
            }
        );
    }
    historyUser(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(deviceRouter.historyUser, body),
            {
                showSuccessMessage: false,
                successMessage: this.translationService.translate('SERVICE.DEVICE.LIST.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.DEVICE.LIST.FAIL')
            }
        );
    }

    exportRasServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportRasService, payload, fileName, typeFile);
    }
    exportSamServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportSamService, payload, fileName, typeFile);
    }
    exportOTPServiceExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(systemLogRouter.exportOTPService, payload, fileName, typeFile);
    }



    exportStatisticalDeviceExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.exportStatisticalDevice, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }
    exportDeviceExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(systemLogRouter.exportDevice, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }

}
