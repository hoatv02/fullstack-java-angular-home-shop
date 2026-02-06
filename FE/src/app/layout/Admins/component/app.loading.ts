import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../service/loading.service';
import { SHARED_MODULES } from '../../../shared/shared.module';

@Component({
    selector: 'app-loading',
    standalone: true,
    imports: [CommonModule, SHARED_MODULES],
    template: `
        <div 
      *ngIf="loadingService.loading()"
      class="fixed inset-0 z-[99999] bg-black/50 flex items-center justify-center"
    >
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
    </div>
        <!-- <div *ngIf="loadingService.loading()" class="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div class="flex flex-col items-center gap-4">
                <img src="assets/images/icon/icon-bac-a-bank.png" alt="" width="50" height="50"/>
                <span class="text-white text-sm font-medium tracking-wide"> Đang tải... </span>
            </div>
        </div> -->
        <!-- <div *ngIf="loadingService.loading()" class="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-sm bg-black/40">
            <div class="flex flex-col items-center gap-4">
                <img src="assets/images/icon/icon-bac-a-bank.png" alt="" width="50" height="50" class="animate-spin" />
                <span class="text-white text-sm font-medium tracking-wide"> {{"Common.Reload"|translate}} </span>
            </div>
        </div> -->
    `,
    styles: [
        `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                to {
                    transform: rotate(360deg);
                }
            }
        `
    ]
})
export class LoadingComponent {
    loadingService = inject(LoadingService);
}
