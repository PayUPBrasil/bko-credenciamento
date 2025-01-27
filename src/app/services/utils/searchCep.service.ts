import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cep } from "../../types/searchCep.interface";

@Injectable({
  providedIn: 'root',
})


export class SearchCepService {

  private url = environment.api.url
  private http = inject(HttpClient)

  public searchCep(cep: string): Observable<Cep> {
    const body = {
      cep: cep
    }
    return this.http.post<Cep>(`${this.url}/cep`, body)
  }

}
