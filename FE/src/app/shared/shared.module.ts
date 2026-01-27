
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { I18nModule } from '../../assets/i18n/i18n.module';
import { BreadcrumbComponent } from './components/bread-crumb.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { SHARED_PRIMENG_MODULES } from './shared-primeng.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    ConfirmDialogComponent,
    RouterModule,
    I18nModule,
    ...SHARED_PRIMENG_MODULES
  ],
  exports: [
    CommonModule,
    FormsModule,
    BreadcrumbComponent,
    ConfirmDialogComponent,
    ReactiveFormsModule,
    RouterModule,
    I18nModule,
    ...SHARED_PRIMENG_MODULES
  ],
})
export class SHARED_MODULES { } 