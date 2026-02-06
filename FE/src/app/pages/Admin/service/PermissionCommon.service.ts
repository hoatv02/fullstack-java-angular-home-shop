import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, of } from 'rxjs';
import { ModulePermission } from '../../../models/IPermission';

@Injectable({ providedIn: 'root' })
export class PermissionCommonService {
    private modulePermissionsSubject = new BehaviorSubject<ModulePermission[]>([]);
    modulePermissions$ = this.modulePermissionsSubject.asObservable();
    constructor() { }
    /** Load permissions từ API, tự động cập nhật BehaviorSubject */
    loadPermissions(roleId: string) {
        if (!roleId) {
            this.modulePermissionsSubject.next([]);
            return;
        }

    }

    /** Kiểm tra quyền */
    hasPermission(moduleCode: string, perm: keyof any): boolean {
        const modules = this.modulePermissionsSubject.getValue();
        const mod: any = modules.find(m => m.moduleCode === moduleCode);
        return mod?.permissions[perm] ?? false;
    }

    subscribePermissions(moduleCode: string, perms: (keyof any)[]) {
        return this.modulePermissions$.pipe(
            map(() => {
                const result: Record<string, boolean> = {};
                perms.forEach((p: any) => {
                    result[p] = this.hasPermission(moduleCode, p);
                });
                return result;
            })
        );
    }

}
