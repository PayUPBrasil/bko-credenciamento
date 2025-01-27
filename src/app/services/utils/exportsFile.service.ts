import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})

export class ExportsFileService {

  constructor(private http: HttpClient) {}
  private apiUrl = environment.api.url;

  exportToPdf(htmlContent: string): Observable<Blob> {
    console.log('Exportando para PDF o service...');
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(`${this.apiUrl}/export-pdf`, { htmlContent }, {
      headers: headers,
      responseType: 'blob'
    }).pipe(
      tap(response => console.log('Resposta do servidor:', response)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Erro na requisição:', error);
    if (error.error instanceof ErrorEvent) {
      console.error('Erro do cliente:', error.error.message);
    } else {
      console.error(
        `Código de erro do backend ${error.status}, ` +
        `corpo: ${error.error}`);
    }
    return throwError('Algo deu errado; por favor, tente novamente mais tarde.');
  }
}
