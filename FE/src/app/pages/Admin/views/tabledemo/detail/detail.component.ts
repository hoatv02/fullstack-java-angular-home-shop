import { Component } from '@angular/core';
import { SHARED_MODULES } from '../../../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cleanForm } from '../../../../../utils/utils';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [SHARED_MODULES],
  templateUrl: './detail.component.html',
})
export class DetailComponent {
  form!: FormGroup;
  quantities = [
    { label: '250 - $29.00', value: 250 },
    { label: '500 - $49.00', value: 500 },
    { label: '1000 - $89.00', value: 1000 },
  ];
  listboxValues = [{ name: 'Option 1' }, { name: 'Option 2' }];
  dropdownValues = [{ name: 'One' }, { name: 'Two' }];
  multiselectCountries = [{ name: 'Vietnam', code: 'VN' }, { name: 'USA', code: 'US' }];
  treeSelectNodes = []; // Bạn tự fill dữ liệu tree
  selectButtonValues = [{ name: 'A' }, { name: 'B' }];

  constructor(private fb: FormBuilder) { }
  breadcrumbList = [
    { label: 'Trang chủ', routerLink: '/' },
    { label: 'Tin tức', routerLink: '/table' },
    { label: 'Chi tiết' }
  ];
  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: ['', Validators.required],
      phone: ['', Validators.required],
      company: ['', Validators.required],

      cardFirstName: ['', Validators.required],
      cardLastName: ['', Validators.required],
      jobTitle: ['', Validators.required],

      includes: [[]],
      quantity: [null, Validators.required],
      shipTo: [true, Validators.required],
      birthday: [null, Validators.required],

      notes: ['']
    });
  }

  submitForm(): void {
    cleanForm(this.form); // 👈 Dọn khoảng trắng trước
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formData = this.form.value;
  }
}
