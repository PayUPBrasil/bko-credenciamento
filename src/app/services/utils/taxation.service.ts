import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class TaxationService {
  private taxationList = [
    'Arbitrado',
    'Isento',
    'Lucro Real',
    'MEI - Micro Empreendedor Individual',
    'Presumido',
    'Simples',
  ]

  public getTaxationList() {
    return this.taxationList
  }
}
