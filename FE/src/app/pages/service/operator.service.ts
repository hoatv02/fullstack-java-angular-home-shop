// 3. Operator Model

// 4. Operator Service sử dụng ResponseHandlerService
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseHandlerService } from '../../layout/service/responseHandler.service';
import { BaseResponse, PaginationResponse } from '../../utils/res/app.response';
import { operatorRouter, transactionLogRouter } from '../../utils/consts/router';
import { Operator } from '../../models/IOperator';
import { Router } from '@angular/router';
import { FileExportService } from './FileExport.service';
import { TranslationService } from '../../../assets/i18n/translation.service';

@Injectable({
    providedIn: 'root'
})
export class OperatorService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private fileExportService = inject(FileExportService);
    private translationService = inject(TranslationService);
    private router = inject(Router);
    private apiUrl = environment.APP_API_URL;
    // Lấy danh sách sản phẩm
    getListDataOperator(body: any): Observable<BaseResponse<PaginationResponse<Operator[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(operatorRouter.operatorFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('Administration.Service.GetListDataOperator.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.GetListDataOperator.ErrorMessage')
        });
    }
    // Lấy danh sách dropdown permission
    getDataDropdownPermissionRole(body: any): Observable<BaseResponse<PaginationResponse<any[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(operatorRouter.dropdownRolePermission, body), {
            showSuccessMessage: false,
        });
    }
    // Lấy chi tiết sản phẩm với retry logic mạnh
    getOperatorById(body: { requestId: string }): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(operatorRouter.operatorById, body), {
            showSuccessMessage: false,
            showErrorMessage: false,
            successMessage: this.translationService.translate('Administration.Service.GetOperatorById.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.GetOperatorById.ErrorMessage')
        });
    }

    // Tạo sản phẩm mới
    createOperator(Operator: Omit<Operator, 'requestId'>): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(operatorRouter.operatorCreate, Operator), {
            successMessage: this.translationService.translate('Administration.Service.CreateOperator.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.CreateOperator.ErrorMessage'),
            onSuccess: (data) => {
                this.router.navigate(['/admin']);
            },
        });
    }
    updateOperator(Operator: Operator): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(operatorRouter.operatorUpdate, Operator), {
            successMessage: this.translationService.translate('Administration.Service.UpdateOperator.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.UpdateOperator.ErrorMessage'),
            onSuccess: (data) => {
                this.router.navigate(['/admin']);
            },
        });
    }

    updateOperatorModal(Operator: Operator): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(operatorRouter.operatorUpdate, Operator), {
            successMessage: this.translationService.translate('Administration.Service.UpdateOperator.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.UpdateOperator.ErrorMessage'),

        });
    }
    deleteOperator(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<void>>(operatorRouter.operatorRemove + id, null), {
            showSuccessMessage: true,
            showErrorMessage: true,
            successMessage: this.translationService.translate('Administration.Service.DeleteOperator.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.DeleteOperator.ErrorMessage'),
            onSuccess: () => { }
        });
    }
    resetPasswordOperator(body: any): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(operatorRouter.resetPasswordOperator, body),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Operator.ResetPassword.Success'),
                errorMessage: this.translationService.translate('Administration.Operator.ResetPassword.Error'),
                onSuccess: () => { }
            }
        );
    }

    activeStatusOperator(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(operatorRouter.operatorRemove + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Operator.ChangeStatus.Success'),
                errorMessage: this.translationService.translate('Administration.Operator.ChangeStatus.Error'),
                onSuccess: () => { }
            }
        );
    }

    exportOperatorExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(operatorRouter.operatorExport, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }


    // Tìm kiếm sản phẩm với timeout ngắn
    searchOperators(keyword: string): Observable<BaseResponse<Operator[]>> {
        return this.responseHandler.handleApiCall(this.http.get<BaseResponse<Operator[]>>(`${this.apiUrl}/search?q=${keyword}`));
    }

    activeStatusOperators(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(operatorRouter.activeStatusOperators + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Success'),
                errorMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Error'),
                onSuccess: () => { }
            }
        );
    }

    deActiveStatusOperator(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(operatorRouter.deActiveStatusOperator + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Success'),
                errorMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Error'),
                onSuccess: () => { }
            }
        );
    }
}
