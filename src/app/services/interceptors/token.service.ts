import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const TokenService: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // console.log(error, "Mostrando o erro")

      switch (error.status) {
        case 401:
          router.navigate(['/login']);
          break;

        case 0:
          // router.navigate(['/login']);
          console.log("Ocorreu um erro inesperado")
          break;

        case 'Erro ao decodificar o token':
          router.navigate(['/login']);
          break;

      }

      switch (error) {
        case 'Erro ao decodificar o token':
          router.navigate(['/login']);
          break;
      }


      return throwError(() => error);
    })
  );
};
