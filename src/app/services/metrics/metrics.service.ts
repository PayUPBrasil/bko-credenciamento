import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class MetricsService {

  private url = environment.api.url
  private httpClient = inject(HttpClient)


  public totalClients(): Observable<any> {
    return this.httpClient.get(`${this.url}/metrics`)
  }
  public totalActiveClients(): Observable<any> {
    return this.httpClient.get(`${this.url}/metrics/active`)
  }


  public totalPendingClients(): Observable<any> {
    return this.httpClient.get(`${this.url}/metrics/pending`)
  }

  public getAccreditationBySeller() : Observable<any> {
    return this.httpClient.get(`${this.url}/metrics/by-sellers`)
  }
  public getAccreditationByMonth() : Observable<any> {
    return this.httpClient.get(`${this.url}/metrics/by-month`)
  }

}
