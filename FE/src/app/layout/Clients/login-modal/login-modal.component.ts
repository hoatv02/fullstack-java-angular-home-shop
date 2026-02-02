import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login-modal',
    standalone: true,
    imports: [CommonModule],
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
          <form class="space-y-4">
            <div>
              <input type="text" placeholder="Tài khoản" class="w-full px-4 py-3 rounded-full border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-slate-600">
            </div>
            <div>
              <input type="password" placeholder="Mật khẩu" class="w-full px-4 py-3 rounded-full border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-400 text-slate-600">
            </div>
            
            <div class="text-left">
                <a href="#" class="text-slate-500 hover:text-primary text-sm transition-colors">Quên mật khẩu ?</a>
            </div>

            <button type="button" class="w-full bg-[#007bfb] hover:bg-[#0069d9] text-white font-bold py-3 rounded-full shadow-lg shadow-blue-500/30 transition-all transform active:scale-[0.98]">
              Đăng nhập
            </button>
          </form>

          <div class="mt-6 text-left">
            <a href="#" class="text-[#007bfb] font-bold text-sm hover:underline uppercase">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginModalComponent {
    @Input() visible: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();

    close() {
        this.visible = false;
        this.visibleChange.emit(this.visible);
    }
}
