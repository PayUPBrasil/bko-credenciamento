import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})


export class SearchCityIBGECodeService {
  private httpClient = inject(HttpClient)
  private url = environment.api.url


  public getIBGECode(searchText: string): Observable<any> {

    const body = {
      search: searchText,
      limit: 10
    }

    return this.httpClient.post(`${this.url}/search-city-ibge-code`, body)
  }

}
