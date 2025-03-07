import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { newUser, User } from './types/user.interface';
import { environment } from '../../../../../../../environments/environment.development';
import { Observable, switchMap, tap, throwError } from "rxjs";
import { jwtDecode } from 'jwt-decode';
import { SessionService } from '../../../../../../services/session/session.service';

@Injectable({
  providedIn: 'root',
})


export class UserService {

  private token!: string;
  private url = environment.api.url
  private httpClient = inject(HttpClient)
  private sessionService = inject(SessionService)

  public listAllActiveUsers(page:number): Observable<any> {
    const authBody = {
      login: environment.credentials.username,
      senha: environment.credentials.password
    };

    return this.httpClient.post<any>(`${this.url}/auth`, authBody).pipe(

      switchMap((authResponse) => {

        let decodedToken: any;
        let tokenSession = this.sessionService.getSessao().subscribe((res) => { return this.token = res?.id || ' ' })

        try {
          decodedToken = jwtDecode(this.token);
        } catch (error) {
          return throwError(() => new Error('Erro ao decodificar o token'))
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${this.token}`,
          'X-User-Role': decodedToken.sub
        });

        return this.httpClient.get(`${this.url}/user/${page}`, { headers });
      })

    )
  }


  public getUserById(userId: string): Observable<any> {
    return this.httpClient.get(`${this.url}/users/${userId}`)
  }

  public assingRoleToUser(userId: string, roleName: string): Observable<any> {
    const body = {
      userId: userId,
      roleName: roleName
    }
    return this.httpClient.post(`${this.url}/assignRoleToUser`, body)
  }

  public createNewUser(name: string, email: string, seller: boolean): Observable<newUser> {

    const body = {
      name: name,
      user: email,
      seller: seller
    }

    console.log(body, 'verificando o body da req')
    return this.httpClient.post<newUser>(`${this.url}/user/newAccount`, body)
  }

  public deleteUser(userId: string): Observable<any> {
    return this.httpClient.delete<any>(`${this.url}/user/${userId}`)
  }

  public reactiveUser(userId: string): Observable<any> {
    return this.httpClient.put(`${this.url}/user/${userId}`, {})
  }


  public getSellerId(userId:string) : Observable<any> {
    console.log(userId, 'userId')
    return this.httpClient.get(`${this.url}/user/seller/${userId}`)
  }

  public resetPassword(userId:string) : Observable<any> {
    return this.httpClient.patch(`${this.url}/user/reset-password/${userId}`, {})
  }

  public getUserNameById(userID:string) : Observable<any>{
    return this.getUserById(userID).pipe(

    )
  }
}
