import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";
import { Countries, Country } from "../../types/countries.interface";

@Injectable({
  providedIn: 'root',
})

export class CountriesService {

  private url = environment.api.url_countries;
  private httpClient = inject(HttpClient)

  public listAllCountries(): Observable<Countries> {
    return this.httpClient.get<Countries>(`${this.url}/paises`)
  }




}
