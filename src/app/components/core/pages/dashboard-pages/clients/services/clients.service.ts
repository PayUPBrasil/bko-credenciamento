import {  inject, Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ClientService {

  private url = environment.api.url
  // private url_credenciamento = environment.api.url_credenciamento
  private http = inject(HttpClient)

  public updateClientData(newClientData:any, crId:string) : Observable<any> {

    console.log(newClientData, 'dados do cliente para atualizar')
    const body = {
    ...newClientData
    }

    console.log(body, 'dados do cliente para atualizar, no service')
    return this.http.put(`${this.url}/clients/update/${crId}`, body)
  }


  public getAllClients(page: number, search: string, status = ''): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('search', search)
      .set('status', status)
    return this.http.get<any>(`${this.url}/clients`, { params })
  }


  public getClientDetailsById(crId: string): Observable<any> {
    return this.http.get(`${this.url}/clients/${crId}`)
  }


  public changeClientStatus(status: string, crId: string): Observable<any> {
    const body = {
      status: status
    }
    return this.http.put<any>(`${this.url}/clients/${crId}`, body)
  }





}
