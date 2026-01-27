import { Routes } from '@angular/router';
import administrationRoutes from './administration/administration.routes';
import auditLogRoutes from './audit-log/audit-log.routes';
import authenticationRoutes from './authentication/authentication.routes';
import configurationRoutes from './configuration/configuration.routes';
import licenseManagementRoutes from './license-management/license-management.routes';
import managersRoutes from './manager/managers.routes';
import reportRoutes from './report/report.routes';
import statisticalRoutes from './statistical/statistical.routes';
import systemLogRoutes from './system-log/system-log.routes';

export default [
    ...configurationRoutes,
    ...statisticalRoutes,
    ...licenseManagementRoutes,
    ...systemLogRoutes,
    ...reportRoutes,
    ...auditLogRoutes,
    ...authenticationRoutes,
    ...managersRoutes,
    ...administrationRoutes,
] as Routes;