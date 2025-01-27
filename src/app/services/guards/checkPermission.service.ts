import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class CheckPermission {
  public static havePermission(roles: string[], userPermissions: string[]): boolean {
    for (let role of roles) {
      console.log(role, "role")
      console.log(userPermissions.includes(role))
      if (userPermissions.includes(role)) {
        return true
      }
    }
    return false
  }

  public hasAnyPermission(permissions: string[], userPermissions: string[]): boolean {
    return permissions.some(permission => userPermissions.includes(permission));
  }

  public hasAllPermissions(permissions: string[], userPermissions: string[]): boolean {
    return permissions.every(permission => userPermissions.includes(permission));
  }

}
