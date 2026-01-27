import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, concatMap, finalize, retryWhen, tap, timeout } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { ApiOptions, BaseResponse } from '../../utils/res/app.response';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { TranslationService } from '../../../assets/i18n/translation.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ResponseHandlerService {
    private notification = inject(NotificationService);
    private router = inject(Router);
    private loadingService = inject(LoadingService);
    private translationService = inject(TranslationService);
    public handleApiCall<T>(observable: Observable<any>, options: ApiOptions<T> = {}): Observable<any> {
        const defaultOptions: ApiOptions<T> = {
            successMessage: '',
            errorMessage: '',
            showSuccessMessage: true,
            showErrorMessage: true,
            showSpinner: true,
            spinnerId: 'global',

            retry: {
                count: 0,
                delay: 1000,
                maxRetries: 0,
                retryCondition: (error: unknown) => {
                    return error instanceof HttpErrorResponse && error.status !== 401 && error.status !== 403 && (error.status === 0 || error.status >= 500);
                }
            },
            timeout: {
                time: environment.REQUEST_TIMEOUT,
                errorMessage: this.translationService.translate('Common.RequestTimeout')
            }
        };
        const mergedOptions = { ...defaultOptions, ...options };
        const { successMessage, errorMessage, showSuccessMessage, showErrorMessage, showSpinner, spinnerId, retry, timeout: timeoutConfig } = mergedOptions;
        if (showSpinner) {
            this.loadingService.show();
        }

        return observable.pipe(
            timeout({
                each: timeoutConfig?.time ?? 100000,
                with: () => throwError(() => new Error(timeoutConfig?.errorMessage ?? this.translationService.translate('Common.RequestTimeout')))
            }),
            // Handle success response
            tap((response: any) => {
                if (mergedOptions.isBlob) {
                    if (mergedOptions.onSuccess) {
                        mergedOptions.onSuccess(response);
                    }
                } else {
                    // JSON dạng BaseResponse<T>
                    if (response.code === HttpStatusCode.Ok) {
                        if (showSuccessMessage) {
                            this.notification.success(this.translationService.translate('Common.Notification'), successMessage ?? this.translationService.translate('Common.Successfully'));
                        }
                        if (mergedOptions.onSuccess) {
                            mergedOptions.onSuccess(response.data);
                        }
                    } else {
                        throw new Error(response.message || errorMessage);
                    }
                }
            }),

            // Handle retry logic
            retryWhen((errors) =>
                errors.pipe(
                    concatMap((error, index) => {
                        const retryAttempt = index + 1;
                        // Check if we should retry
                        let shouldRetry = false;
                        if (retry) {
                            if (retry.retryCondition) {
                                shouldRetry = retry.retryCondition(error) && retryAttempt <= (retry.maxRetries ?? 3);
                            }
                        }

                        if (shouldRetry) {
                            // Show retry notification
                            this.notification.error(this.translationService.translate('Common.Notification'), `${this.translationService.translate('Common.Attempt')} ${retryAttempt} ${this.translationService.translate('Common.Of')} ${retry?.maxRetries ?? 3}`);
                            // Delay between retries
                            return timer((retry?.delay ?? 2000) * retryAttempt);
                        }
                        // If we shouldn't retry, throw the error
                        return throwError(() => error);
                    })
                )
            ),

            // Handle errors
            catchError((error: unknown) => {
                let errorMsg = errorMessage ?? this.translationService.translate('Common.AnErrorOccurred');

                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case 401:
                            localStorage.clear();
                            this.router.navigate(['/auth/login']);
                            errorMsg = this.translationService.translate('Common.SessionEpired');
                            break;
                        case 403:
                            this.router.navigate(['/forbidden']);
                            errorMsg = this.translationService.translate('Common.DoNotPermission');
                            break;
                        case 409:
                            errorMsg = this.translationService.translate('Common.DataAlreadyExit');
                            break;
                        case 400:
                            errorMsg = error.error?.message || this.translationService.translate('Common.InvalidRequest');
                            break;
                        default:
                            errorMsg = error.error?.message || error.message || errorMessage;
                            break;
                    }
                } else if (error instanceof Error) {
                    errorMsg = error.message;
                }

                if (showErrorMessage) {
                    const severity = this.getSeverityByStatus(error);
                    this.notification[severity](this.translationService.translate('Common.Notification'), errorMsg);
                }

                // Nếu có callback riêng
                if (mergedOptions.onError) {
                    mergedOptions.onError(error);
                }

                return throwError(() => error);
            }),

            // Cleanup
            finalize(() => {
                if (showSpinner) {
                    this.loadingService.hide();
                }
            })
        );
    }
    private getSeverityByStatus(error: unknown): 'success' | 'info' | 'warn' | 'error' {
        if (error instanceof HttpErrorResponse) {
            switch (error.status) {
                case 400:
                    return 'warn'; // Yêu cầu sai
                case 401:
                    return 'info'; // Cần đăng nhập lại
                case 403:
                    return 'info'; // Không đủ quyền
                case 409:
                    return 'warn'; // Trùng dữ liệu
                case 500:
                    return 'error'; // Lỗi server
                default:
                    return 'error';
            }
        }

        return 'error'; // fallback
    }
}
