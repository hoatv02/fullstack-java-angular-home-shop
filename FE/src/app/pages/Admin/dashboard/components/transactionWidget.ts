import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, inject, Input, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MenuModule } from 'primeng/menu';
import { I18nModule } from '../../../../../assets/i18n/i18n.module';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { Subscription } from 'rxjs';
@Component({
    standalone: true,
    selector: 'app-transaction-widget',
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
                <div class="font-semibold text-xl uppercase">
                   {{ 'Dashboard.Transaction' | translate }}
                </div>
            </div>
            <div class="flex flex-col flex-1 w-full h-full">
                <div class="flex flex-1 w-full" *ngIf="dataReponseTransaction">
                    <p-chart type="line" [data]="data" [options]="options" class="w-full h-full"></p-chart>
                </div>
            </div>
        </div>
    `
})
export class TransactionWidget {
    menu = null;

    items = [
        { label: 'Add New', icon: 'pi pi-fw pi-plus' },
        { label: 'Remove', icon: 'pi pi-fw pi-trash' }
    ];
    data: any;
    options: any;
    platformId = inject(PLATFORM_ID);
    translationService = inject(TranslationService);
    @Input() dataReponseTransaction: any;
    constructor(private cd: ChangeDetectorRef,
        private t: TranslationService
    ) { }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['dataReponseTransaction'] && this.dataReponseTransaction) {
            this.initChart();
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
        if (isPlatformBrowser(this.platformId) && this.dataReponseTransaction) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
            const labels = this.dataReponseTransaction.map((item: any) => {
                const monthNumber = parseInt(item.month.split('-')[1], 10);
                const lang = this.translationService.getLanguage?.() || this.translationService.getLanguage() || 'en';
                const date = new Date(2000, monthNumber - 1, 1);
                const monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
                return monthName.charAt(0).toUpperCase() + monthName.slice(1);
            })

            const successData = this.dataReponseTransaction.map((item: any) => item.successCount);
            const failedData = this.dataReponseTransaction.map((item: any) => item.failedCount);
            const canceledCount = this.dataReponseTransaction.map((item: any) => item.canceledCount);
            const expiredCount = this.dataReponseTransaction.map((item: any) => item.expiredCount);

            this.data = {
                labels,
                datasets: [
                    {
                        label: this.translationService.translate('Common.Successfully'),
                        data: successData,
                        fill: false,
                        borderColor: '#1B84FF',
                        backgroundColor: '#1B84FF',
                        tension: 0.3,
                        pointBackgroundColor: '#1B84FF',
                        pointBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: this.translationService.translate('Common.Failed'),
                        data: failedData,
                        fill: false,
                        borderColor: '#FF6F1E',
                        backgroundColor: '#FF6F1E',
                        tension: 0.3,
                        pointBackgroundColor: '#FF6F1E',
                        pointBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: this.translationService.translate('Common.Cancel'),
                        data: canceledCount,
                        fill: false,
                        borderColor: '#F6C000',
                        backgroundColor: '#F6C000',
                        tension: 0.3,
                        pointBackgroundColor: '#F6C000',
                        pointBorderColor: '#ffffff',
                        pointRadius: 6,
                        pointHoverRadius: 8
                    },
                    {
                        label: this.translationService.translate('STATISTICS.TRANSACTION.expired_transaction'),
                        data: expiredCount,
                        fill: false,
                        borderColor: '#7239EA',
                        backgroundColor: '#7239EA',
                        tension: 0.3,
                        pointBackgroundColor: '#7239EA',
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
                            pointStyle: 'rectRounded'
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
