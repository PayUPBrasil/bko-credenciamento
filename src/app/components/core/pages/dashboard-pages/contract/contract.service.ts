import { inject, Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../../../../environments/environment.development";
import { catchError, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ContractService {

  private httpClient = inject(HttpClient)
  private url = environment.api.url



  public generateClienContract(clientDocument: string): Observable<Blob> {
    console.log(clientDocument, 'mostrando o documento do cliente que foi enviado');
    const body = {
      clientDocument: clientDocument,
    };
    return this.httpClient.post<Blob>(`${this.url}/contract`, body, { responseType: 'blob' as 'json' }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error, 'tentando capturar o erro que foi gerado na tentativa de gerar o contrato')
          throw error;
      })
    );
  }
  public generateContract(clientData: any): Observable<Blob> {
    const body = {
      clientDocument: clientData.clientDocument,
      clientName: clientData.clientName,
      clientPhone: clientData.clientPhone,
      clientEmail: clientData.clientEmail,
      clientStreet: clientData.clientStreet,
      clientNeighborhood: clientData.clientNeighborhood,
      clientCity: clientData.clientCity,
      clientState: clientData.clientState,
      clientNumber: clientData.clientNumber,
      clientZipCode: clientData.clientZipCode,
      clientComplement: clientData.clientComplement,
      enterpriseType: clientData.enterpriseType,
      partners: clientData.partners || []
    };

    return this.httpClient.post<Blob>(`${this.url}/contract`, body, { responseType: 'blob' as 'json' });
  }


}
