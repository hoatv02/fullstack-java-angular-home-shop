import { Component, DestroyRef, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LoadingService } from '../../../../../layout/Admins/service/loading.service';
import { FormInputModel } from '../../../../../models/IFormInput';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { TableComponent } from '../../../components/table/table.component';
import { CustomerService } from '../../../service/customer.service';
import { CustomerComponent } from '../../manager/customer/customer.component';
import { StatisticalSmartOtpComponent } from './statistical-smart-otp/statistical-smart-otp.component';

@Component({
  selector: 'app-statistical-otp',
  imports: [SHARED_MODULES, StatisticalSmartOtpComponent],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './statistical-otp.component.html',
})
export class StatisticalOtpComponent {
  displayConfirmation: boolean = false;
  first: number = 0;
  totalRecords: number = 0;

  formInput: FormInputModel = new FormInputModel();
  breadcrumbList = [{ label: 'STATISTICS.OTP.TITLE', routerLink: '/customer' }];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild(TableComponent) tableComponent!: TableComponent;
  constructor(
    private customerService: CustomerService,
    private loadingService: LoadingService,
    public router: Router,
    private destroyRef: DestroyRef,
    private route: ActivatedRoute
  ) { }
  tabs: { title: string; value: number; component?: any; content?: string }[] = [];
  selectTabs = '0';
  ngOnInit() {
    this.tabs = [
      { title: 'Breadcrumbs.Authentication.SmartOTP', value: 0, component: CustomerComponent },
      { title: 'Breadcrumbs.Authentication.SMS', value: 1, component: CustomerComponent },
      { title: 'Breadcrumbs.Authentication.Email', value: 2, component: CustomerComponent }
    ];
  }
  tabIndexChange(event: any) {
    this.selectTabs = event;
  }

}
