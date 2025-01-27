import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TokenService } from './services/interceptors/token.service';
import { LoaderInterceptor } from './services/interceptors/loader.interceptor';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { withInterceptors, provideHttpClient } from '@angular/common/http';
import { provideNgxMask } from 'ngx-mask';
import { HeaderInterceptorService } from './services/interceptors/header.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), provideClientHydration(), provideHttpClient(withInterceptors([TokenService, LoaderInterceptor, HeaderInterceptorService])),
    provideAnimationsAsync(),
    provideNgxMask()
  ]
};
