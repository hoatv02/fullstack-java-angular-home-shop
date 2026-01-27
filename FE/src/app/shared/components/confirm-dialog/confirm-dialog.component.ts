import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [ButtonModule, DialogModule, CommonModule],
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input() visible: boolean = false;
  @Input() confirmVisiable: boolean = false;
  @Input() message: string = 'Are you sure you want to proceed?';
  @Input() header: string = 'Confirmation';
  @Input() confirmLabel: string = 'Yes';
  @Input() cancelLabel: string = 'No';
  @Input() width: string = '400px';
  @Input() showButtonSubmit: boolean = true;
  @Input() closable: boolean = true;
  @Input() showButtonCancel: boolean = true;
  @Input() formTemplate?: TemplateRef<any>;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
