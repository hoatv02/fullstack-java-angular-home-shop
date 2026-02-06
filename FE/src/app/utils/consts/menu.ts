export const modelMenu = [
    // {
    //     label: 'Menu.Home',
    //     items: [
    //         {
    //             label: 'Menu.Home',
    //             icon: "fa-solid fa-house",
    //             routerLink: ['/dashboard'],
    //             moduleCode: 'HOME'
    //         }
    //     ]
    // },
    {
        label: 'Menu.SystemAdmin',
        items: [
            {
                label: 'Menu.Administrator',
                icon: 'fa-solid fa-shield-halved',
                routerLink: ['/admin/admin'],
            },
        ]
    },
    {
        label: 'Menu.Manage',
        items: [
            {
                label: 'Menu.CustomerManagement',
                icon: 'fa-solid fa-users-gear',
                routerLink: ['/admin/customer'],
            },
        ]
    },
    // {
    //     label: 'Menu.Statistical',
    //     items: [
    //         {
    //             label: 'Menu.TransactionStatistics',
    //             icon: 'fa-solid fa-chart-line',
    //             routerLink: ['/admin/statistical-transaction'],
    //         },
    //         {
    //             label: 'Menu.OTPStatistics',
    //             icon: 'fa-solid fa-chart-pie',
    //             routerLink: ['/admin/statistical-otp'],
    //         },
    //         {
    //             label: 'Menu.DeviceStatistics',
    //             icon: 'fa-solid fa-chart-column',
    //             routerLink: ['/admin/statistical-device'],
    //         }
    //     ]
    // }
];