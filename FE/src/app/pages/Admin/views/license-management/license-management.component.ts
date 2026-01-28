import { LisenceService } from './../../service/Lisence.service';
import { Component, DestroyRef, inject } from '@angular/core';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { NotificationService } from '../../../../layout/Admins/service/notification.service';
import { OperatorService } from '../../service/operator.service';
import { LoadingService } from '../../../../layout/Admins/service/loading.service';
import { ActivityService } from '../../service/Activity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileExportService } from '../../service/FileExport.service';
import { catchError, finalize, of, Subject, Subscription, takeUntil } from 'rxjs';
import { PermissionCommonService } from '../../service/PermissionCommon.service';
@Component({
  selector: 'app-license-management',
  standalone: true,
  imports: [SHARED_MODULES,],
  templateUrl: './license-management.component.html',
  styleUrl: './license-management.component.scss'
})
export class LicenseManagementComponent {
  breadcrumbList = [{ label: 'LICENSE.TITLE', routerLink: '/activity-log' }];
  xmlContent: any
  private notification = inject(NotificationService);
  permissions: Record<string, boolean> = {};
  permissionsSub?: Subscription;
  private destroy$ = new Subject<void>();
  constructor(
    private loadingService: LoadingService,
    private lisenceService: LisenceService,
    public router: Router,
    public permissionCommon: PermissionCommonService

  ) { }
  onUpload(event: any) {
    const file: File = event.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = (reader.result as string).split(',')[1];
      this.uploadFileXML(base64String)
    };

    reader.readAsDataURL(file);
  }
  uploadFileXML(base64String: any) {
    this.loadingService.show();
    this.lisenceService
      .uploadFileXML({
        "fileName": "bab-license-uat-signed.xml",
        base64File: base64String
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
          this.getLisence()
        },
      });
  }


  ngOnInit(): void {
    this.getLisence()
    this.loadFunctionPermission();

  }

  loadFunctionPermission() {
    this.permissionCommon.subscribePermissions('LICENSE', ['VIEW', 'DETAIL', 'CREATED', 'UPDATED', 'REMOVE'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.permissions = result;
      });
  }

  ngOnDestroy() {
    this.permissionsSub?.unsubscribe();
  }



  getLisence() {
    this.loadingService.show();
    this.lisenceService
      .getData()
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
          this.xmlContent = this.mapApiResponseToLicense(data?.data);
        },
      });
  }
  mapApiResponseToLicense(api: any) {
    return {
      partnerName: api.partner?.name || '',
      saleContact: api.partner?.saleContact || '',
      partnerEmail: api.partner?.partnerEmail || '',
      partnerPhone: api.partner?.partnerPhone || '',
      companyName: api.company?.name || '',
      companyAddress: api.company?.contact?.address || '',
      contactPhone: api.company?.contact?.phoneNo || '',
      contactFax: api.company?.contact?.faxNo || '',
      contactEmail: api.company?.contact?.emailAddress || '',
      productCode: api.product?.code || '',
      productName: api.product?.name || '',
      description: api.description || '',
      startDate: api.product?.startDate || '',
      expiryDate: api.product?.expiryDate || '',
      modules: (api.modules || []).map((m: any) => ({
        name: m.name,
        status: m.status,
        count: m.count ?? null
      })),
      keyCount: api.product?.keyCount || 0,
      signatureCount: '',
      certificateCount: '',
    };
  }

  async copyToClipboard() {
    try {
      await navigator.clipboard.writeText(this.xmlContent);
      this.notification.success('Thành công', 'Sao chép thành công!')
    } catch (err) {
    }
  }
}

