import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";
@Injectable({
  providedIn: 'root'
})

export class ChangeClientStatusService {
  private url = environment.api.url;
  private _http = inject(HttpClient)


  public changeAccountStatus(crId: number, status: string): Observable<any> {
    const body = {
      registerStatus: status
    }
    return this._http.put<any>(`${this.url}/clients/${crId}`, body)
  }
}
