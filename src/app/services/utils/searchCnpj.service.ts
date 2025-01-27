import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from '../../../environments/environment.development';
import { SearchCNPJ } from '../../types/searchCnpj.interface';

@Injectable({
  providedIn: 'root'
})

export class SearchCNPJService {

  private url = environment.api.url


  private http = inject(HttpClient)

  public searchCnpj(cnpj: string): Observable<SearchCNPJ> {
    const body = {
      cnpj: cnpj
    }
    return this.http.post<SearchCNPJ>(`${this.url}/cnpj`, body)
  }

}
