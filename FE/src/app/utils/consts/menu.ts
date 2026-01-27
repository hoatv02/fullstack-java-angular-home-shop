export const modelMenu = [
    {
        label: 'Menu.Home',
        items: [
            // <i class="fa-solid fa-house"></i>
            {
                label: 'Menu.Home',
                icon: "fa-solid fa-house",
                routerLink: ['/dashboard'],
                moduleCode: 'HOME'
            }
        ]
    },
    {
        label: 'Menu.SystemAdmin',
        items: [
            {
                label: 'Menu.Administrator',
                icon: 'fa-solid fa-shield-halved',
                routerLink: ['/admin'],
                moduleCode: 'ADMIN'
            },
            {
                label: 'Menu.Decentralization',
                icon: 'fa-solid fa-lock',
                routerLink: ['/role'],
                "moduleCode": "ROLE",
            },
            {
                label: 'Menu.ActivityLog',
                icon: 'fa-solid fa-clipboard-list',
                routerLink: ['/activity-log'],
                "moduleCode": "ACTIVITY_LOG",

            }
        ]
    },
    {
        label: 'Menu.Manage',
        items: [
            {
                label: 'Menu.CustomerManagement',
                icon: 'fa-solid fa-users-gear',
                routerLink: ['/customer'],
                moduleCode: 'CUSTOMER'
            },
            {
                label: 'Menu.DeviceManagement',
                icon: 'fa-solid fa-mobile-screen',
                routerLink: ['/device'],
                moduleCode: 'DEVICE'

            },
            {
                label: 'Menu.TransactionLog',
                icon: 'fa-solid fa-book',
                routerLink: ['/transaction-log'],
                moduleCode: 'TRANSACTION_HISTORY'

            },

        ]
    },
    {
        label: 'Menu.Configuration',
        items: [
            {
                label: 'Menu.TransactionType',
                icon: 'fa-solid fa-sliders',
                routerLink: ['/transaction-type'],
                moduleCode: 'TRANSACTION_TYPE'

            },
            {
                label: 'Menu.ConfigurationOTPOCRA',
                icon: 'fa-solid fa-key',
                routerLink: ['/configuration-otp'],
                moduleCode: 'OTP_CONFIG'

            },
            {
                label: 'Menu.ConfigurationPIN',
                icon: 'fa-solid fa-tag',
                routerLink: ['/configuration-pin'],
                moduleCode: 'PIN_CONFIG'

            },
            // {
            //   label: 'Menu.ConfigurationSMSGateway',
            //   icon: 'pi pi-fw pi-home',
            //   routerLink: ['/configuration-sms-gateway'],
            // },
            {
                label: 'Menu.ConfigurationEmailGateway',
                icon: 'fa-solid fa-envelope',
                routerLink: ['/configuration-email-gateway'],
                moduleCode: 'EMAIL_GATEWAY'

            },
            {
                label: 'Menu.TransferServiceType',
                icon: 'fa-solid fa-book',
                routerLink: ['/transfer-service-type'],
                moduleCode: 'TRANSFER_SERVICE_TYPE'
            },
        ]
    },
    {
        label: 'Menu.SystemLog',
        items: [
            {
                label: 'Menu.SystemLog',
                icon: 'fa-solid fa-server',
                routerLink: ['/system-log'],
                moduleCode: 'INTERNAL_LOG'

            },
            {
                label: 'Menu.ThirdPartyContractLog',
                icon: 'fa-solid fa-file',
                routerLink: ['/request-log-from-custom'],
                moduleCode: 'THIRD_PARTY_LOG'

            }
        ]
    },
    {

        label: 'Menu.LicenseManagement',
        items: [
            {
                label: 'Menu.LicenseManagement',
                icon: 'fa-solid fa-id-card',
                routerLink: ['/license-management'],
                moduleCode: 'LICENSE'

            }
        ]
    },
    {
        label: 'Menu.Statistical',
        items: [
            {
                label: 'Menu.TransactionStatistics',
                icon: 'fa-solid fa-chart-line',
                routerLink: ['/statistical-transaction'],
                moduleCode: 'TRANSACTION_STATISTIC'
            },
            {
                label: 'Menu.OTPStatistics',
                icon: 'fa-solid fa-chart-pie',
                routerLink: ['/statistical-otp'],
                moduleCode: 'OTP_STATISTIC'
            },
            // {
            //     label: 'Menu.CustomerStatistics',
            //     icon: 'fa-solid fa-chart-simple',
            //     routerLink: ['/statistical-customer'],
            //     moduleCode: 'CUSTOMER_STATISTIC'
            // },
            {
                label: 'Menu.DeviceStatistics',
                icon: 'fa-solid fa-chart-column',
                routerLink: ['/statistical-device'],
                moduleCode: 'DEVICE_STATISTIC'
            }
        ]
    }
];