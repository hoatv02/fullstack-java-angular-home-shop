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
    selector: 'app-customer-widget',
    imports: [CommonModule, ButtonModule, MenuModule, ChartModule, I18nModule],
    styles: [
        `
            ::ng-deep p-chart {
                width: 100% !important;
                height: 100% !important;
            }
            :host::ng-deep p-chart div canvas {
                height: 250px !important;
            }

            :host ::ng-deep p-chart {
                display: block;
                width: 100% !important;
                height: 100% !important;
            }

            :host ::ng-deep p-chart canvas {
                width: 100% !important;
                height: 100% !important;
            }
            ::ng-deep .p-chart .p-chart-doughnut .p-chart-doughnut-legend {
                // height: 200px !important;
            }
        `
    ],
    template: `
        <div class="card border h-full flex flex-col p-4">
            <div class="flex justify-between items-center mb-6 border-b border-gray-200">
                <div class="font-semibold text-xl text-gray-900 dark:text-white uppercase">{{'Dashboard.Customer'|translate}}</div>
            </div>
            <div class="flex flex-1 flex-col lg:flex-row gap-4 h-full">
                <div class="flex-1 flex flex-col border  p-4 rounded-2xl shadow-sm bg-white dark:bg-gray-800">
                    <!-- <span class="text-gray-400 dark:text-gray-300 mb-4 text-center"> {{'Dashboard.Activity'|translate}} </span> -->

                    <div class="flex-1 w-full">
                        <p-chart type="bar" [data]="data" [options]="options" class="w-full h-full rounded-lg shadow-sm"></p-chart>
                    </div>
                </div>
                <div class="flex-1 flex flex-col gap-4">
                    <div class=" p-[2.3rem] border rounded-2xl  flex items-center gap-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
                        <div class="flex-shrink-0 w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                            <svg
                                width="40px"
                                height="40px"
                                viewBox="0 0 91 91"
                                enable-background="new 0 0 91 91"
                                id="Layer_1"
                                version="1.1"
                                xml:space="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                fill="#000000"
                            >
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <g>
                                        <path
                                            d="M71.619,16.685c-10.5,0-19.045,8.545-19.045,19.051c0,10.504,8.545,19.051,19.045,19.051 c10.508,0,19.055-8.547,19.055-19.051C90.674,25.229,82.127,16.685,71.619,16.685z M79.365,38.407h-5.438v5.439 c0,1.385-1.123,2.506-2.506,2.506s-2.504-1.121-2.504-2.506v-5.439h-5.439c-1.383,0-2.506-1.121-2.506-2.506 c0-1.383,1.123-2.504,2.506-2.504h5.439v-5.436c0-1.383,1.121-2.504,2.504-2.504s2.506,1.121,2.506,2.504v5.436h5.438 c1.383,0,2.504,1.121,2.504,2.504C81.869,37.286,80.748,38.407,79.365,38.407z"
                                            fill="#6EC4A7"
                                        ></path>
                                        <g>
                                            <polygon fill="#6EC4A7" points="25.506,55.183 21.086,78.269 26.541,82.632 31.99,78.272 27.504,55.183 "></polygon>
                                            <path
                                                d="M43.961,47.731c-3.236,3.193-7.326,5.506-11.889,6.576l4.76,24.412c0.18,0.859-0.139,1.744-0.82,2.289 l-2.051,1.639c5.709-0.682,11.896-2.17,18.375-4.889V59.64C52.336,54.269,49.566,50.374,43.961,47.731z"
                                                fill="#647F94"
                                            ></path>
                                            <path
                                                d="M20.922,54.384c-4.67-1.041-8.855-3.381-12.152-6.635c-5.375,2.635-8.027,6.525-8.027,11.891v18.205 c2.584,1.201,9.234,3.908,18.488,4.896l-2.162-1.73c-0.682-0.547-1.002-1.428-0.826-2.283L20.922,54.384z"
                                                fill="#647F94"
                                            ></path>
                                            <path d="M26.35,50.341c11.309,0,20.506-9.262,20.506-20.648S37.658,9.044,26.35,9.044 c-11.299,0-20.492,9.262-20.492,20.648S15.051,50.341,26.35,50.341z" fill="#647F94"></path>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-500 dark:text-gray-300 font-medium text-sm">{{'Dashboard.CustomerActive'|translate}}</span>
                            <div class="font-bold text-2xl text-gray-900 dark:text-white">{{totalCustomer?.totalActiveCount}}</div>
                            <span class="text-gray-400 dark:text-gray-300 text-sm">({{ 'Common.Customer' | translate }})</span>
                        </div>
                    </div>
                    <div class=" p-[2.3rem] border rounded-2xl  flex items-center gap-4 shadow-sm hover:shadow-md transition-all bg-white dark:bg-gray-800">
                        <div class="flex-shrink-0 w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg fill="#5cc0ff" width="40px" height="40px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg" stroke="#5cc0ff">
                                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M696.208 156.026c206.72 0 374.882 168.161 374.882 374.881v107.11c0 113.428-51.734 214.003-131.637 282.874 58.053 6.962 115.892 15.745 173.195 27.741 162.056 34.168 279.768 188.726 279.768 367.598v205.757l-21.85 16.066c-117.391 86.223-356.78 225.786-675.108 225.786-16.923 0-33.953-.429-51.198-1.179-280.518-13.174-493.343-129.387-622.517-224.714L0 1521.879v-205.756c0-178.872 117.82-333.43 279.983-367.598 56.982-11.889 114.606-21.1 172.445-28.17-79.689-68.763-131.101-169.124-131.101-282.339V530.907c0-206.72 168.16-374.88 374.881-374.88Zm-88.9 321.327c-94.899 0-113.536 69.942-178.872 96.398v64.265c0 147.596 120.176 267.773 267.772 267.773s267.773-120.177 267.773-267.773V530.907c0-2.463-.643-4.82-.75-7.39-.636.578-1.271 1.158-1.905 1.738l-1.9 1.745-.948.874-1.895 1.75-1.893 1.751-1.894 1.751-.948.875-1.898 1.748c-27.24 25.027-56.053 48.713-110.216 48.713-116.749 0-116.749-107.11-232.426-107.11ZM1839.915 156 1920 236.085l-200.269 200.269L1920 636.623l-80.085 80.085-200.269-200.27-200.156 200.27-80.198-80.085 200.27-200.269-200.27-200.269L1439.49 156l200.156 200.269L1839.915 156Z"
                                        fill-rule="evenodd"
                                    ></path>
                                </g>
                            </svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-gray-500 dark:text-gray-300 font-medium text-sm">{{'Dashboard.CustomerStopped'|translate}}</span>
                            <div class="font-bold text-2xl text-gray-900 dark:text-white">{{totalCustomer?.totalInactiveCount}}</div>
                            <span class="text-gray-400 dark:text-gray-300 text-sm">({{ 'Common.Customer' | translate }})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class CustomerWidget {
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

    @Input() dataReponseUser: any;
    constructor(private cd: ChangeDetectorRef,
        private t: TranslationService

    ) { }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['dataReponseUser'] && this.dataReponseUser) {
            this.initChart();
        }
    }
    calculateCustomerTotals(data: {
        month: string;
        individualCount: number;
        businessCount: number;
        activeCount: number;
        inactiveCount: number;
    }[]): { totalActiveCount: number; totalInactiveCount: number } {
        const totals = data.reduce(
            (acc, curr) => {
                acc.totalActiveCount += curr.activeCount;
                acc.totalInactiveCount += curr.inactiveCount;
                return acc;
            },
            { totalActiveCount: 0, totalInactiveCount: 0 }
        );

        return totals;
    }
    totalCustomer: any
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
        if (isPlatformBrowser(this.platformId) && this.dataReponseUser) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color') || '#000';
            const labels = this.dataReponseUser.map((item: any) => {
                const monthNumber = parseInt(item.month.split('-')[1], 10);
                const lang = this.translationService.getLanguage?.() || this.translationService.getLanguage() || 'en';
                const date = new Date(2000, monthNumber - 1, 1);
                const monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(date);
                return monthName.charAt(0).toUpperCase() + monthName.slice(1);
            })
            const individualData = this.dataReponseUser.map((item: any) => item.individualCount);
            const businessData = this.dataReponseUser.map((item: any) => item.businessCount);
            this.totalCustomer = this.calculateCustomerTotals(this.dataReponseUser);
            this.data = {
                labels,
                datasets: [
                    {
                        label: this.translationService.translate('Dashboard.Personal'),

                        data: individualData,
                        backgroundColor: '#1B84FF',
                        borderRadius: 6
                    },
                    {
                        label: this.translationService.translate('Dashboard.Business'),
                        data: businessData,
                        backgroundColor: '#FF6F1E',
                        borderRadius: 6
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
                        ticks: { color: textColor },
                        grid: { color: '#f0f0f0' }
                    },
                    y: {
                        ticks: { color: textColor },
                        grid: { color: '#f0f0f0' }
                    }
                }
            };

            this.cd.markForCheck();
        }
    }
}
