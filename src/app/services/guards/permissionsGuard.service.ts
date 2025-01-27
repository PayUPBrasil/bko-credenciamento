import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateChildFn, Router, RouterStateSnapshot } from "@angular/router";
import { ListRolesByIdService } from "../../components/core/pages/dashboard-pages/admin/create-permissions/listRoleById.service";
import { jwtDecode } from "jwt-decode";
import { SessionService } from "../session/session.service";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { CheckPermission } from "./checkPermission.service";

@Injectable({
  providedIn: 'root'
})
class PermissionsService {
  private sessionService = inject(SessionService);
  private router = inject(Router);
  protected listRolesByIdService = inject(ListRolesByIdService);
  protected userJwToken = '';

  public canActivate(activated: ActivatedRouteSnapshot): Observable<boolean> {
    console.log("Em canActivate de permission service")
    if (activated.data['roles'] && activated.data['roles'].length) {
      const rolesRota = activated.data['roles'] || [];

      return this.sessionService.getSessao().pipe(
        map(res => {
          this.userJwToken = res?.id || '';
          const tokenDecoded: any = jwtDecode(this.userJwToken);
          const permissionsList = tokenDecoded.permissions;

          if (!CheckPermission.havePermission(rolesRota, permissionsList)) {
            console.log(rolesRota, permissionsList, "rolesRota, permissionsList")
            this.router.navigate(['/dashboard/home']);
            return false;
          }
          return true;
        })
      );
    }

    return of(true);
  }
}

export const PermissionsGuard: CanActivateChildFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  console.log("Em PermissionsGuard")
  return inject(PermissionsService).canActivate(next);
};
