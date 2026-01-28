import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SHARED_MODULES } from '../../../../../../shared/shared.module';
import { CustomerService } from '../../../../service/customer.service';

@Component({
  selector: 'app-sms-gateway-detail',
  imports: [SHARED_MODULES],
  providers: [ConfirmationService, MessageService, CustomerService],
  templateUrl: './sms-gateway-detail.component.html',
  styleUrl: './sms-gateway-detail.component.scss'
})
export class SmsGatewayDetailComponent {
  pinConfigForm!: FormGroup;
  displayConfirmation: boolean = false;
  xacThucVisble: boolean = false;
  breadcrumbList = [{ label: 'Cấu hình SMS Gateway', routerLink: '/authentication' }];
  algorithmList = [
    {
      code: ' OCRA',
      name: 'OCRA'
    }
  ];
  pinLengthData = [
    {
      code: '6',
      name: '6 ký tự'
    },
  ];
  numberConfirmOTP = [
    {
      code: '1',
      name: '1'
    },
    {
      code: '2',
      name: '2'
    },
    {
      code: '3',
      name: '3'
    },
    {
      code: '4',
      name: '4'
    },
    {
      code: '5',
      name: '5'
    },
  ];
  public fb = inject(FormBuilder);

  ngOnInit(): void {
    this.formInit()
  }
  formInit() {
    this.pinConfigForm = this.fb.group({
      pinLength: [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      pinExpireTime: [null, Validators.required],
      maxCheckTimes: [null, Validators.required],
      detailConfigs: this.fb.array([])
    });
  }
  get detailConfigs(): FormArray {
    return this.pinConfigForm.get('detailConfigs') as FormArray;
  }
  onMaxCheckTimesChange(event: any) {
    const value = +event.value;
    this.detailConfigs.clear();

    if (value && value > 0) {
      for (let i = 0; i < value; i++) {
        this.detailConfigs.push(
          this.fb.group({
            conditionName: ['', Validators.required],
            conditionValue: [null, [Validators.required, Validators.min(1)]]
          })
        );
      }
    }
  }

  onSubmit(): void {
    if (this.pinConfigForm.valid) {
    } else {
      this.pinConfigForm.markAllAsTouched();
    }
  }
  onConfirmSwitchChange() {
    this.displayConfirmation = false;
  }
}
