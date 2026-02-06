import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, finalize, map } from 'rxjs';
import { ResponseHandlerService } from './responseHandler.service';
import { HttpClient } from '@angular/common/http';
import { authenRouter, operatorRouter } from '../../../utils/consts/router';
import { environment } from '../../../../environments/environment';
import { LOCAL_STORAGE_AUTH_KEY } from '../../../utils/enums/const';
import { TranslationService } from '../../../../assets/i18n/translation.service';

import { getCookie, parseJwt } from '../../../utils/utils';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private router = inject(Router);
    private responseHandler = inject(ResponseHandlerService);
    private http = inject(HttpClient);
    private translationService = inject(TranslationService);
    isLoggedIn$ = new BehaviorSubject<boolean>(false);
    public changePasswordRequiredSubject = new BehaviorSubject<boolean>(false);
    changePasswordRequired$ = this.changePasswordRequiredSubject.asObservable();
    apiUrl = environment.APP_API_URL;

    isAuthenticated(): boolean {
        const dataAuth = this.getDataAuthLocalStorage();
        return !!dataAuth || !!getCookie('ACCESS_TOKEN');
    }

    isAdmin(): boolean {
        const dataAuth = this.getDataAuthLocalStorage();
        return dataAuth?.role === 'ADMIN';
    }

    getToken(): string | null {
        const token = getCookie('ACCESS_TOKEN');
        if (token) return token;
        const dataAuth = this.getDataAuthLocalStorage();
        return dataAuth?.accessToken || null;
    }

    getUserInfo(): any | null {
        return this.getDataAuthLocalStorage();
    }

    setChangePasswordRequired(value: boolean) {
        this.changePasswordRequiredSubject.next(value);
    }

    setLocalStorage(data: any): void {
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(data));
    }
    deCodeAccessToken() {
        return this.getUserInfo();
    }

    getDataAuthLocalStorage(): any | null {
        const rawData = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
        try {
            return rawData ? JSON.parse(rawData) : null;
        } catch (e) {
            return null;
        }
    }
    removeDataAuthLocalStorage(): void {
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }

    logout(): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(operatorRouter.logout, {}),
            {
                showSuccessMessage: false,
                showErrorMessage: false,
            }
        ).pipe(
            finalize(() => {
                localStorage.clear();
                this.isLoggedIn$.next(false);
                this.changePasswordRequiredSubject.next(false);
                this.router.navigate(['/auth/login']);
            })
        );
    }
    login(body: { username: string; password: string; type?: number }): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(authenRouter.loginAdmin, body),
            {
                showSuccessMessage: false,
                showErrorMessage: true,
                successMessage: this.translationService.translate('AUTH.SEND_OTP.SUCCESS'),
                errorMessage: this.translationService.translate('AUTH.SEND_OTP.FAIL')
            }
        ).pipe(
            map(response => {
                if (response?.data?.token) {
                    const decoded = parseJwt(response.data.token);
                    if (decoded) {
                        const authData = {
                            token: response.data.token,
                            username: decoded.username || decoded.sub, // Fallback to subject if username claim missing 
                            role: decoded.role,
                            userId: decoded.userId
                        };
                        this.setLocalStorage(authData);
                    }
                }
                return response;
            })
        );
    }

    loginClient(body: { username: string; password: string }): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, body).pipe(
            map(response => {
                if (response?.data?.token) {
                    const decoded = parseJwt(response.data.token);
                    if (decoded) {
                        const authData = {
                            token: response.data.token,
                            username: decoded.username || decoded.sub,
                            role: decoded.role,
                            userId: decoded.userId
                        };
                        this.setLocalStorage(authData);
                    }
                }
                return response;
            })
        );
    }

    register(body: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/auth/register`, body);
    }

    verifyOtp(body: { userName: string; otp?: string }): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(authenRouter.validateOtpLogin, body),
            {
                showSuccessMessage: true,
                showErrorMessage: true,
                successMessage: this.translationService.translate('AUTH.SEND_OTP.SUCCESS'),
                errorMessage: this.translationService.translate('AUTH.SEND_OTP.FAIL')
            }
        );
    }
    getInfoDecodeToken(): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.get<any>(authenRouter.decodeToken),
            {
                showSuccessMessage: false,
                showErrorMessage: false,
            }
        );
    }

    changePassword(body: { oldPassword: string; newPassword: string }): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(authenRouter.changepassword, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('AUTH.CHANGE_PASSWORD.SUCCESS'),
                errorMessage: this.translationService.translate('AUTH.CHANGE_PASSWORD.FAIL')
            }
        );
    }
    forgotPassword(body: any): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(authenRouter.forgotPassword, body),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('Auth.ForgotPassword.Success'),
                errorMessage: this.translationService.translate('Auth.ForgotPassword.Error')
            }
        );
    }

    updatePasswords(id: string, body: any): Observable<any> {
        return this.responseHandler.handleApiCall(
            this.http.post<any>(authenRouter.updatePasswords + `${id}`, {
                password: body
            }),
            {
                showSuccessMessage: true,
                successMessage: this.translationService.translate('Auth.UpdatePassword.Success'),
                errorMessage: this.translationService.translate('Auth.UpdatePassword.Error')
            }
        );
    }

}
