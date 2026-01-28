import { SettingsConfigPinComponent } from './settings-config-pin/settings-config-pin.component';
import { Routes } from '@angular/router';
import { SystemLogComponent } from '../system-log/system-log.component';
import { OtpOcraSmsComponent } from './otp-ocra-sms/otp-ocra-sms.component';
import { PinComponent } from './pin/pin.component';
import { SmsGatewayComponent } from './sms-gateway/sms-gateway.component';
import { OtpOcraSmsDetailComponent } from './otp-ocra-sms/otp-ocra-sms-detail/otp-ocra-sms-detail.component';
import { PinDetailComponent } from './pin/pin-detail/pin-detail.component';
import { SmsGatewayDetailComponent } from './sms-gateway/sms-gateway-detail/sms-gateway-detail.component';
import { EmailGatewayComponent } from './email-gateway/email-gateway.component';
import { EmailGatewayDetailComponent } from './email-gateway/email-gateway-detail/email-gateway-detail.component';
import { SettingsConfigEmailGatewayComponent } from './settings-config-email-gateway/settings-config-email-gateway.component';

export default [
    // OTP
    {
        path: 'configuration-otp',
        component: OtpOcraSmsComponent,
    },
    {
        path: 'configuration-otp/detail/:id',
        component: OtpOcraSmsDetailComponent,
    },
    {
        path: 'configuration-otp/edit/:id',
        component: OtpOcraSmsDetailComponent,
    },
    {
        path: 'configuration-otp/create',
        component: OtpOcraSmsDetailComponent,
    },
    // PIN
    {
        path: 'configuration-pin',
        component: SettingsConfigPinComponent,
    },
    // {
    //     path: 'configuration-pin/detail/:id',
    //     component: PinDetailComponent,
    // },
    // {
    //     path: 'configuration-pin/edit/:id',
    //     component: PinDetailComponent,
    // },
    // {
    //     path: 'configuration-pin/create',
    //     component: PinDetailComponent,
    // },
    // SMS
    // {
    //     path: 'configuration-sms-gateway',
    //     component: SmsGatewayComponent,
    // },
    // {
    //     path: 'configuration-sms-gateway/detail/:id',
    //     component: SmsGatewayDetailComponent,
    // },
    // {
    //     path: 'configuration-sms-gateway/edit/:id',
    //     component: SmsGatewayDetailComponent,
    // },
    // {
    //     path: 'configuration-sms-gateway/create',
    //     component: SmsGatewayDetailComponent,
    // },
    // Email
    {
        path: 'configuration-email-gateway',
        component: SettingsConfigEmailGatewayComponent,
    },
    // {
    //     path: 'configuration-email-gateway/detail/:id',
    //     component: EmailGatewayDetailComponent,
    // }, {
    //     path: 'configuration-email-gateway/edit/:id',
    //     component: EmailGatewayDetailComponent,
    // },
    // {
    //     path: 'configuration-email-gateway/create',
    //     component: EmailGatewayDetailComponent,
    // },
] as Routes;
