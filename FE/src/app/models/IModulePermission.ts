type Permission = 'VIEW' | 'DETAIL' | 'CREATED' | 'UPDATED' | 'REMOVE';

export interface ModulePermission {
    moduleCode: string;
    permissions: Record<Permission, boolean>;
}