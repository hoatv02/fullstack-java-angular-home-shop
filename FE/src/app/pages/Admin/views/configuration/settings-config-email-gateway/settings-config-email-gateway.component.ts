import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { AuthService } from '../../../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { NotificationService } from '../../../../../layout/Admins/service/notification.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX } from '../../../../../utils/enums/const';
import { cleanForm } from '../../../../../utils/utils';
import { ConfigOtpService } from '../../../service/config-otp.service';
import { PermissionCommonService } from '../../../service/PermissionCommon.service';

@Component({
  selector: 'app-settings-config-email-gateway',
  imports: [SHARED_MODULES],
  templateUrl: './settings-config-email-gateway.component.html',
})
export class SettingsConfigEmailGatewayComponent {
  emailForm!: FormGroup;
  displayTitlePages: string = '';
  action?: ACTION;
  breadcrumbList: any[] = [];
  otpConfirmVisiable: boolean = false;
  otpValue: string = ''
  customerData: any
  GetwayList: any[] = [
    {
      code: 1,
      name: 'SMTP'
    }
  ]
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private configOtpService = inject(ConfigOtpService);
  private translate = inject(TranslationService);
  private noticeService = inject(NotificationService)
  confirmUpdateConfig: boolean = false
  formInput: FormInputModel = new FormInputModel();
  private authService = inject(AuthService)
  public permissionCommon = inject(PermissionCommonService)
  permissions: Record<string, boolean> = {};
  permissionsSub?: Subscription;
  private destroy$ = new Subject<void>();
  private cdf = inject(ChangeDetectorRef);
  get detailConfigs(): FormArray {
    return this.emailForm.get('detailConfigs') as FormArray;
  }
  ngOnInit(): void {
    this.formInit();
    this.buildBreadcrumb();
    this.setDisplayTitle();
    this.getDataDetail()
    this.loadFunctionPermission();

  }

  loadFunctionPermission() {
    this.permissionCommon
      .subscribePermissions('EMAIL_GATEWAY', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.permissions = result;
        if (this.permissions['UPDATED']) {
          this.emailForm.enable();
        } else {
          this.emailForm.disable();
        }
      });
  }

  ngOnDestroy() {
    this.permissionsSub?.unsubscribe();
  }




  formInit() {
    this.emailForm = this.fb.group({
      requestId: [''],
      name: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      type: [null, [Validators.required]],
      host: [null, [Validators.required]],
      port: [null, [Validators.required]],
      from: [null, [Validators.required]],
      user: [null, [Validators.required]],
      password: [null, [Validators.required]],
      // , Validators.minLength(12), CustomVaidators.passwordComplexityValidator()
      hasSsl: [true],
      effectiveTo: [null],
      effectiveFrom: [null, [Validators.required]],
      status: [true],
      isDefault: [true],

    });
  }

  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, '', '/settings', 'Breadcrumbs.ConfigEmailGateWay');
  }

  onMaxCheckTimesChange(event: any) {
    const value = +event.value;
    this.detailConfigs.clear();

    if (value && value > 0) {
      for (let i = 0; i < value; i++) {
        this.detailConfigs.push(
          this.fb.group({
            order: [i + 1],
            wrongAttempts: [null, Validators.required],
            waitTimeBetweenAttempts: [null, [Validators.required, Validators.min(1)]],
            lockDuration: [null, [Validators.required, Validators.min(1)]],
          })
        );
      }
    }
  }

  getDataDetail() {
    this.loadingService.show();
    this.configOtpService
      .getConfigEmailDefault()
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
            const d = data.data;
            this.emailForm.patchValue({
              ...d,
              status: d.status === 1 ? true : false,
              hasSsl: d.hasSsl === 1 ? true : false,
              effectiveFrom: d.effectiveFrom ? new Date(d.effectiveFrom) : null,
              effectiveTo: d.effectiveTo ? new Date(d.effectiveTo) : null,
              maxCheckTimes: d.workflow?.length || null,
              type: +d?.type
            });
          }
        },
      });
  }

  updateConfigEmail() {
    const { detailConfigs, maxCheckTimes, ...body } = this.emailForm.getRawValue();
    cleanForm(this.emailForm)
    const fromDate = this.emailForm.value.effectiveFrom ? moment(this.emailForm.value.effectiveFrom)
      .startOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null
    const toDate = this.emailForm.value.effectiveTo ? moment(this.emailForm.value.effectiveTo)
      .endOf('day')
      .format("YYYY-MM-DDTHH:mm:ss") : null
    const bodyRequest = {
      ...body,
      status: body.status ? 1 : 0,
      hasSsl: body.status ? 1 : 0,
      effectiveFrom: fromDate,
      effectiveTo: toDate,
      userId: this.customerData.userId,
      otp: this.otpValue,
      sessionId: this.customerData?.sessionId
    }
    this.loadingService.show();
    this.configOtpService
      .updateConfigEmail({
        ...bodyRequest
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
            this.router.navigate(['/configuration-email-gateway']);
            this.otpConfirmVisiable = false
          }
        },
      });
  }
  onSubmit() {
    if (this.emailForm.valid) {
      this.otpValue = ''
      this.sendOtMail()
    } else {
      this.emailForm.markAllAsTouched();
    }
  }
  sendOtMail() {
    const tokenDecode = this.authService.deCodeAccessToken()
    const userId = tokenDecode?.['x-user-id'];
    this.loadingService.show();
    this.configOtpService
      .getOtpMail(userId)
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
            this.customerData = {
              ...this.customerData, ...data?.data,
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
        this.displayTitlePages = this.translate.translate('EmailGateway.Title.Create');
        break;
      case ACTION.EDIT:
        this.displayTitlePages = this.translate.translate('EmailGateway.Title.Edit');
        break;
      case ACTION.DETAIL:
      default:
        this.displayTitlePages = this.translate.translate('EmailGateway.Title.Detail');
        break;
    }
  }
}
