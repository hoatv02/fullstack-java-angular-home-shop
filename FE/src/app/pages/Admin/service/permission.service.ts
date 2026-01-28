// 3. Operator Model

// 4. Operator Service sử dụng ResponseHandlerService
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { Operator } from '../../../models/IOperator';
import { IPermission } from '../../../models/IPermission';
import { permissionRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { TranslationService } from '../../../../assets/i18n/translation.service';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private apiUrl = environment.APP_API_URL;
    // Lấy danh sách sản phẩm
    getListDataPermission(body: any): Observable<BaseResponse<PaginationResponse<Operator[]>>> {
        return this.responseHandler.handleApiCall(this.http.post<any>(permissionRouter.permissionFilter, body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('Administration.Service.GetListDataPermission.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.GetListDataPermission.ErrorMessage')
        });
    }

    // Lấy chi tiết sản phẩm với retry logic mạnh
    getPermissionById(id: string): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(permissionRouter.permissionById + id, null), {
            successMessage: this.translationService.translate('Administration.Service.GetPermissionById.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.GetPermissionById.ErrorMessage')
        });
    }
    // Lấy chi tiết sản phẩm với retry logic mạnh
    getMenuPermission(id: string): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(permissionRouter.permissionByIdCheckMenu + id, null), {
            showSuccessMessage: false,
            successMessage: this.translationService.translate('Administration.Service.GetPermissionById.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.GetPermissionById.ErrorMessage')
        });
    }
    // Tạo sản phẩm mới
    createPermission(permission: Omit<IPermission, 'id'>): Observable<BaseResponse<IPermission>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<IPermission>>(permissionRouter.permissionCreate, permission), {
            successMessage: this.translationService.translate('Administration.Service.CreatePermission.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.CreatePermission.ErrorMessage'),
            onSuccess: (data) => {
                this.router.navigate(['/role']);
            },
        });
    }
    updatePermission(permission: IPermission): Observable<BaseResponse<Operator>> {
        return this.responseHandler.handleApiCall(this.http.post<BaseResponse<Operator>>(permissionRouter.permissionUpdate, permission), {
            successMessage: this.translationService.translate('Administration.Service.UpdatePermission.SuccessMessage'),
            errorMessage: this.translationService.translate('Administration.Service.UpdatePermission.ErrorMessage'),
            onSuccess: (data) => {
                this.router.navigate(['/role']);
            },
        });
    }
    deletePermission(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(permissionRouter.permissionRemove + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Service.Permission.Delete.Success'),
                errorMessage: this.translationService.translate('Administration.Service.Permission.Delete.Error'),
                onSuccess: () => { }
            }
        );
    }

    activeStatusPermission(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(permissionRouter.activeStatusRole + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Success'),
                errorMessage: this.translationService.translate('Administration.Service.Permission.ChangeStatus.Error'),
                onSuccess: () => { }
            }
        );
    }

    deActiveStatusPermission(id: string): Observable<BaseResponse<void>> {
        return this.responseHandler.handleApiCall(
            this.http.post<BaseResponse<void>>(permissionRouter.deActiveStatusRole + id, {}),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('Administration.Permission.ChangeStatus.Success'),
                errorMessage: this.translationService.translate('Administration.Permission.ChangeStatus.Error'),
                onSuccess: () => { }
            }
        );
    }

    // Tìm kiếm sản phẩm với timeout ngắn
    getAllModulePermission(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(permissionRouter.permissionAllModule), {
            showSuccessMessage: false,
            showErrorMessage: true
        });
    }


    // Tìm kiếm sản phẩm với timeout ngắn
    getDropdownRole(): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(permissionRouter.getDropdownRole), {
            showSuccessMessage: false,
            showErrorMessage: true
        });
    }
}
