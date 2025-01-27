import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AdiqRequestsService {

private _http = inject(HttpClient)
private url = environment.api.url


public getAllProposals(page:number, searchInput:string) : Observable<any> {
  console.log(page, searchInput, 'verificando o proposal'  );
  const params =  new HttpParams()
  .set('page', page)
  .set('searchInput', searchInput)
  return this._http.get(`${this.url}/proposal/`, { params });
}
}
