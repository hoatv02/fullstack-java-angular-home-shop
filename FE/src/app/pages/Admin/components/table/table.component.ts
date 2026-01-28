import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { TranslationService } from '../../../../../assets/i18n/translation.service';
import { LayoutService } from '../../../../layout/Admins/service/layout.service';
import { SHARED_MODULES } from '../../../../shared/shared.module';

export interface IConfig {
    toolbar?: {
        new?: boolean;
        delete?: boolean;
        export?: boolean;
        sync?: boolean;
        reload?: boolean;
    };
    actions?: {
        view?: boolean;
        edit?: boolean;
        sync?: boolean;
        delete?: boolean;
        export?: boolean;
        lock?: boolean;
        isShowAction?: boolean;
        reset?: boolean
    };
    customerButton?: {
        isShow?: boolean;
        label?: string;
    };
}
type ActionKey =
    | 'view'
    | 'edit'
    | 'sync'
    | 'delete'
    | 'export'
    | 'lock'
    | 'reset';
export interface IPaginationConfig {
    enabled?: boolean;
    rows?: number;
    page?: number;
    rowsPerPageOptions?: number[];
}

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: true,
    imports: [SHARED_MODULES],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
    @Input() data: any[] = [];
    @Input() columns: any[] = [];
    @Input() selection: any[] = [];
    @Input() selectFilterData: any[] = [];
    @Input() selectFilter1Data: any[] = [];
    @Input() selectFilter2Data: any[] = [];
    @Input() selectFilter3Data: any[] = [];
    @Input() selectFilterValue: any = null;
    @Input() selectFilter1Value: any = null;
    @Input() selectFilter2Value: any = null;
    @Input() selectFilter3Value: any = null;
    @Input() globalFilterFields: string[] = [];
    @Input() exportable = true;
    @Input() exportdata = true;
    @Input() isShowFromToDate = false;
    @Input() isShowInputSearch = true;
    @Input() isShowPagination = true;
    @Input() title_list = '';
    @Input() placeholderTextSearch = 'Table.Search';
    @Input() first = 0;
    @Input() selectFilter: boolean = false;
    @Input() selectFilter1: boolean = false;
    @Input() selectFilter2: boolean = false;
    @Input() selectFilter3: boolean = false;
    @Input() showClear: boolean = true;
    @Input() showClear1: boolean = true;
    @Input() showClear2: boolean = true;
    @Input() showClear3: boolean = true;
    @Input()
    actionCondition?: Partial<Record<ActionKey, (row: any) => boolean>>;
    @Input() selectFilterSearch: boolean = false;
    @Input() selectFilterSearch1: boolean = false;
    @Input() selectFilterSearch2: boolean = false;
    @Input() selectFilterSearch3: boolean = false;
    @Input() placeholderSelectFilter = 'Table.PlaceholderDropdownDefault';
    @Input() placeholderSelectFilter1 = 'Table.PlaceholderDropdownDefault';
    @Input() placeholderSelectFilter2 = 'Table.PlaceholderDropdownDefault';
    @Input() placeholderSelectFilter3 = 'Table.PlaceholderDropdownDefault';
    @Input() totalRecords: number = 0;
    @Input() unlimitedDateRange: boolean = false;
    // @Input() showClear: boolean = false;
    @Input() showButtonBar: boolean = false;
    @Input() NoDataTable = 'Table.NoData';
    @Input() config: IConfig = {
        toolbar: { new: true, delete: true, export: true, sync: true },
        actions: { lock: false, view: false, edit: false, sync: false, delete: false, export: true, isShowAction: true, reset: false },
        customerButton: {
            isShow: false,
            label: ''
        }
    };
    @Input() showSelectionColumn: boolean = false;
    @Output() selectionChange = new EventEmitter<any[]>();

    @Input() paginationConfig: IPaginationConfig = {
        enabled: true,
        rows: 10,
        rowsPerPageOptions: []
    };
    fromDate: Date | null = null;
    toDate: Date | null = null;
    lastEnterValue: string = ''
    @Input() tagConfig: Record<string, Record<string, string>> = {};
    defaultSeverities = ['success', 'info', 'warning', 'danger'];
    @Output() fromToDateChange = new EventEmitter<any>();
    @Output() selectFilterChange = new EventEmitter<any>();
    @Output() selectFilter1Change = new EventEmitter<any>();
    @Output() selectFilter2Change = new EventEmitter<any>();
    @Output() selectFilter3Change = new EventEmitter<any>();
    @Output() onView = new EventEmitter<any>();
    @Output() onSync = new EventEmitter<any>();
    @Output() onReset = new EventEmitter<any>();
    @Output() onCustomerButton = new EventEmitter<any>();
    @Output() onEdit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    @Output() onReload = new EventEmitter<any>();
    @Output() onLock = new EventEmitter<any>();
    @Output() onDeleteSelected = new EventEmitter<void>();
    @Output() onExportCSV = new EventEmitter<void>();
    @Output() onLazyLoad = new EventEmitter<TableLazyLoadEvent>();
    @Output() onSearch = new EventEmitter<string>();

    @ViewChild('dt') dt!: Table;
    @Output() onSwitchChange = new EventEmitter<{ row: any; field: string; value: boolean }>();
    minDate!: Date | any;
    maxDate!: Date | any;
    constructor(
        private cdf: ChangeDetectorRef,
        public layout: LayoutService,
        public translate: TranslationService
    ) { }

    dateRange: any

    ngOnInit() {
        const today = new Date();
        this.minDate = new Date(today.getFullYear(), today.getMonth(), 1);
        this.maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        this.config = {
            ...this.config,
            actions: {
                ...{
                    lock: false, view: false, edit: false, sync: false,
                    delete: false, export: false, isShowAction: true
                },
                ...this.config.actions
            },
            toolbar: { new: false, delete: false, export: false, sync: false, ...this.config.toolbar },
            customerButton: { isShow: false, label: '', ...this.config.customerButton }
        };
        this.translate.lang$.subscribe(() => {
            this.cdf.detectChanges()
        })
    }
    private initialized = false;
    ngAfterViewInit() {
        if (this.unlimitedDateRange) {
            this.fromDate = null;
            this.toDate = null;
            this.dateRange = null;
            this.fromToDateChange.emit([]);
            this.initialized = true;
            return;
        }
        if (this.isShowFromToDate) {
            this.setDefaultDateRange();
            setTimeout(() => {
                this.initialized = true;
                if (this.dateRange?.[0] && this.dateRange?.[1]) {
                    this.fromToDateChange.emit(this.dateRange);
                }
            }, 0);
        } else {
            this.initialized = true;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
    }
    handleBlur(event: FocusEvent) {
        const value = (event.target as HTMLInputElement).value.trim();
        if (value === this.lastEnterValue) {
            return;
        }
        this.lastEnterValue = value;
        this.onSearch.emit(value);
    }

    canShowAction(action: ActionKey, row: any): boolean {
        if (!this.config.actions?.[action]) return false;
        if (!this.actionCondition) return true;
        if (!this.actionCondition[action]) return true;
        return this.actionCondition[action]!(row);
    }
    getLockIcon(row: any): string {
        return row.status === 'Common.StatusList.Lock'
            ? 'pi pi-lock'
            : 'pi pi-lock-open';
    }

    getLockTooltip(row: any): string {
        return row.status === 'Common.StatusList.Lock'
            ? 'Table.unLock'
            : 'Table.Lock';
    }

    getAlignmentClass(styleClass: any): string {
        if (typeof styleClass !== 'string') return '';
        const classes = [];
        if (styleClass.includes('text-center') || styleClass.includes('justify-center')) classes.push('justify-center');
        if (styleClass.includes('text-right') || styleClass.includes('justify-end')) classes.push('justify-end');
        return classes.join(' ');
    }

    getTranslatedValue(value: any) {
        if (value === null || value === undefined || value === '') return '';
        if (this.isTranslatable(value)) {
            return this.translate.translate(value);
        }
        return value;
    }
    setDefaultDateRange() {
        if (this.unlimitedDateRange) {
            this.dateRange = null;
            this.fromDate = null;
            this.toDate = null;
            return;
        }

        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 6);

        this.dateRange = [sevenDaysAgo, today];
        this.fromDate = sevenDaysAgo;
        this.toDate = today;
    }
    isTranslatable(value: any): boolean {
        return typeof value === 'string' && value.includes('.');
    }

    handleDateRangeChange(dates: any) {
        if (Array.isArray(dates) && dates[0]) {
            const start = new Date(dates[0]);
            if (this.unlimitedDateRange) {
                this.fromDate = start;
                this.toDate = dates[1] ? new Date(dates[1]) : null;
                this.minDate = null;
                this.maxDate = null;
                if (this.fromDate && this.toDate) {
                    this.fromToDateChange.emit([this.fromDate, this.toDate]);
                }
                return;
            }
            if (!dates[1]) {
                if (this.dateRange && this.dateRange[1]) {
                    this.dateRange = [start, null];
                    this.toDate = null;
                }
                const limitedEnd = new Date(start);
                limitedEnd.setDate(start.getDate() + 31);
                this.minDate = start;
                this.maxDate = limitedEnd;
                this.fromDate = start;
                return;
            }

            const end = new Date(dates[1]);
            const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

            if (diffDays > 31) {
                const limitedEnd = new Date(start);
                limitedEnd.setDate(start.getDate() + 31);
                this.dateRange = [start, limitedEnd];
                this.fromDate = start;
                this.toDate = limitedEnd;
                this.fromToDateChange.emit(this.dateRange);
                return;
            }

            this.fromDate = start;
            this.toDate = end;
            this.fromToDateChange.emit([start, end]);

        } else {
            this.dateRange = null;
            this.fromDate = null;
            this.toDate = null;

            this.minDate = null;
            this.maxDate = null;

            setTimeout(() => {
                this.minDate = undefined;
                this.maxDate = undefined;
            });

            this.fromToDateChange.emit([]);
        }
    }


    isDefaultSeverity(value: string | undefined): boolean {
        return this.defaultSeverities.includes(value || '');
    }
    getValueByField(row: any, field: string): any {
        try {
            return new Function('row', `with(row) { return ${field}; }`)(row);
        } catch (e) {
            console.warn('Invalid expression:', field, e);
            return '';
        }
    }

    getTagClass(field: string, value: string): string {
        return this.tagConfig[field]?.[value] || '';
    }
    handleLazyLoad(event: TableLazyLoadEvent): void {
        if (this.isShowFromToDate && !this.initialized) {
            return;
        }
        const lazyEvent: TableLazyLoadEvent = {
            ...event,
            rows: event.rows ?? null,
            first: Math.floor((event.first ?? 0) / (event.rows ?? 1))
        };
        this.onLazyLoad.emit(lazyEvent);
    }
    onSelectionChange(event: any[]) {
        this.selection = event;
        this.selectionChange.emit(event);
    }
    handleSearch(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value.trim();

        if (value === this.lastEnterValue) {
            return;
        }

        target.value = value;
        this.lastEnterValue = value;

        this.onSearch.emit(value); // ✅ emit VALUE, không emit event
    }

    getSeverity(field: string, value: string): any {
        const cleanedValue = value;
        return this.tagConfig?.[field]?.[cleanedValue] ?? 'info';
    }
    handleSwitchChange(row: any, field: string, value: boolean) {
        this.onSwitchChange.emit({ row, field, value });
    }

    onSelectFilterChange(event: any) {
        this.selectFilterChange.emit(event.value);
    }

    onSelectFilter1Change(event: any) {
        this.selectFilter1Change.emit(event.value);
    }
    onSelectFilter2Change(event: any) {
        this.selectFilter2Change.emit(event.value);
    }
    onSelectFilter3Change(event: any) {
        this.selectFilter3Change.emit(event.value);
    }
    get displayDateRange(): string {
        if (!this.dateRange || this.dateRange.length === 0) {
            return '';
        } else if (this.dateRange.length === 1) {
            return `${this.formatDate(this.dateRange[0])} - To date`;
        } else {
            return `${this.formatDate(this.dateRange[0])} - ${this.formatDate(this.dateRange[1])}`;
        }
    }

    formatDate(date: Date): string {
        return date ? new Intl.DateTimeFormat('en-GB').format(date) : '';
    }

    getRoute(col: any, row: any): any[] | string {
        if (typeof col.routerLink === 'function') {
            return col.routerLink(row);
        }
        return col.routerLink || '';
    }

    getQueryParams(col: any, row: any): any {
        if (typeof col.queryParams === 'function') {
            return col.queryParams(row);
        }
        return col.queryParams || {};
    }
}
