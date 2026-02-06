import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, PLATFORM_ID } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
@Component({
    standalone: true,
    selector: 'app-device-widget',
    imports: [CommonModule, ButtonModule, MenuModule, ChartModule, I18nModule],
    styles: [
        `
            ::ng-deep p-chart {
                width: 100% !important;
                height: 100% !important;
            }
            ::ng-deep p-chart div canvas {
                height: 300px !important;
            }
            ::ng-deep .p-chart .p-chart-doughnut .p-chart-doughnut-legend {
                // height: 200px !important;
            }
        `
    ],
    template: `
        <div class="card border h-full flex flex-col">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200">
                <div class="font-semibold text-xl">
                    GIAO DỊCH
                </div>
            </div>
            <div class="flex flex-col flex-1 w-full h-full">
                <div class="flex flex-1 w-full">
                    <p-chart type="line" [data]="data" [options]="options" class="w-full h-full"></p-chart>
                </div>
            </div>
        </div>
    `
})
export class DeviceWidget {
    menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
    data: any;
    options: any;
    platformId = inject(PLATFORM_ID);
    constructor(private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.initChart();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';

            this.data = {
                labels: ['Tháng 7', 'Tháng 8', 'Tháng 9'], // 3 tháng
                datasets: [
                    {
                        label: 'Thành công',
                        data: [4200, 600, 6000], // dữ liệu theo 3 tháng
                        fill: false,
                        borderColor: '#1B84FF',
                        backgroundColor: '#1B84FF',
                        tension: 0.3, // độ cong đường
                        pointBackgroundColor: '#1B84FF',
                        pointBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: 'Thất bại',
                        data: [800, 3200, 900],
                        fill: false,
                        borderColor: '#FF6F1E',
                        backgroundColor: '#FF6F1E',
                        tension: 0.3,
                        pointBackgroundColor: '#FF6F1E',
                        pointBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    }
                ]
            };

            this.options = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: '#f0f0f0'
                        }
                    },
                    y: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: '#f0f0f0'
                        }
                    }
                }
            };

            this.cd.markForCheck();
        }
    }

}
