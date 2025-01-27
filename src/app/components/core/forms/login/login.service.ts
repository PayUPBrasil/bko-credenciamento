import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../environments/environment.development";
import { Observable, switchMap } from "rxjs";
import { AuthService } from '../../../../services/Auth/auth.service';
import { SessionService } from '../../../../services/session/session.service';
@Injectable({
  providedIn: 'root',
})

export class LoginService {

  private url = environment.api.url
  private httpClient = inject(HttpClient)
  private authService = inject(AuthService)
  private sessionService = inject(SessionService)
  private token!: string;


  public loginUser(user: string, password: string): Observable<any> {

    const authBody = {
      login: environment.credentials.username,
      senha: environment.credentials.password
    };

    return this.httpClient.post<any>(`${this.url}/auth`, authBody).pipe(
      switchMap(authResponse => {
        this.authService.setAuthTimer(authResponse.token);
        const loginBody = {
          user: user,
          password: password,
        };

        const headers = new HttpHeaders({ Authorization: `Bearer ${authResponse.token}`, })

        return this.httpClient.post(`${this.url}/user/login`, loginBody, { headers })
      })
    );
  }



  //* Method used to get user data after login *//

  public me(token: string): Observable<any> {

    const authBody = {
      login: environment.credentials.username,
      senha: environment.credentials.password
    };

    return this.httpClient.post<any>(`${this.url}/auth`, authBody).pipe(
      switchMap(authResponse => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${authResponse.token}`, })
        return this.httpClient.get(`${this.url}/user/me/${token}`, { headers });
      })
    );

  }
}
