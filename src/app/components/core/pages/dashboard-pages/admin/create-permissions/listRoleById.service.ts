import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap, throwError } from "rxjs";
import { environment } from '../../../../../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { SessionService } from '../../../../../../services/session/session.service';
@Injectable({
  providedIn: 'root',
})

export class ListRolesByIdService {

  private url = environment.api.url

  private http = inject(HttpClient)
  private sessionService = inject(SessionService)
  private token!: string;

  public getRoleById(id: string): Observable<any> {
    return this.http.get(`${this.url}/role/${id}`);
  }


  public deleteRoleByName(name: string): Observable<any> {
    const roleName = name;
    return this.http.delete(`${this.url}/role/${roleName}`);

  }

  public removeUserFromRole(userId: string): Observable<any> {
    console.log(userId, 'userId')

    return this.http.put(`${this.url}/role/${userId}`, {})
    // return this.http.delete(`${this.url}/user/role/${userId}`
  }

}
