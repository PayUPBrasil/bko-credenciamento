import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class ProposalCheckService {

  private http = inject(HttpClient)
  private url = environment.api.url


  public searchProposalByProposal(proposal: string): Observable<any> {
    console.log(proposal, 'verificando o proposal')
    return this.http.get(`${this.url}/proposal/${proposal}`)
  }

}
