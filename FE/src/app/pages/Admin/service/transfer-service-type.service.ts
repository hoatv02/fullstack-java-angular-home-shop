import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { environment } from '../../../../environments/environment';
import { ResponseHandlerService } from '../../../layout/Admins/service/responseHandler.service';
import { transferServiceTypeRouter } from '../../../utils/consts/router';
import { BaseResponse, PaginationResponse } from '../../../utils/res/app.response';
import { ITransferServiceType } from '../../../models/ITransferServiceType';
import { FileExportService } from './FileExport.service';

@Injectable({
    providedIn: 'root'
})
export class TransferServiceTypeService {
    private http = inject(HttpClient);
    private responseHandler = inject(ResponseHandlerService);
    private router = inject(Router);
    private translationService = inject(TranslationService);
    private fileExportService = inject(FileExportService);
    private apiUrl = environment.APP_API_URL;

    /** Lấy danh sách loại dịch vụ chuyển tiền */
    getListData(body: any): Observable<BaseResponse<PaginationResponse<ITransferServiceType[]>>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transferServiceTypeRouter.filter, body),
            {
                showSuccessMessage: false,
                errorMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.LIST.FAIL')
            }
        );
    }

    /** Lấy chi tiết loại dịch vụ chuyển tiền */
    getDetail(id: string): Observable<BaseResponse<ITransferServiceType>> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(transferServiceTypeRouter.detail + id),
            {
                showSuccessMessage: false,
                errorMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.DETAIL.FAIL')
            }
        );
    }

    /** Cập nhật loại dịch vụ chuyển tiền */
    update(request: {
        id?: string;
        body: ITransferServiceType;
    }): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.put<any>(transferServiceTypeRouter.update + request.id, request.body),
            {
                successMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.UPDATE.SUCCESS'),
                errorMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.UPDATE.FAIL')
            }
        );
    }

    /** Thêm mới loại dịch vụ chuyển tiền */
    create(body: ITransferServiceType): Observable<BaseResponse<any>> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(transferServiceTypeRouter.create, body),
            {
                successMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.CREATE.SUCCESS'),
                errorMessage: this.translationService.translate('TRANSFER_SERVICE_TYPE.CREATE.FAIL')
            }
        );
    }

    /** Xuất Excel */
    exportExcel(payload: any, fileName: string, typeFile: string) {
        this.fileExportService.exportFile(transferServiceTypeRouter.export, payload, fileName, typeFile);
    }
}
