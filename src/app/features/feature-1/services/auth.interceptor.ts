// src/app/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service'; // Adjust the path as needed
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const user = authService.getCurrentUser();
  const authToken = user?.token;

  const isApiUrl = req.url.startsWith(environment.apiUrl);

  if (authToken && isApiUrl) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  return next(req);
};
