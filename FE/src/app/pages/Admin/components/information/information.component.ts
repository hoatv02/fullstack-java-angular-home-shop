import { Component, EventEmitter, inject, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../../../layout/Admins/service/auth.service';
import { LoadingService } from '../../../../layout/Admins/service/loading.service';
import { SHARED_MODULES } from '../../../../shared/shared.module';
import { NOSPECIALCHARREGEX, PHONE_REGEX } from '../../../../utils/enums/const';

@Component({
  selector: 'app-information',
  imports: [SHARED_MODULES],
  templateUrl: './information.component.html',
})
export class InformationComponent {
  @Input() informationModal = false;
  @Output() close = new EventEmitter<void>();

  userForm!: FormGroup;
  roles: any[] = [];

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private loadingService = inject(LoadingService);
  ngOnInit(): void {
    this.formInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['informationModal']?.currentValue === true) {
      this.userForm.reset()
      this.getDataDetail();
      this.userForm.get("userName")?.disable()
    }
  }

  formInit() {
    this.userForm = this.fb.group({
      roleId: [null, [Validators.required]],
      userName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      email: [null, [Validators.required, Validators.email]],
      status: [1],
      firstName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      lastName: [null, [Validators.required, Validators.pattern(NOSPECIALCHARREGEX)]],
      phone: [null, [Validators.pattern(PHONE_REGEX)]],
    });
  }


  getDataDetail() {

  }



  updateOperator() {

  }

  submitUpdateProfile() {
    if (this.userForm.valid) {
      this.updateOperator();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onHide() {
    this.close.emit();
  }
}
