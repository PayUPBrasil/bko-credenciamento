import { inject, Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { Observable } from "rxjs";
import { Session } from "../../types/session.interface";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class UserPermissionsService {
  session$: Observable<Session | null>;
  decodedToken!: any;
  private sessionService = inject(SessionService)


  constructor() {
    this.session$ = this.sessionService.getSessao()
    this.session$.subscribe({
      next: (session) => {
        if (session?.id) {
          this.decodedToken = jwtDecode(session?.id)
        }

      },
      error: (error) => console.error(error),
    })
  }


  public getPermissions() {
    if (this.decodedToken) {
      return this.decodedToken.permissions
    }
    return []
  }

}
