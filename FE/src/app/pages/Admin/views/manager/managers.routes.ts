import { Routes } from '@angular/router';
import { CustomerDetailComponent } from './customer/customer-detail/customer-detail.component';
import { CustomerComponent } from './customer/customer.component';
import { DeviceManagerComponent } from './device-manager/device-manager.component';
import { TransactionLogComponent } from './transaction-log/transaction-log.component';
import { TransactionTypeComponent } from './transaction-type/transaction-type.component';
import { TransactionTypeDetailComponent } from './transaction-type/transaction-type-detail/transaction-type-detail.component';
import { TransactionLogDetailComponent } from './transaction-log/transaction-log-detail/transaction-log-detail.component';
import { DeviceManagerDetailComponent } from './device-manager/device-manager-detail/device-manager-detail.component';
import { TransferServiceTypeComponent } from './transfer-service-type/transfer-service-type.component';
import { TransferServiceTypeDetailComponent } from './transfer-service-type/transfer-service-type-detail/transfer-service-type-detail.component';

export default [
    {
        path: 'customer',
        component: CustomerComponent
    },
    { path: 'customer/:id', component: CustomerDetailComponent },
    {
        path: 'device',
        component: DeviceManagerComponent
    },
    { path: 'device/:id', component: DeviceManagerDetailComponent },

    {
        path: 'transaction-log',
        component: TransactionLogComponent
    },
    {
        path: 'transaction-log/detail/:id',
        component: TransactionLogDetailComponent
    },
    {
        path: 'transaction-type',
        component: TransactionTypeComponent
    },
    {
        path: 'transaction-type/detail/:id',
        component: TransactionTypeDetailComponent
    },
    {
        path: 'transaction-type/edit/:id',
        component: TransactionTypeDetailComponent
    },
    {
        path: 'transaction-type/create',
        component: TransactionTypeDetailComponent
    },
    {
        path: 'transfer-service-type',
        component: TransferServiceTypeComponent
    },
    {
        path: 'transfer-service-type/edit/:id',
        component: TransferServiceTypeDetailComponent
    },
     {
        path: 'transfer-service-type/create',
        component: TransferServiceTypeDetailComponent
    },
    {
        path: 'transfer-service-type/detail/:id',
        component: TransferServiceTypeDetailComponent
    }
] as Routes;
