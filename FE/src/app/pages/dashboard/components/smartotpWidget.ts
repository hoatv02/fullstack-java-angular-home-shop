import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, Input, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { I18nModule } from '../../../../assets/i18n/i18n.module';
import { TranslationService } from '../../../../assets/i18n/translation.service';
import { Subscription } from 'rxjs';
@Component({
    standalone: true,
    selector: 'app-smart-otp-widget',
    imports: [CommonModule, ButtonModule, MenuModule, ChartModule, I18nModule],
    styles: [
        `
            ::ng-deep p-chart {
                width: 100% !important;
                height: 100% !important;
            }
            :host::ng-deep p-chart div canvas {
                height: 400px !important;
            }
            ::ng-deep .p-chart .p-chart-doughnut .p-chart-doughnut-legend {
                // height: 200px !important;
            }
        `
    ],
    template: `
        <div class="card border h-full flex flex-col">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200">
                <div class="font-semibold text-xl">SMART OTP</div>
            </div>
            <div class="flex flex-col flex-1 w-full h-full">
                 <span class="text-gray-400 dark:text-gray-300 mb-4 text-center"> {{'Common.Total'|translate}} {{totaltotalSuccess+totalFail}} {{'Common.Code'|translate}} </span>
                <div class="flex flex-1 w-full">
                    <p-chart type="bar" [data]="data" [options]="options" class="w-full h-full"></p-chart>
                </div>
            </div>
        </div>
    `
})
export class SmartOtpWidget {
    menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
    devices = [
        { version: 'iOS 17.6', count: 1100 },
        { version: 'iOS 17.5', count: 602 },
        { version: 'iOS 17.4', count: 300 },
        { version: 'iOS 16', count: 420 },
        { version: 'iOS 15', count: 420 },
        { version: 'iOS 13', count: 420 }
    ];
    data: any;

    options: any;

    platformId = inject(PLATFORM_ID);
    translationService = inject(TranslationService);

    totaltotalSuccess: number = 0
    totalFail: number = 0
    @Input() dataReponseSmartOtp: any;
    constructor(private cd: ChangeDetectorRef,
        private t: TranslationService

    ) { }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['dataReponseSmartOtp'] && this.dataReponseSmartOtp) {
            this.initChart();
            this.totaltotalSuccess = this.dataReponseSmartOtp.reduce((sum: any, item: any) => sum + item.success, 0);
            this.totalFail = this.dataReponseSmartOtp.reduce((sum: any, item: any) => sum + item.fail, 0);
        }
    }
    private langSub!: Subscription;

    ngOnInit(): void {
        this.langSub = this.t.lang$.subscribe((lang) => {
            const primengLocale = this.t['translations'][lang]?.primeng;
            if (primengLocale) {
                this.initChart()
            }
        });
    }
    ngOnDestroy() {
        this.langSub?.unsubscribe();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';

            const labels = this.dataReponseSmartOtp.map((item: any) => {
                const monthNumber = parseInt(item.month.split('-')[1], 10);
                const lang = this.translationService.getLanguage?.() || this.translationService.getLanguage() || 'en';
                const date = new Date(2000, monthNumber - 1, 1);
                const monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
                return monthName.charAt(0).toUpperCase() + monthName.slice(1);
            })
            const successData = this.dataReponseSmartOtp.map((d: any) => d.success);
            const failData = this.dataReponseSmartOtp.map((d: any) => d.fail);

            this.data = {
                labels,
                datasets: [
                    {
                        label: this.translationService.translate('Common.Successfully'),

                        data: successData,
                        backgroundColor: '#1B84FF',
                        borderRadius: 6,
                        borderColor: '#ffffff'
                    },
                    {
                        label: this.translationService.translate('Common.Failed'),

                        data: failData,
                        backgroundColor: '#FF6F1E',
                        borderRadius: 6,
                        borderColor: '#ffffff'
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
                            pointStyle: 'rectRounded'
                        }
                    }
                },
                layout: {
                    padding: 10
                },
                scales: {
                    x: {
                        stacked: false,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            display: false
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
