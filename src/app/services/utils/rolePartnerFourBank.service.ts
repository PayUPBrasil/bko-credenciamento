import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class RolePartnerFourBankService {
  private cargoSocio = ['Sócio Administrador'];


  public getPartnerRole() {
    return this.cargoSocio;
  }
}
