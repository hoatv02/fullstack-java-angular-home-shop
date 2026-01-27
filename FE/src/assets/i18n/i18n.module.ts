import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import TranslatePipe from './translate.pipe';

@NgModule({
  declarations: [],
  imports: [CommonModule,TranslatePipe],
  exports: [TranslatePipe] // export để dùng bên ngoài
})
export class I18nModule {}
