import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { ITransactionLog } from '../../../models/ITransactionLog';
import { transactionLogRouter, transactionTypeRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class TransactionService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy danh sách lịch sử giao dịch */
    getListData(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionLogRouter.transactionLogFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.TRANSACTION.LIST.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION.LIST.FAIL')
            }
        );
    }
    getDetailPayment(id: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(this.http.get<any>(transactionLogRouter.paymentInfo + id), {
            showSuccessMessage: true,
            showErrorMessage: true,
            successMessage: this.translationService.translate('Tải thông tin chi tiết giao dịch thành công'),
            errorMessage: this.translationService.translate('Tải thông tin chi tiết giao dịch thất bại')
        });
    }
    getStepTransaction(id: any): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(this.http.get<any>(transactionLogRouter.stepTransaction + id), {
            showSuccessMessage: false,
            showErrorMessage: false,
        });
    }

    getDropdownTransactionType(): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(this.http.get<any>(transactionLogRouter.dropdownTransaction), {
            showSuccessMessage: false,
            showErrorMessage: false,
        });
    }
    /** Lấy thống kê giao dịch */
    getListStatisticalData(body: any): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionLogRouter.transactionReportFilter, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('SERVICE.TRANSACTION.STATISTICS.SUCCESS'),
                errorMessage: this.translationService.translate('SERVICE.TRANSACTION.STATISTICS.FAIL')
            }
        );
    }

    /** Xuất file Excel lịch sử giao dịch */
    exportTransactionExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionLogRouter.export, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: false,
            }
        );
    }

    exportStatisticalTransactionExcel(payload: any) {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transactionLogRouter.exportStatisticalTransaction, payload),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
            }
        );
    }



    getDropdownTransaction(): Observable<BaseResponse<PaginationResponse<ITransactionLog[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(transactionTypeRouter.getDropdownTransaction),
            {
                showSuccessMessage: false,
                showErrorMessage: true
            }
        );
    }
}
