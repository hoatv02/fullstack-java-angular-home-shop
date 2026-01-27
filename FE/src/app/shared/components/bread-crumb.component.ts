import { Component, Input } from '@angular/core';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TranslationService } from '../../../assets/i18n/translation.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [BreadcrumbModule],
  styles: [`
      ::ng-deep .p-breadcrumb{ 
        margin: 0 !important;
        padding:10px 0 !important;
    }
  `],
  template: `  <p-breadcrumb
      [model]="computedItems"
      [home]="showHome ? home : undefined"
    />`,
})
export class BreadcrumbComponent {
  @Input() items: { label: string; routerLink?: string }[] = [];
  @Input() showHome = true;

  home = { icon: 'pi pi-home', routerLink: '/' };

  constructor(private t: TranslationService) { }

  get computedItems() {
    if (!this.items?.length) return [];

    return this.items.map((item, index) => {
      const translatedLabel = this.t.translate(item.label);
      if (index === this.items.length - 1) {
        return { label: translatedLabel };
      }
      return { ...item, label: translatedLabel };
    });
  }
}
