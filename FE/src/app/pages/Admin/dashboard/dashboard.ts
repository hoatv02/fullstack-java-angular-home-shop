import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { I18nModule } from '../../../../assets/i18n/i18n.module';
import { LoadingService } from '../../../layout/Admins/service/loading.service';
import { CustomerWidget } from './components/customerWidget';
import { SmartOtpWidget } from './components/smartotpWidget';
import { SmsWidget } from './components/smsWidget';
import { TransactionWidget } from './components/transactionWidget';

@Component({
    standalone: true,
    selector: 'app-dashboard',
    imports: [CommonModule, I18nModule, ChartModule, CustomerWidget, SmartOtpWidget, SmsWidget, TransactionWidget],
    template: `
        <div class="grid grid-cols-12 gap-2">
            <div class="col-span-12 xl:col-span-12 gap-2 ">
                <div class="mb-4">
                    <div class="grid grid-cols-12 gap-4 items-stretch">
                        <div class="col-span-12 xl:col-span-4">
                            <app-transaction-widget *ngIf="dataReponseTransaction" [dataReponseTransaction]="dataReponseTransaction"/>
                        </div>
                        <div class="col-span-12 xl:col-span-8">
                            <app-customer-widget *ngIf="dataReponseUser" [dataReponseUser]="dataReponseUser"/>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-span-12 xl:col-span-12 gap-2 ">
                <div class="mb-4">
                    <div class="grid grid-cols-12 gap-4 items-stretch">
                        <div class="col-span-12 xl:col-span-4">
                            <app-smart-otp-widget *ngIf="dataReponseSmartOtp" [dataReponseSmartOtp]="dataReponseSmartOtp"/>
                        </div>
                        <div class="col-span-12 xl:col-span-8">
                            <app-sms-widget *ngIf="dataReponseDevice && dataReponseSmsOtp" [dataReponseDevice]="dataReponseDevice" [dataReponseSmsOtp]="dataReponseSmsOtp"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Dashboard {
    dataReponseUser: any
    dataReponseDevice: any
    dataReponseTransaction: any
    dataReponseSmsOtp: any
    dataReponseSmartOtp: any
    constructor(
        private loadingService: LoadingService,
    ) {
    }
    ngOnInit(): void {

    }
}
