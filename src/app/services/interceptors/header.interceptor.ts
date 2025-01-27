import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { SessionService } from "../session/session.service";


export const HeaderInterceptorService: HttpInterceptorFn = (req, next) => {

  const sessionService = inject(SessionService)
  let tokenId;

  const token = sessionService.getSessao().subscribe(
    (res) => {
      tokenId = res?.id;
    }
  )

  const loginUrl = 'login'
  if (req.url.includes(loginUrl)) {
    return next(req)
  }

  const modifiedReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${tokenId}`
    }
  })

  return next(modifiedReq);
}
