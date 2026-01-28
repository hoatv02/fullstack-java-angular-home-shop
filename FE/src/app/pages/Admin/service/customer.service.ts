import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { Observable } from 'rxjs';
import { customerRouter } from '../../../utils/consts/router';
import { ICustomer, IDeviceInfo } from '../../../models/ICustomer';
import { FileExportService } from './FileExport.service';
import { TranslationService } from '../../../../assets/i18n/translation.service';

@Injectable()
export class CustomerService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private fileExportService = inject(FileExportService);
    private translationService = inject(TranslationService);
    private apiUrl = environment.APP_API_URL;

    // ==================== CUSTOMER REPORT ====================
    getListReportCustomer(body: any): Observable<BaseResponse<PaginationResponse<ICustomer[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(customerRouter.reportCustomer, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.REPORT_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.REPORT_LOAD_FAIL')
        });
    }

    // ==================== CUSTOMER LIST ====================
    getListDataCustomer(body: any): Observable<BaseResponse<PaginationResponse<ICustomer[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(customerRouter.customerFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.LIST_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.LIST_LOAD_FAIL')
        });
    }
    senOtpDevice(body: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<ICustomer>>(customerRouter.sendOtpDevice + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }
    senOtpCustomer(body: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<ICustomer>>(customerRouter.sendOtpCustomer + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }

    downloadFilePem(id: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<ICustomer>>(customerRouter.downloadFilPem + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('Common.DownloadPemSuccess'),
            errorMessage: this.translationService.translate('Common.DownloadPemError')
        });
    }
    getListDataCustomerDevice(body: any): Observable<BaseResponse<IDeviceInfo[]>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(customerRouter.customerDeviceFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_LIST_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_LIST_LOAD_FAIL')
        });
    }

    getDataDetailCustomerDevice(id: any): Observable<BaseResponse<IDeviceInfo[]>> {
        return this.responseHandler.handleApiCall(this.http.get<any>(customerRouter.customerDataDetailDevice + id), {
            showSuccessMessage: false,
        });
    }

    getDetailDeviceCustomer(body: any): Observable<BaseResponse<IDeviceInfo[]>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(customerRouter.customerDetailDeviceCustomer, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_DETAIL_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_DETAIL_LOAD_FAIL')
        });
    }
    getDetailDevice(id: any): Observable<BaseResponse<IDeviceInfo[]>> {
        return this.responseHandler.handleApiCall(this.http.get<any>(customerRouter.customerDetailDevice + id), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_DETAIL_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.DEVICE_DETAIL_LOAD_FAIL')
        });
    }

    // ==================== CUSTOMER DETAIL ====================
    getCustomerById(body: { requestId: string }): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<ICustomer>>(customerRouter.customerById, body), {
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.DETAIL_LOAD_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.DETAIL_LOAD_FAIL')
        });
    }

    // ==================== SEND OTP ====================
    sendOtpDevice(body: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<ICustomer>>(customerRouter.sendOtpDevice + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }

    // ==================== CREATE CUSTOMER ====================
    createCustomer(ICustomer: Omit<ICustomer, 'requestId'>): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<ICustomer>>(customerRouter.customerCreate, ICustomer), {
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.CREATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.CREATE_FAIL'),
            onSuccess: () => {
                this.router.navigate(['/administration']);
            }
        });
    }

    // ==================== UPDATE CUSTOMER ====================
    updateCustomer(ICustomer: ICustomer): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<ICustomer>>(customerRouter.customerUpdate, ICustomer), {
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.UPDATE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.UPDATE_FAIL'),
            onSuccess: () => {
                this.router.navigate(['/administration']);
            }
        });
    }

    updateCustomerDeviceStatusLock(lock: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<ICustomer>>(customerRouter.DeviceUpdateStatusLock, lock), {
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.STATUS_LOCK_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.STATUS_LOCK_FAIL')
        });
    }
    updateCustomerStatusLock(lock: any): Observable<BaseResponse<ICustomer>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<ICustomer>>(customerRouter.customerUpdateStatusLock, lock), {
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.STATUS_LOCK_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.STATUS_LOCK_FAIL')
        });
    }

    // ==================== DELETE CUSTOMER ====================
    deleteCustomer(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<void>>(customerRouter.customerRemove + id, null), {
            showSuccessMessage: true,
            showErrorMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.DELETE_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.DELETE_FAIL')
        });
    }

    // ==================== EXPORT ====================

    exportCustomerExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(customerRouter.customerExport, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }


    exportStatisticalCustomerExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(customerRouter.customerExportReport, payload, fileName, typeFile);
    }
    // ==================== SEARCH ====================
    searchICustomers(keyword: string): Observable<BaseResponse<ICustomer[]>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<ICustomer[]>>(`${this.apiUrl}/search?q=${keyword}`));
    }
}
