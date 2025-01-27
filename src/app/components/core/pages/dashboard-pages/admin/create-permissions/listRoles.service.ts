import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Observable, switchMap, throwError } from "rxjs";
import { environment } from '../../../../../../../environments/environment.development';
import { jwtDecode } from 'jwt-decode';
import { SessionService } from '../../../../../../services/session/session.service';

@Injectable({
  providedIn: 'root',
})

export class ListRolesService {
  private url = environment.api.url
  private http = inject(HttpClient)


  public getRoles(): Observable<any> {
    return this.http.get(`${this.url}/role`);
  }


}
