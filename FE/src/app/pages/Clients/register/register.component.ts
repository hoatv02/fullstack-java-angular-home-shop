import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ClientBreadcrumbComponent, BreadcrumbItem } from '../../../shared/components/client-breadcrumb/client-breadcrumb.component';
import { AuthService } from '../../../layout/Admins/service/auth.service';
import { NotificationService } from '../../../layout/Admins/service/notification.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ToastModule, ClientBreadcrumbComponent],
    providers: [],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Đăng ký tài khoản' }
    ];

    registerData = {
        username: '',
        password: '',
        email: '',
        phone: '',
        city: '',
        address: ''
    };

    constructor(
        private router: Router,
        private notification: NotificationService,
        private authService: AuthService
    ) { }

    onRegister(): void {
        const { username, password, email, phone, city, address } = this.registerData;

        if (!username || !password || !email || !phone || !city || !address) {
            this.notification.error('Lỗi', 'Vui lòng điền đầy đủ thông tin (*)');
            return;
        }

        this.authService.register(this.registerData).subscribe({
            next: (response) => {
                this.notification.success('Thành công', 'Đăng ký tài khoản thành công');
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 2000);
            },
            error: (error) => {
                this.notification.error('Lỗi', error?.error?.message || 'Đăng ký thất bại');
            }
        });
    }
}
