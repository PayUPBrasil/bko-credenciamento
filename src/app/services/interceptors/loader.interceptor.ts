import { HttpInterceptorFn } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { LoaderService } from "../utils/loader.service";
import { finalize } from "rxjs";

Injectable()
export const LoaderInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  loaderService.show();

  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
