import { Component, inject } from '@angular/core';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { AppConfigurator } from '../../../../layout/Admins/component/app.configurator';

@Component({
  selector: 'app-change-password-success',
  imports: [SHARED_MODULES, AppConfigurator],
  templateUrl: './change-password-success.component.html',
  styleUrls: ['./change-password-success.component.scss']
})
export class ChangePasswordSuccessComponent {
  private router = inject(Router);

  Login() {
    this.router.navigate(['/auth/login'])
  }
}
