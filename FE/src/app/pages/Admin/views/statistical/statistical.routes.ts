import { Routes } from '@angular/router';
import { StatisticalTransactionComponent } from './statistical-transaction/statistical-transaction.component';
import { StatisticalCustomerComponent } from './statistical-customer/statistical-customer.component';
import { StatisticalDeviceComponent } from './statistical-device/statistical-device.component';
import { StatisticalOtpComponent } from './statistical-otp/statistical-otp.component';

export default [
    {
        path: 'statistical-transaction',
        component: StatisticalTransactionComponent
    },
    {
        path: 'statistical-customer',
        component: StatisticalCustomerComponent
    },
    {
        path: 'statistical-otp',
        component: StatisticalOtpComponent
    },
    {
        path: 'statistical-device',
        component: StatisticalDeviceComponent
    },
] as Routes;
