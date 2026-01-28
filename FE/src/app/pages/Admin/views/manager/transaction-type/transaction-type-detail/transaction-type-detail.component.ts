import { Component, inject } from '@angular/core';
import { SHARED_MODULES } from '../../../../../../shared/shared.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CustomerService } from '../../../../service/customer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACTION, buildBreadcrumb } from '../../../../../../utils/enums/action.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../../../layout/Admins/service/loading.service';
import { OperatorService } from '../../../../service/operator.service';
import { NOSPECIALCHARREGEX, NOSPECIALCHARREGEX_CODE, PHONE_REGEX, POSITIVE_INTEGER_REGEX } from '../../../../../../utils/enums/const';
import { catchError, finalize, of } from 'rxjs';
import { TransactionTypeService } from '../../../../service/transaction-type.service';
import { cleanForm } from '../../../../../../utils/utils';
import { TranslationService } from '../../../../../../../assets/i18n/translation.service';
import moment from 'moment';
import { NotificationService } from '../../../../../../layout/Admins/service/notification.service';
import { AuthService } from '../../../../../../layout/Admins/service/auth.service';

@Component({
  selector: 'app-transaction-type-detail',
  imports: [SHARED_MODULES],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './transaction-type-detail.component.html',
  styleUrl: './transaction-type-detail.component.scss'
})
export class TransactionTypeDetailComponent {
  transactionTypeForm!: FormGroup;
  displayTitlePages: string = '';
  otpValue: string = '';
  action?: ACTION;
  breadcrumbList: any[] = [];
  otpConfigList: any[] = []
  confirmUpdateConfig: boolean = false
  otpConfirmVisiable: boolean = false
  DataConfigOtpTransaction: any
  roles = [
  ];
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private transactionTypeService = inject(TransactionTypeService);
  private translate = inject(TranslationService);
  private noticeService = inject(NotificationService);
  private authService = inject(AuthService)

  customerTypeList: any[] = [
    {
      code: 1,
      name: 'TransactionType.Individual'
    },
    {
      code: 2,
      name: 'TransactionType.Business'

    },
  ]
  ngOnInit(): void {
    this.formInit();
    this.getDropdownOtpConfigActiveList()
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (!id) {
      this.action = ACTION.CREATE;
      this.transactionTypeForm.reset();
      this.formInit();

    } else if (url.includes('/detail/')) {
      this.action = ACTION.DETAIL;
      this.getDataDetail(id);
      this.transactionTypeForm.disable();
    } else {
      this.action = ACTION.EDIT;
      this.getDataDetail(id);
      this.transactionTypeForm.get('transactionCode')?.disable();
    }
    this.buildBreadcrumb();
    this.setDisplayTitle();
  }
  formInit() {
    this.transactionTypeForm = this.fb.group({
      transactionCode: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX_CODE)]],
      transactionName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      customerType: [null, [Validators.required]],
      status: [true],
      otpConfigId: [null, [Validators.required]],
      effectiveFrom: [null, [Validators.required]],
      effectiveTo: [null],
      requestId: [''],
      validTimeTransaction: ['', [Validators.required, Validators.pattern(POSITIVE_INTEGER_REGEX)]],
    });
  }
  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, 'TransactionType', '/transaction-type', 'Breadcrumbs');
  }
  getDataDetail(id: string) {
    this.loadingService.show();
    this.transactionTypeService
      .getDetailTransactionType(id)
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
            this.transactionTypeForm.patchValue({
              ...data.data,
              status: data.data.status === 1 ? true : false,
              effectiveFrom: data?.data?.effectiveFrom ? new Date(data?.data?.effectiveFrom) : null,
              effectiveTo: data?.data?.effectiveTo ? new Date(data?.data?.effectiveTo) : null,
              customerType: +data?.data?.customerType
            });
          }
        },
      });
  }

  getDropdownOtpConfigActiveList() {
    this.loadingService.show();
    this.transactionTypeService
      .getListDrodownOtpConfigActiveList()
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
          this.otpConfigList = data?.data
        },
      });
  }
  creatTransactionType() {
    this.loadingService.show();
    cleanForm(this.transactionTypeForm)

    const fromDate = this.transactionTypeForm.value.effectiveFrom ? moment(this.transactionTypeForm.value.effectiveFrom).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;
    const toDate = this.transactionTypeForm.value.effectiveTo ? moment(this.transactionTypeForm.value.effectiveTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;

    this.transactionTypeService
      .createTransactionType({
        ...this.transactionTypeForm.value,
        status: this.transactionTypeForm.value.status ? 1 : 0,
        effectiveFrom: fromDate,
        effectiveTo: toDate,
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
          if (data?.code === 200) {
            this.router.navigate(['/transaction-type'])
          }
        },
      });
  }

  updateTransactionType() {
    const fromDate = this.transactionTypeForm.value.effectiveFrom ? moment(this.transactionTypeForm.value.effectiveFrom).startOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;
    const toDate = this.transactionTypeForm.value.effectiveTo ? moment(this.transactionTypeForm.value.effectiveTo).endOf('day').format('YYYY-MM-DDTHH:mm:ss') : null;

    this.loadingService.show();
    cleanForm(this.transactionTypeForm)
    this.transactionTypeService
      .updateTransactionType({
        ...this.transactionTypeForm.getRawValue(),
        status: this.transactionTypeForm.value.status ? 1 : 0,
        effectiveFrom: fromDate,
        effectiveTo: toDate,
        userId: this.DataConfigOtpTransaction.userId,
        otp: this.otpValue,
        sessionId: this.DataConfigOtpTransaction?.sessionId
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
          if (data?.code === 200) {
            this.otpConfirmVisiable = false
            this.router.navigate(['/transaction-type'])
          }
        },
      });
  }
  onSubmit() {
    if (this.transactionTypeForm.valid) {
      cleanForm(this.transactionTypeForm);
      if (this.action === ACTION.CREATE) {
        this.creatTransactionType();
      } else {
        this.otpValue = ''
        this.sendOtp()
      }
    } else {
      this.transactionTypeForm.markAllAsTouched();
    }
  }
  sendOtp() {
    const tokenDecode = this.authService.deCodeAccessToken()
    const userId = tokenDecode?.['x-user-id'];
    this.loadingService.show();
    this.transactionTypeService
      .getOtpTransaction(userId)
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
          if (data?.code === 200) {
            this.DataConfigOtpTransaction = {
              ...this.DataConfigOtpTransaction, ...data?.data,
              userId: userId
            };
            this.otpConfirmVisiable = true
          }
        },
      });
  }

  setDisplayTitle() {
    switch (this.action) {
      case ACTION.CREATE:
        this.displayTitlePages = this.translate.translate('TransactionType.Add');
        break;
      case ACTION.EDIT:
        this.displayTitlePages = this.translate.translate('TransactionType.Edit');
        break;
      case ACTION.DETAIL:
      default:
        this.displayTitlePages = this.translate.translate('TransactionType.Detail');
        break;
    }
  }
}
