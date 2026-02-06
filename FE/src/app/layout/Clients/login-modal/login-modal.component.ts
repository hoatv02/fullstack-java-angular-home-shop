import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Admins/service/auth.service';
import { LOCAL_STORAGE_AUTH_KEY } from '../../../utils/enums/const';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  styles: [`
    @keyframes scaleIn {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .modal-content {
      animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .backdrop {
        animation: fadeIn 0.2s ease-out forwards;
    }
  `],
  template: `
    <div *ngIf="visible" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity backdrop" (click)="close()"></div>

      <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-[480px] overflow-hidden modal-content">
        <div class="p-8">
          <h2 class="text-2xl font-bold text-center mb-6 text-slate-800 uppercase">Đăng nhập</h2>
          <div class="flex gap-3 mb-6">
            <button class="flex-1 bg-[#007bfb] hover:bg-[#0069d9] text-white py-2.5 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors text-sm">
                <i class="fa-brands fa-google text-lg"></i>
                Đăng nhập google
            </button>
            <button class="flex-1 bg-[#007bfb] hover:bg-[#0069d9] text-white py-2.5 px-4 rounded-full font-medium flex items-center justify-center gap-2 transition-colors text-sm">
                <i class="fa-brands fa-facebook text-lg"></i>
                Đăng nhập facebook
            </button>
          </div>

          <div class="flex items-center gap-4 mb-6">
            <div class="h-[1px] bg-slate-200 flex-1"></div>
            <span class="text-slate-500 text-sm">Hoặc tài khoản</span>
            <div class="h-[1px] bg-slate-200 flex-1"></div>
          </div>

          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
            <div>
              <input 
                type="text" 
                formControlName="username"
                placeholder="Tài khoản" 
                class="w-full px-4 py-3 rounded-full border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-slate-600"
                [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
              <p *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="text-red-500 text-xs mt-1 ml-4">
                Vui lòng nhập tài khoản
              </p>
            </div>
            <div>
              <input 
                type="password" 
                formControlName="password"
                placeholder="Mật khẩu" 
                class="w-full px-4 py-3 rounded-full border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-slate-600"
                [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <p *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-red-500 text-xs mt-1 ml-4">
                Vui lòng nhập mật khẩu
              </p>
            </div>
            
            <div *ngIf="errorMessage" class="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-full">
              {{ errorMessage }}
            </div>
            
            <div class="text-left">
                <a href="#" class="text-slate-500 hover:text-primary text-sm transition-colors">Quên mật khẩu ?</a>
            </div>

            <button 
              type="submit" 
              [disabled]="loading || loginForm.invalid"
              class="w-full bg-[#007bfb] hover:bg-[#0069d9] text-white font-bold py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
              <span *ngIf="!loading">Đăng nhập</span>
              <span *ngIf="loading" class="flex items-center justify-center gap-2">
                <i class="fa fa-spinner fa-spin"></i>
                Đang đăng nhập...
              </span>
            </button>
          </form>

          <div class="mt-6 text-left">
            <a routerLink="/register" (click)="close()" class="text-[#007bfb] font-bold text-sm hover:underline uppercase">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginModalComponent {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() loginSuccess = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.authService.loginClient({ username, password }).subscribe({
      next: (response) => {
        this.loading = false;

        if (response.code === 200 && response.data) {
          const authData = this.authService.getDataAuthLocalStorage();
          this.loginSuccess.emit(authData);
          this.loginForm.reset();
          this.close();
        } else {
          this.errorMessage = response.data?.message || response.message || 'Đăng nhập thất bại';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.data?.message || error.error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.';
      }
    });
  }

  close() {
    this.visible = false;
    this.visibleChange.emit(this.visible);
    this.errorMessage = '';
    this.loginForm.reset();
  }
}
