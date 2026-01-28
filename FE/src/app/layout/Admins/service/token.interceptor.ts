import { HttpErrorResponse, HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { catchError, finalize, Observable, throwError } from "rxjs";
import { inject } from "@angular/core";
import { LoadingService } from "./loading.service";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { ConfigService } from "../../../pages/Admin/service/config.service";
import { environment } from "../../../../environments/environment";

export function JwtInterceptor(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {

    const loadingService = inject(LoadingService);
    const authService = inject(AuthService);
    const router = inject(Router);

    const apiUrl = ConfigService.config?.APP_API_URL || environment.APP_API_URL;
    const orgCode = ConfigService.config?.ORGANIZATION_CODE || 'DEFAULT_ORG';
    const appCode = ConfigService.config?.APPLICATION_CODE || 'DEFAULT_APP';

    let apiReq = req;
    if (req.url.startsWith('/')) {
        apiReq = req.clone({ url: `${apiUrl}${req.url}` });
    }

    const finalReq = apiReq.clone({
        setHeaders: {
            organizationCode: orgCode,
            applicationCode: appCode,
        },
        withCredentials: true
    });

    return next(finalReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                localStorage.clear();
                authService.isLoggedIn$.next(false);
                authService.changePasswordRequiredSubject.next(false);
                router.navigate(['/auth/login']);
            }
            return throwError(() => error);
        }),
        finalize(() => loadingService.hide())
    );
}
