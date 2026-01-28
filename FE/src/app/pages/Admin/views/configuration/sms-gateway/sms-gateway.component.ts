import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION } from '../../../../../utils/enums/action.enum';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { TransactionService } from '../../../service/transactions.service';

@Component({
    selector: 'app-sms-gateway',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './sms-gateway.component.html',
})
export class SmsGatewayComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;

    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'Danh sách cấu hình SMS gateway', routerLink: '/customer' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'Thành công': 'success',
            'Thất bại': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },

        { field: 'paymentId', header: 'Tên cấu hình' },
        { field: 'userId', header: 'Nơi lưu trữ' },
        { field: 'createdAt', header: 'Thời gian hiệu lực', type: 'date' },
        { field: 'status', header: 'Trạng thái', type: 'tag' },
        { field: 'createdAt', header: 'Ngày tạo', type: 'date' }
    ];
    dataList = [];
    statusList: any[] = [
        {
            code: 1,
            name: 'Thành công'
        },
        {
            code: 0,
            name: 'Thất bại'
        }
    ];
    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;
    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        public router: Router,
        private destroyRef: DestroyRef,
        private route: ActivatedRoute,
        private transactionService: TransactionService
    ) { }

    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first;
        this.formInput.size = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }
    statusChange(event: any) {
        this.formInput.page = 1;
        this.first = 0;
        if (event) {
            this.formInput.status = event?.code;
        } else {
            const { status, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    formToDateChange(event: any) {
        if (event) {
            const fromDate = moment(event).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.fromDate = fromDate;
            if (this.formInput.toDate && this.formInput.fromDate) {
                this.getData();
            }
        } else {
            const { fromDate, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
            if (!this.formInput.toDate) {
                this.getData();
            }
        }
    }
    editTransactionType(event?: any) {
        const action = event?.action;
        const requestId = event?.row?.requestId || event?.requestId;
        if (action === ACTION.EDIT) {
            this.router.navigate([`/configuration-sms-gateway/detail/detail/${requestId}`], { relativeTo: this.route });
        } else if (action === ACTION.DETAIL) {
            this.router.navigate([`/configuration-sms-gateway/detail/detail/${requestId}`], { relativeTo: this.route });
        } else {
            this.router.navigate(['/configuration-sms-gateway/create'], { relativeTo: this.route });
        }
    }
    getData() {
        // this.loadingService.show();
        // const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput
        // this.transactionService
        //   .getListData({
        //     ...formInput
        //   })
        //   .pipe(
        //     catchError((error) => {
        //       return of([]);
        //     }),
        //     finalize(() => {
        //       this.loadingService.hide();
        //     })
        //   )
        //   .subscribe({
        //     next: (data: any,index:number) => {
        //       if (data?.data) {
        //         this.dataList = data?.data?.data?.map((item: any) => ({
        //           ...item,
        //           status: item.status === 1 ? 'Thành công' : 'Thất bại',
        // stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1,
        //         }));
        //         this.totalRecords = data?.data?.totalCount || 0;
        //       }
        //     },
        //     error: (err) => {
        //     },
        //     complete: () => {
        //     }
        //   });
    }
    handleSearchKeyword(keyword: any) {
        this.formInput.userId = keyword.trim() || '';
        this.getData();
    }

    exportExcel() { }
    // =================== Xử lý chuyển đổi trạng thái ===================
    handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
        this.displayConfirmation = true;
    }

    onConfirmSwitchChange() {
        this.displayConfirmation = false;
    }
    onView(event: any) {
        const requestId = event?.data?.id;
        this.router.navigate([`/customer-detail/${requestId}`], {
            relativeTo: this.route,
            queryParams: { username: event?.data?.username }
        });
    }
}
