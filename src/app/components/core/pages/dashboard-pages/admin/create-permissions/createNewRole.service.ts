import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class CreateRolesService {

  private url = environment.api.url
  private http = inject(HttpClient)


  public createNewRole(name: string, permissionNames: Array<any>): Observable<any> {
    const body = {
      name: name,
      permissionNames: permissionNames
    }

    return this.http.post(`${this.url}/role`, body);
  }
}
