// import { ActivityLogComponent } from './activity-log/activity-log.component';
// import { Routes } from '@angular/router';
// import { AdminComponent } from './admin/admin.component';
// import { DetailsComponent } from './admin/detail/detail.component';
// import { PermissionRoleDetailComponent } from './permisson-role/permission-role-detail/permission-role-detail.component';
// import { PermissonRoleComponent } from './permisson-role/permisson-role.component';

// export default [
//     {
//         path: 'admin',
//         component: AdminComponent,
//         children: [
//             { path: 'edit/:id', component: DetailsComponent },
//             { path: 'detail/:id', component: DetailsComponent },
//             { path: 'create', component: DetailsComponent }
//         ]
//     },

//     {
//         path: 'activity-log',
//         component: ActivityLogComponent,

//     },
//     {
//         path: 'role',
//         component: PermissonRoleComponent,
//         children: [
//             { path: 'edit/:id', component: PermissionRoleDetailComponent },
//             { path: 'detail/:id', component: PermissionRoleDetailComponent },
//             { path: 'create', component: PermissionRoleDetailComponent }
//         ]
//     }
// ] as Routes;

import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { DetailsComponent } from './admin/detail/detail.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { PermissonRoleComponent } from './permisson-role/permisson-role.component';
import { PermissionRoleDetailComponent } from './permisson-role/permission-role-detail/permission-role-detail.component';

export default [
    // ADMIN
    {
        path: 'admin',
        component: AdminComponent,
    },
    {
        path: 'admin/detail/:id',
        component: DetailsComponent,
    },
    {
        path: 'admin/edit/:id',
        component: DetailsComponent,
    },
    {
        path: 'admin/create',
        component: DetailsComponent,
    },

    // ACTIVITY LOG
    {
        path: 'activity-log',
        component: ActivityLogComponent,
    },

    // ROLE
    {
        path: 'role',
        component: PermissonRoleComponent,
    },
    {
        path: 'role/detail/:id',
        component: PermissionRoleDetailComponent,
    },
    {
        path: 'role/edit/:id',
        component: PermissionRoleDetailComponent,
    },
    {
        path: 'role/create',
        component: PermissionRoleDetailComponent,
    }

] as Routes;
