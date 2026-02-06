import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { catchError, finalize, of } from 'rxjs';
import { NotificationService } from '../../../../layout/Admins/service/notification.service';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { TableComponent } from '../../components/table/table.component';
import { CustomerService } from '../../service/customer.service';
import { LoadingService } from '../../../../layout/Admins/service/loading.service';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [SHARED_MODULES, TableComponent],
    templateUrl: './tabledemo.component.html',
    styleUrls: ['./tabledemo.component.scss'],
    providers: [ConfirmationService, MessageService, CustomerService]
})
export class TableDemo implements OnInit {
    customers1: any[] = [];
    customers2: any[] = [];
    customers3: any[] = [];
    selectedCustomers1: any[] = [];
    selectedCustomer: any = {};
    representatives: any[] = [];
    statuses: any[] = [];
    rowGroupMetadata: any;
    expandedRows: expandedRows = {};
    activityValues: number[] = [0, 100];
    isExpanded: boolean = false;
    balanceFrozen: boolean = false;
    first: number = 0;
    dataList: any[] = []
    breadcrumbList = [
        { label: 'Trang chủ', routerLink: '/' },
        { label: 'Tin tức', routerLink: '/table' },
    ];
    tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
        status: {
            'Đang hoạt động': 'success',
            'Tạm khóa': 'warning',
            'Đã xóa': 'danger',
            'Thông tin': 'info'
        }
    };

    columns = [
        { field: 'avatar', header: 'Avatar', styleClass: 'min-w-[60px]' },
        { field: 'name', header: 'Họ tên' },
        { field: 'email', header: 'Email' },
        { field: 'phone', header: 'SĐT' },
        { field: 'age', header: 'Tuổi' },
        { field: 'role', header: 'Vai trò' },
        { field: 'status', header: 'Trạng thái', type: 'tag' },
        { field: 'lastLogin', header: 'Lần đăng nhập' }
    ];

    @ViewChild('filter') filter!: ElementRef;
    @ViewChild(TableComponent) tableComponent!: TableComponent;

    constructor(
        private customerService: CustomerService,
        private loadingService: LoadingService,
        private router: Router,
        private notification: NotificationService
    ) {

    }

    ngOnInit() {
    }
    handleLazyLoad(event: any) {
    }


    editCustomer(customer?: any | null) {
        this.loadingService.show()
        if (customer) {
            this.router.navigate([`/table/${customer.id}`]);
            this.selectedCustomer = { ...customer };
            this.loadingService.hide()
        } else {
            this.loadingService.hide()
            this.selectedCustomer = {};
            this.notification.success('Toast.SaveSuccessSummary', 'Toast.SaveSuccessDetail');
            this.notification.info('Toast.SaveSuccessSummary', 'Toast.SaveSuccessDetail');
            this.notification.warn('Toast.SaveSuccessSummary', 'Toast.SaveSuccessDetail');
            this.notification.error('Toast.SaveSuccessSummary', 'Toast.SaveSuccessDetail');
        }
    }
    handleSearchKeyword(keyword: any) {
        this.loadingService.show();
        setTimeout(() => {
            this.loadingService.hide();
        }, 500);
    }
    deleteCustomer(customer: any) {
        this.customers1 = this.customers1.filter((c) => c.id !== customer.id);
        this.selectedCustomer = {};
    }

    deleteSelectedCustomers() {
        this.customers1 = this.customers1.filter((c) => !this.selectedCustomers1.includes(c));
        this.selectedCustomers1 = [];
    }



    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                } else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    } else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }

    expandAll() {
        this.isExpanded = !this.isExpanded;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getSeverity(status: string) {
        switch (status) {
            case 'qualified':
            case 'instock':
            case 'INSTOCK':
            case 'DELIVERED':
            case 'delivered':
                return 'success';

            case 'negotiation':
            case 'lowstock':
            case 'LOWSTOCK':
            case 'PENDING':
            case 'pending':
                return 'warn';

            case 'unqualified':
            case 'outofstock':
            case 'OUTOFSTOCK':
            case 'CANCELLED':
            case 'cancelled':
                return 'danger';

            default:
                return 'info';
        }
    }

    calculateCustomerTotal(name: string) {
        let total = 0;

        if (this.customers2) {
            for (let customer of this.customers2) {
                if (customer.representative?.name === name) {
                    total++;
                }
            }
        }

        return total;
    }
}
