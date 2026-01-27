import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of } from 'rxjs';
import { LoadingService } from '../../../../layout/service/loading.service';
import { FormInputModel } from '../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from './../../../service/customer.service';
import { TranslationService } from '../../../../../assets/i18n/translation.service';

@Component({
    selector: 'app-statistical-customer',
    imports: [SHARED_MODULES, TableComponent],
    providers: [ConfirmationService, MessageService, CustomerService],
    templateUrl: './statistical-customer.component.html',
})
export class StatisticalCustomerComponent {
    displayConfirmation: boolean = false;
    first: number = 0;
    totalRecords: number = 0;

    formInput: FormInputModel = new FormInputModel();
    breadcrumbList = [{ label: 'STATISTICS.customer.STATISTIC', routerLink: '/statistical-transaction' }];
    tagConfig: Record<string, Record<string, string>> = {
        status: {
            'STATISTICS.customer.ACTIVE': 'success',
            'STATISTICS.customer.INACTIVE': 'danger'
        }
    };
    columns = [
        { field: 'stt', header: 'STT', type: 'stt' },

        { field: 'createdAt', header: 'STATISTICS.customer.TIME', type: 'formatDate', formatDate: 'dd/MM/yyyy' },
        { field: 'total', header: 'STATISTICS.customer.TOTAL' },
        { field: 'active', header: 'STATISTICS.customer.ACTIVE' },
        { field: 'inActive', header: 'STATISTICS.customer.INACTIVE' }
    ];
    dataList = [];
    statusList: any[] = [
        {
            code: 1,
            name: 'STATISTICS.customer.ACTIVE'
        },
        {
            code: 0,
            name: 'STATISTICS.customer.INACTIVE'
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
        private translate: TranslationService
    ) { }
    customerTypeList: any[] = [
        {
            code: 1,
            name: 'TransactionType.Individual'
        },
        {
            code: 2,
            name: 'TransactionType.Business'
        }
    ];
    handleLazyLoad(event: any) {
        this.first = event.first * event.rows;
        this.formInput.page = event.first;
        this.formInput.size = event.rows;
        if (!this.route.firstChild) {
            this.getData();
        }
    }



    currentFirstPage() {
        this.formInput.page = 0;
        this.first = 0;
    }
    statusChange(event: any) {
        this.currentFirstPage()
        if (event) {
            this.formInput.userType = event?.code;
        } else {
            const { userType, ...formInput } = this.formInput;
            this.formInput = { ...formInput };
        }
        this.getData();
    }
    formToDateChange(event: any) {
        this.currentFirstPage()

        if (event?.length === 2) {
            const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
            const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
            this.formInput.fromDate = fromDate;
            this.formInput.toDate = toDate;
            this.getData();
        } else if (event?.length === 0) {
            this.formInput.fromDate = null;
            this.formInput.toDate = null;
            this.getData();
        }
    }
    getData() {
        this.loadingService.show();
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.customerService
            .getListReportCustomer({
                ...formInput
            })
            .pipe(
                catchError((error) => {
                    return of([]);
                }),
                finalize(() => {
                    this.loadingService.hide();
                })
            )
            .subscribe({
                next: (data: any) => {
                    if (data?.data) {
                        this.dataList = data?.data?.data?.map((item: any, index: number) => ({
                            ...item,
                            status: item.status === 1 ? this.translate.translate('STATISTICS.customer.success') : this.translate.translate('STATISTICS.customer.fail'),
                            userTypeName: item.userType === 1 ? this.translate.translate('STATISTICS.customer.enterprise') : this.translate.translate('STATISTICS.customer.personal'),
                            stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
                        }));
                        this.totalRecords = data?.data?.totalCount || 0;
                    }
                }
            });
    }
    handleSearchKeyword(keyword: any) {
        this.currentFirstPage()

        this.formInput.userId = keyword.trim() || '';
        this.getData();
    }

    exportExcel() {
        const { pageNumber, pageSize, textSearch, ...formInput } = this.formInput;
        this.customerService.exportStatisticalCustomerExcel({ ...formInput }, 'thong_ke_khach_hang', 'xlsx');
    }
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
