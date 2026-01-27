import { Component, DestroyRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../layout/service/loading.service';
import { FormInputModel } from '../../../models/IFormInput';
import { Operator } from '../../../models/IOperator';
import { SHARED_MODULES } from '../../../shared/shared.module';
import { TableComponent } from '../../components/table/table.component';
import { CustomerService } from '../../service/customer.service';
import { SystemLogService } from '../../service/system-log.service';
import { PermissionCommonService } from '../../service/PermissionCommon.service';
import { NotificationService } from '../../../layout/service/notification.service';

@Component({
  selector: 'app-system-log',
  imports: [SHARED_MODULES, TableComponent],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './system-log.component.html',
})

export class SystemLogComponent {
  displayConfirmationStatus: boolean = false;
  confirmationDeleteOperator: boolean = false;
  first: number = 0;
  dataList: any[] = [];
  totalRecords: number = 0;
  get tableTitle(): string {
    return this.translate.translate('SystemLogRAS.Title') + ' ' + (this.selectedService?.name || '');
  }
  formInput: FormInputModel = { ...new FormInputModel() };
  selectedService: any = {};
  tempSwitchChange: { row: any; field: string; prevValue: boolean } | null = null;
  Operator: Operator = {} as Operator;
  breadcrumbList = [{ label: 'SystemLogRAS.TITLE', routerLink: '/activity-log' }];
  tagConfig: Record<string, Record<string, 'success' | 'info' | 'warning' | 'danger'>> = {
    httpStatus: {
      '200': 'success',
      '500': 'danger',
      '400': 'danger',
      '403': 'danger',
      '404': 'danger',
      '502': 'danger',
      '503': 'danger'
    }
  };
  serviceList = [
    {
      name: 'Ras Service',
      code: 'RasService'
    },
    {
      name: 'Token Service',
      code: 'TokenService'
    },
    {
      name: 'Sam Service',
      code: 'SamService'
    }
  ];

  httpCode: any[] = [
    // ✅ Success
    { code: '200', name: '200 - OK' },
    { code: '201', name: '201 - Created' },
    { code: '202', name: '202 - Accepted' },
    { code: '204', name: '204 - No Content' },

    // ✅ Redirect
    { code: '301', name: '301 - Moved Permanently' },
    { code: '302', name: '302 - Found' },
    { code: '304', name: '304 - Not Modified' },

    // ✅ Client error
    { code: '400', name: '400 - Bad Request' },
    { code: '401', name: '401 - Unauthorized' },
    { code: '403', name: '403 - Forbidden' },
    { code: '404', name: '404 - Not Found' },
    { code: '405', name: '405 - Method Not Allowed' },
    { code: '408', name: '408 - Request Timeout' },
    { code: '409', name: '409 - Conflict' },
    { code: '429', name: '429 - Too Many Requests' },

    // ✅ Server error
    { code: '500', name: '500 - Internal Server Error' },
    { code: '501', name: '501 - Not Implemented' },
    { code: '502', name: '502 - Bad Gateway' },
    { code: '503', name: '503 - Service Unavailable' },
    { code: '504', name: '504 - Gateway Timeout' }
  ];
  columns = [
    { field: 'stt', header: 'STT', type: 'stt' },
    { field: 'hostName', header: 'SystemLogRAS.HostName' },
    { field: 'serviceName', header: 'SystemLogRAS.ServiceName' },
    { field: 'traceId', header: 'SystemLogRAS.TraceId' },
    { field: 'sessionId', header: 'SystemLogRAS.SessionId' },
    { field: 'userId', header: 'SystemLogRAS.UserId' },
    { field: 'httpMethod', header: 'SystemLogRAS.HttpMethod' },
    { field: 'requestUri', header: 'SystemLogRAS.RequestUri' },
    { field: 'responseTimeMs', header: 'SystemLogRAS.ResponseTimeMs', styleClass: "text-center" },
    { field: 'logTime', header: 'SystemLogRAS.LogTime', type: 'date' },
    { field: 'httpStatus', header: 'SystemLogRAS.HttpStatus', type: 'tag' }
  ];
  actionList = [
    {
      name: 'POST',
      code: 'POST'
    },
    {
      name: 'GET',
      code: 'GET'
    },
    {
      name: 'PUT',
      code: 'PUT'
    },
    {
      name: 'DELETE',
      code: 'DELETE'
    }
  ];
  permissionsSub?: Subscription;
  permissions: Record<string, boolean> = {};
  private destroy$ = new Subject<void>();
  constructor(
    private customerService: CustomerService,
    private loadingService: LoadingService,
    private systemLogService: SystemLogService,
    public router: Router,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute,
    private translate: TranslationService,
    public permissionCommon: PermissionCommonService,
    private notification: NotificationService

  ) { }

  ngOnInit(): void {
    this.loadFunctionPermission();
  }
  loadFunctionPermission() {
    this.permissionCommon
      .subscribePermissions('INTERNAL_LOG', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.permissions = result;
      });
  }
  ngOnDestroy() {
    this.permissionsSub?.unsubscribe();
  }


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
  getData() {
    this.loadingService.show();
    const { pageNumber, pageSize, ...formInput } = this.formInput;
    this.systemLogService
      .getListDataService({
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
              status: item.status === 1 ? this.translate.translate('SystemLogRAS.SUCCESS') : this.translate.translate('SystemLogRAS.FAILED'),
              httpStatus: item.httpStatus?.toString() || '',
              stt: (data?.data?.pageNumber - 1) * data?.data?.pageSize + index + 1
            }));
            this.totalRecords = data?.data?.totalCount || 0;
          }
        }
      });
  }

  handleServiceNameChange(event: any) {
    this.currentFirstPage()
    if (event) {
      this.selectedService = event;
      this.formInput = {
        ...this.formInput,
        serviceName: event?.code
      };
    } else {
      this.selectedService = null;
      const { serviceName, ...formInput } = this.formInput;
      this.formInput = { ...formInput };
    }
    this.getData();
  }



  handleFilterHttpCodeChange(event: any) {
    this.currentFirstPage()
    if (event) {
      this.formInput = {
        ...this.formInput,
        httpStatus: event.code
      };
    } else {
      const { httpStatus, ...formInput } = this.formInput;
      this.formInput = { ...formInput };
    }
    this.getData();
  }

  handleFilterMethodChange(event: any) {
    this.currentFirstPage()
    if (event) {
      this.formInput = {
        ...this.formInput,
        httpMethod: event.code
      };
    } else {
      const { httpMethod, ...formInput } = this.formInput;
      this.formInput = { ...formInput };
    }
    this.getData();
  }
  formToDateChange(event: any) {
    this.currentFirstPage()
    if (event?.length === 2) {
      const fromDate = moment(event[0]).startOf('day').format('YYYY-MM-DDTHH:mm:ss');
      const toDate = moment(event[1]).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
      this.formInput.startDate = fromDate;
      this.formInput.endDate = toDate;
      this.formInput.page = 0;
      this.formInput.size = 10;
      this.getData();
    } else if (event?.length === 0) {
      this.formInput.startDate = null;
      this.formInput.endDate = null;
      this.getData();
    }
  }

  handleSearchKeyword(keyword: any) {
    this.currentFirstPage()
    this.formInput.textSearch = keyword.trim() || '';
    this.getData();
  }

  exportExcel() {
    const { pageNumber, pageSize, ...formInput } = this.formInput;
    this.systemLogService.exportSystemLogServiceExcel({ ...formInput }).pipe(
      catchError((error) => {
        return of([]);
      }),
      finalize(() => {
        this.loadingService.hide();
      })
    )
      .subscribe({
        next: (data: any) => {
          if (data?.data?.status === "PENDING") {
            this.notification.showPendingExport();
          }
        }
      });
  }


  // =================== Xử lý chuyển đổi trạng thái ===================
  handleSwitchChange({ row, field, value }: { row: any; field: string; value: boolean }) {
    this.tempSwitchChange = {
      row,
      field,
      prevValue: value
    };
    row[field] = value;
    this.displayConfirmationStatus = true;
  }

  onConfirmSwitchChange() {
    if (this.tempSwitchChange) {
      const { row, field, prevValue } = this.tempSwitchChange;
      row[field] = prevValue;
    }
    this.displayConfirmationStatus = false;
    this.tempSwitchChange = null;
  }
  onCancelSwitchChange() {
    if (this.tempSwitchChange) {
      const { row, field, prevValue } = this.tempSwitchChange;
      row[field] = !prevValue;
      this.dataList = [...this.dataList];
    }
    this.displayConfirmationStatus = false;
    this.tempSwitchChange = null;
  }
}
