import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../../../assets/i18n/translation.service';
import { LoadingService } from '../../../../../layout/service/loading.service';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { ACTION, buildBreadcrumb } from '../../../../../utils/enums/action.enum';
import { NOSPECIALCHARREGEX_CODE } from '../../../../../utils/enums/const';
import { cleanForm } from '../../../../../utils/utils';
import { TransferServiceTypeService } from '../../../../service/transfer-service-type.service';

@Component({
  selector: 'app-transfer-service-type-detail',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './transfer-service-type-detail.component.html',
})
export class TransferServiceTypeDetailComponent implements OnInit {
  detailForm!: FormGroup;
  displayTitlePages: string = '';
  action?: ACTION;
  breadcrumbList: any[] = [];
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loadingService = inject(LoadingService);
  private transferServiceTypeService = inject(TransferServiceTypeService);
  private translate = inject(TranslationService);

  ngOnInit(): void {
    this.formInit();
    const id = this.route.snapshot.paramMap.get('id');
    const url = this.router.url;

    if (url.includes('/detail/')) {
      this.action = ACTION.DETAIL;
      if (id) this.getDataDetail(id);
      this.detailForm.disable();
    } else if (url.includes('/edit/')) {
      this.action = ACTION.EDIT;
      if (id) this.getDataDetail(id);
      // this.detailForm.get('code')?.disable();
    } else {
      this.action = ACTION.CREATE;
    }

    this.buildBreadcrumb();
    this.setDisplayTitle();
  }

  formInit() {
    this.detailForm = this.fb.group({
      requestId: [''],
      code: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX_CODE)]],
      name: [null, [Validators.required]],
      // executionTime: [null, [Validators.required, Validators.pattern(POSITIVE_INTEGER_REGEX)]],
      status: [true]
    });
  }

  buildBreadcrumb() {
    this.breadcrumbList = buildBreadcrumb(
      this.action || ACTION.DETAIL,
      'TRANSFER_SERVICE_TYPE',
      '/transfer-service-type',
      'Breadcrumbs'
    );
  }

  setDisplayTitle() {
    switch (this.action) {
      case ACTION.CREATE:
        this.displayTitlePages = this.translate.translate('TRANSFER_SERVICE_TYPE.CREATE.TITLE');
        break;
      case ACTION.EDIT:
        this.displayTitlePages = this.translate.translate('TRANSFER_SERVICE_TYPE.DETAIL.TITLE');
        break;
      case ACTION.DETAIL:
      default:
        this.displayTitlePages = this.translate.translate('TRANSFER_SERVICE_TYPE.DETAIL.TITLE');
        break;
    }
  }

  getDataDetail(id: string) {
    this.loadingService.show();
    this.transferServiceTypeService.getDetail(id)
      .pipe(
        takeUntil(this.destroy$),
        catchError(() => of(null)),
        finalize(() => this.loadingService.hide())
      )
      .subscribe((res: any) => {
        if (res?.data) {
          this.detailForm.patchValue({
            ...res.data,
            status: res.data.status === 1
          });
        }
      });
  }

  onSubmit() {
    if (this.detailForm.invalid) {
      this.detailForm.markAllAsTouched();
      return;
    }

    cleanForm(this.detailForm);
    const body = {
      ...this.detailForm.getRawValue(),
      status: this.detailForm.value.status ? 1 : 0
    };

    this.loadingService.show();
    const id: any = this.route.snapshot.paramMap.get('id');
    const obs$ = this.action === ACTION.CREATE
      ? this.transferServiceTypeService.create(body)
      : this.transferServiceTypeService.update({ id: id, body: body });

    obs$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingService.hide())
      )
      .subscribe((res: any) => {
        if (res?.code === 200) {
          this.router.navigate(['/transfer-service-type']);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
