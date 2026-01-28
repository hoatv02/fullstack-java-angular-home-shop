

import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SHARED_MODULES } from '../../../../../../shared/shared.module';
import { CustomerService } from '../../../../service/customer.service';
import { ACTION, buildBreadcrumb } from '../../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX } from '../../../../../../utils/enums/const';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../../../../layout/Admins/service/loading.service';
import { ConfigOtpService } from '../../../../service/config-otp.service';
import { catchError, finalize, of } from 'rxjs';
import moment from 'moment';
import { CustomVaidators } from '../../../../../../shared/validators/CustomVaidators';
import { cleanForm } from '../../../../../../utils/utils';
import { TranslationService } from '../../../../../../../assets/i18n/translation.service';
import { NotificationService } from '../../../../../../layout/Admins/service/notification.service';

@Component({
  imports: [SHARED_MODULES],
  providers: [ConfirmationService, MessageService, CustomerService],
  selector: 'app-email-gateway-detail',
  templateUrl: './email-gateway-detail.component.html',
  styleUrl: './email-gateway-detail.component.scss'
})
export class EmailGatewayDetailComponent {
  emailForm!: FormGroup;
  displayTitlePages: string = '';
  action?: ACTION;
  breadcrumbList: any[] = [];
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

  private cdf = inject(ChangeDetectorRef);
  get detailConfigs(): FormArray {
    return this.emailForm.get('detailConfigs') as FormArray;
  }
  ngOnInit(): void {
    this.formInit();
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;
    if (!id) {
      this.action = ACTION.CREATE;
    } else if (url.includes('/detail/')) {
      this.emailForm.get('name')?.disable()
      this.action = ACTION.DETAIL;
      this.getDataDetail(id);
      this.emailForm?.disable()
    } else {
      // this.emailForm.get('name')?.disable()
      this.action = ACTION.EDIT;
      this.getDataDetail(id);
    }
    this.buildBreadcrumb();
    this.setDisplayTitle();
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
      status: [true]
    });
  }

  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(this.action === ACTION.CREATE ? ACTION.CREATE : this.action === ACTION.EDIT ? ACTION.EDIT : ACTION.DETAIL, '', '/settings', 'Breadcrumbs.Configuration');
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

  getDataDetail(id: string) {
    this.loadingService.show();
    this.configOtpService
      .getConfigEmail(id)
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
            });
          }
        },
      });
  }

  createConfigEmail() {
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
    }
    this.loadingService.show();
    this.configOtpService
      .createConfigEmail({
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
          }
        },
      });
  }
  onSubmit() {
    if (this.emailForm.valid) {
      if (this.action === ACTION.CREATE) {
        this.createConfigEmail();
      } else {
        // this.updateConfigEmail();
        this.confirmUpdateConfig = true
      }
    } else {
      this.emailForm.markAllAsTouched();
    }
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
