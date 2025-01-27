import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class AccountTypesService {
  private accountTypes = ['Conta Corrente', 'Conta Poupança', 'Conta Salário', 'Conta Pagamento', 'Conta Digital', 'Outros'];

  public getAccountTypes() {
    return this.accountTypes;
  }
}
