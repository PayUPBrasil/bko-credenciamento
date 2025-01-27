import { inject, Injectable } from "@angular/core"
import { ActivatedRouteSnapshot, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from "@angular/router"
import { SessionService } from "../session/session.service"

@Injectable({
  providedIn: "root",
})

class PermissionsService {

  private router = inject(Router)
  private sessionService = inject(SessionService)
  protected tokenExists!: boolean

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    this.tokenExists = this.sessionService.estaLogado()
    if (this.tokenExists) {
      return true
    }
    this.router.navigate(['/login'])
    return false;
  }
}

export const AuthGuard: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  return inject(PermissionsService).canActivate(next, state);
}
