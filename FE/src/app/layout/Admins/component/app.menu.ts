import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { ModulePermission } from '../../../models/IPermission';
import { modelMenu } from '../../../utils/consts/menu';
import { AuthService } from '../service/auth.service';
import { AppMenuitem } from './app.menuitem';
import { PermissionCommonService } from '../../../pages/Admin/service/PermissionCommon.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu ">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
  @Input() userId!: string;
  @Input() roleId!: string;
  @Input() username!: string;
  model: MenuItem[] = [];
  menuPermission: any[] = [];
  constructor(
    private t: TranslationService,
    private authService: AuthService,
    private cdf: ChangeDetectorRef,
  ) { }

  private destroy$ = new Subject<void>();

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("🚀 This is! __ changes:", changes)
    // if (changes['roleId'] && !changes['roleId'].firstChange) {
    //   const roleId = changes['roleId'].currentValue;
    //   if (modelMenu && this.roleId) {
    //     this.permissionCommon.loadPermissions(this.roleId);

    //     this.permissionCommon.modulePermissions$
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe(modules => {
    //         this.modulePermissions = modules;
    //         this.updateMenu();
    //       });

    //     this.t.lang$
    //       .pipe(takeUntil(this.destroy$))
    //       .subscribe(() => {
    //         this.updateMenu();
    //       });
    //   }
    // }
    this.updateMenu();

  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  modulePermissions: ModulePermission[] = []
  filterMenu(items: MenuItem[]): MenuItem[] {
    return items
      .map((i: any) => {
        console.log("🚀 This is! __ i:", i)
        // const hasView = this.hasPermission(i.moduleCode!, 'VIEW');
        // console.log("🚀 This is! __ hasView:", hasView)

        const children = i.items ? this.filterMenu(i.items) : [];

        if (children.length > 0) return { ...i, items: children };
        // if (hasView) return i;

        return i;
      })
      .filter(Boolean) as MenuItem[];
  }

  hasPermission(module: string, perm: any) {
    const mod: any = this.modulePermissions.find(m => m.moduleCode === module);
    return mod?.permissions[perm] ?? false;
  }
  updateMenu() {
    this.model = this.filterMenu(modelMenu);
  }
}
