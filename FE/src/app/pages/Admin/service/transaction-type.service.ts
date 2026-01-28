import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { ITransactionLog } from '../../../models/ITransactionLog';
import { transactionTypeRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionTypeService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy danh sách loại giao dịch */
    getListData(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionTypeRouter.transactionTypeFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.LIST.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.LIST.FAIL')
            }
        );
    }

    /** Lấy danh sách OTP config active cho dropdown */
    getListDrodownOtpConfigActiveList(): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(transactionTypeRouter.dropdownOtpConfigActiveList),
            {
                showSuccessMessage: false,
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.DROPDOWN_OTP.FAIL')
            }
        );
    }

    /** Thêm mới loại giao dịch */
    createTransactionType(operator: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionTypeRouter.createTransactionType, operator),
            {
                successMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.CREATE.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.CREATE.FAIL')
            }
        );
    }
    getOtpTransaction(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(this.http.get<any>(transactionTypeRouter.getOtpTransaction + body), {
            showSuccessMessage: true,
            successMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_SUCCESS'),
            errorMessage: this.translationService.translate('SERVICE.CUSTOMER.SEND_OTP_FAIL')
        });
    }
    /** Cập nhật loại giao dịch */
    updateTransactionType(operator: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.put<any>(transactionTypeRouter.updateTransactionType, operator),
            {
                successMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.UPDATE.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.UPDATE.FAIL')
            }
        );
    }

    /** Lấy chi tiết loại giao dịch */
    getDetailTransactionType(id: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(transactionTypeRouter.getDetailTransactionType + id),
            {
                successMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.DETAIL.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.DETAIL.FAIL')
            }
        );
    }

    /** Xóa loại giao dịch */
    deleteTransactionType(id: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.delete<any>(transactionTypeRouter.getDetailTransactionType + id),
            {
                successMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.DELETE.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION_TYPE.DELETE.FAIL')
            }
        );
    }
}
