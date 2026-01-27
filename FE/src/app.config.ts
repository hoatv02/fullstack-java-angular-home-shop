import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig, enableProdMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { lastValueFrom } from 'rxjs';
import { appRoutes } from './app.routes';
import { AuthService } from './app/layout/service/auth.service';
import { LoadingService } from './app/layout/service/loading.service';
import { JwtInterceptor } from './app/layout/service/token.interceptor';
import { ConfigService } from './app/pages/service/config.service';
import { environment } from './environments/environment';
export function appInitializer(configService: ConfigService, authorizeService: AuthService) {
    return async () => {
        const config = await lastValueFrom(configService.getConfig());
        if (!config) return;
        if (config.production) enableProdMode();
        environment.REQUEST_TIMEOUT = config.REQUEST_TIMEOUT;
        environment.APP_API_URL = config.APP_API_URL;
        environment.production = config.production;
        environment.ORGANIZATION_CODE = config.ORGANIZATION_CODE;
        environment.APPLICATION_CODE = config.APPLICATION_CODE;
        try {
            const isAuth = authorizeService.isAuthenticated();
            console.log('App initialized. Authenticated:', isAuth);
        } catch (err) {
            console.warn('Auth init failed', err);
        }
    };
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch(), withInterceptors([JwtInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        LoadingService,
        MessageService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            multi: true,
            deps: [ConfigService, AuthService]
        },
    ]
};
