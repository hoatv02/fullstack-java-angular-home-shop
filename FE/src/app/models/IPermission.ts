export interface IPermission {
  id: string;
  code: string;
  name: string;
  description: string;
  status: boolean;
  modules: ModulePermission[];
}

export interface ModulePermission {
  moduleCode: string;
  permissionCodes: PermissionCode[];
}

export type PermissionCode = 'CREATED' | 'VIEW' | 'DETAIL' | 'UPDATED' | 'REMOVE';