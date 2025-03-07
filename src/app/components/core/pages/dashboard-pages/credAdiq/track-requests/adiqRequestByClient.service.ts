import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AdiqRequestByClientService {
  private http = inject(HttpClient)
  private url = environment.api.url

  getAdiqRequestByClient(crId: string): Observable<any> {
    return this.http.get<any>(`${this.url}/accreditationAdiqById/${crId}`)
  }

  sendEmailRequestAdiqECMid(proposal: string): Observable<any> {
    const body = {
      proposal: proposal
    }
    return this.http.post(`${this.url}/adiq`, body)
  }
}
