import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    static config: any;
    private configUrl: string;

    constructor(
        private http: HttpClient,
        @Inject(DOCUMENT) private document: Document
    ) {
        const baseHref = this.document.getElementsByTagName('base')[0]?.href || '/';
        this.configUrl = baseHref + 'config/system.hcf?v=' + Date.now();
    }

    getConfig(): Observable<any> {
        return this.http.get(this.configUrl, { responseType: 'text' }).pipe(
            map(res => {
                const parsed = JSON.parse(res as string);
                ConfigService.config = parsed;
                return parsed;
            }),
            catchError(err => {
                console.error('Cannot load config', err);
                return of(null); // Trả về Observable an toàn khi lỗi
            })
        );
    }

    saveConfig(config: any): Observable<any> {
        return this.http.put(this.configUrl, config);
    }
}
