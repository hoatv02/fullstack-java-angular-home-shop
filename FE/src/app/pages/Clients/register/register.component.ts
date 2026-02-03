import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ClientBreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/client-breadcrumb/client-breadcrumb.component';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ToastModule, ClientBreadcrumbComponent],
    providers: [MessageService],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Đăng ký tài khoản' }
    ];

    registerData = {
        fullName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address: ''
    };

    constructor(
        private router: Router,
        private messageService: MessageService
    ) { }

    onRegister(): void {
        const { fullName, username, password, confirmPassword, email, phone, address } = this.registerData;

        if (!fullName || !username || !password || !confirmPassword || !email || !phone || !address) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Vui lòng điền đầy đủ các thông tin bắt buộc (*)',
                life: 3000
            });
            return;
        }

        if (password !== confirmPassword) {
            this.messageService.add({
                severity: 'error',
                summary: 'Lỗi',
                detail: 'Mật khẩu xác nhận không khớp',
                life: 3000
            });
            return;
        }

        // Mock registration logic
        this.messageService.add({
            severity: 'success',
            summary: 'Thành công',
            detail: 'Đăng ký tài khoản thành công',
            life: 3000
        });

        setTimeout(() => {
            this.router.navigate(['/']);
        }, 2000);
    }
}
