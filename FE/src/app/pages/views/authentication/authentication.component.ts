import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabsModule } from 'primeng/tabs';
import { I18nModule } from '../../../../assets/i18n/i18n.module';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [TabsModule, CommonModule, I18nModule],
  templateUrl: './authentication.component.html',
  providers: [ConfirmationService, MessageService, CustomerService]
})
export class AuthenticationComponent {
  tabs: { title: string; value: number; component?: any; content?: string }[] = [];
  selectTabs = 0;
  ngOnInit() {
    this.tabs = [];
  }
}
