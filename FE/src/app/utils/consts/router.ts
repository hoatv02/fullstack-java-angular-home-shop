export enum authenRouter {
    login = '/authentication/login',
    loginAdmin = '/authentication/login-admin',
    loginJWT = '/authentication/login-admin',
    changepassword = "/operator/change-password",
    validateOtpLogin = '/authentication/validate-otp',
    forgotPassword = "/operator/forgot-password",
    updatePasswords = "/operator/update-forgot-password/",
    decodeToken = '/authentication/decode-token'
}
export enum dashboardRouter {
    adminSummaryReport = '/admin/report/summary',
    adminSummaryReportOTP = '/admin/report/summary-otp',
}
export enum activityRouter {
    activityFilter = '/admin/system-log/filter',
    activityExport = '/admin/system-log/export'
}


export enum requestLogFromCustomRouter {
    requestLogFromCustomFilter = '/admin/system-log/filter-3rd',
    requestLogFromCustomExport = '/admin/system-log/export-sam-3rd'
}
export enum lisenceRouter {
    lisenceFilter = '/license/info',
    lisenceExpired = '/license/info-exprie',
    uploadFileXml = '/license/import',
    getListNotification = '/notification',
    readNotification = '/notification/read',
    countNotification = '/notification/count',
}
export enum otpRouter {
    smartOtpLogFilter = '/admin/report/otp'
}
export enum deviceRouter {
    deviceFilter = '/admin/report/device',
    historyDevice = '/device/device-history',
    historyUser = '/user/user-history',
}
export enum configRouter {
    // OTP
    OtpConfigFilter = '/otp-config/filter',
    creatOtpConfig = '/otp-config',
    getOtpConfig = '/otp-config/',
    // Pin
    PinConfigFilter = '/pin-config/filter',
    creatPinConfig = '/pin-config',
    updatePinConfig = '/pin-config',
    getOtpPin = '/pin-config/send-otp?userId=',
    getPinConfig = '/pin-config/',
    getPinConfigDefault = '/pin-config/default ',
    // Email
    emailConfigFilter = '/email-config/filter',
    createEmailConfig = '/email-config',
    updateEmailConfig = '/email-config',
    getOtpMail = '/email-config/send-otp?userId=',
    getOtpOcraSMS = '/otp-config/send-otp?userId=',

    getEmailConfig = '/email-config/',
    getEmailConfigDefault = '/email-config/default',
    deleteEmailConfig = '/email-config/'
}
export enum systemLogRouter {
    otpLogFilter = '/admin/system-log/filter-otp',
    rasLogFilter = '/admin/system-log/filter-ras',
    filterService = '/admin/system-log/filter-service',
    samLogFilter = '/admin/system-log/filter-sam',
    exportOTPService = '/admin/system-log/export-otp',
    exportRasService = '/admin/system-log/export-ras',
    exportSamService = '/admin/system-log/export-sam',
    exportStatisticalOtp = '/admin/report/otp/export',
    exportStatisticalDevice = '/admin/report/device/export',
    exportDevice = '/device/export',

}
export enum transactionLogRouter {
    transactionReportFilter = '/admin/report/transaction',
    transactionLogFilter = '/transactions/list',
    export = '/transactions/export',
    paymentInfo = '/transactions/payment-info/',
    stepTransaction = '/transactions/payment-info/action/',
    exportStatisticalTransaction = '/admin/report/transaction/export',
    dropdownTransaction = "/transaction-type-config/get-dropdown"
}

export enum transactionTypeRouter {
    getDropdownTransaction = "/transaction-type-config/get-dropdown",
    transactionTypeFilter = '/transaction-type-config/filter',
    createTransactionType = '/transaction-type-config',
    updateTransactionType = '/transaction-type-config',
    getDetailTransactionType = '/transaction-type-config/',
    getOtpTransaction = '/transaction-type-config/send-otp?userId=',
    dropdownOtpConfigActiveList = '/otp-config/active-list'
}
export enum operatorRouter {
    operatorFilter = '/operator/filter',
    operatorById = '/operator/find-by-id',
    operatorCreate = '/operator/create',
    operatorUpdate = '/operator/update',
    operatorRemove = '/operator/remove/',
    operatorExport = '/operator/export',
    dropdownRolePermission = "/role/get-dropdown",
    activeStatusOperator = '/role/active/',
    resetPasswordOperator = "/operator/reset-password",
    logout = "/operator/logout",
    activeStatusOperators = '/operator/active/',
    deActiveStatusOperator = '/operator/de-active/'
}
export enum permissionRouter {
    permissionFilter = '/role/filter',
    permissionById = '/role/get-by-id/',
    getDropdownRole = '/role/get-dropdown',
    permissionByIdCheckMenu = '/role/get-by-id/check/',
    permissionCreate = '/role/created',
    permissionUpdate = '/role/update',
    permissionRemove = '/role/remove/',
    permissionAllModule = '/role/all-module',
    activeStatusRole = '/role/active/',
    deActiveStatusRole = '/role/de-active/'
}

export enum customerRouter {
    reportCustomer = '/admin/report/user',
    customerFilter = '/admin/user/filter',
    customerDeviceFilter = '/device/list-device',
    customerDetailDeviceCustomer = '/device/detail-device',
    customerDetailDevice = '/device/detail/',
    customerDataDetailDevice = '/admin/user/detail/',
    customerById = '/admin/user/get-device-by-username',
    customerCreate = '/customer-manager/create',
    customerUpdate = '/customer-manager/update',
    customerRemove = '/customer-manager/remove/',
    customerExport = '/admin/user/export',
    customerExportReport = '/admin/report/user/export',
    DeviceUpdateStatusLock = '/device/update-status',
    customerUpdateStatusLock = '/user/update-status',
    sendOtpDevice = "/device/send-otp?userId=",
    sendOtpCustomer = "/user/send-otp?userId=",
    downloadFilPem = "/user/public-key/",
    exportStatisticalCustomer = '/admin/report/otp/export'
}

export enum ProductsRouter {
    list = '/products'
}

export enum transferServiceTypeRouter {
    filter = '/payment-method/filter',
    detail = '/payment-method/',
    create = '/payment-method',
    update = '/payment-method/',
    export = '/payment-method/export'
}
