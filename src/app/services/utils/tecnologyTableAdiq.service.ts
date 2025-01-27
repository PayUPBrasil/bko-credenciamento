import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class TecnologyTableAdiq {

  private codigosdeTecnologias = [
    { cod: '3', tecnologia: 'e-commerce', situacao: 'Ativo' },
    { cod: '4', tecnologia: 'Tecnologia POS Verifone VX685', situacao: 'Ativo' },
    { cod: '7', tecnologia: 'TEF', situacao: 'Ativo' },
  ];

  public getTecnologyTableAdiq() {
    return this.codigosdeTecnologias;
  }

}
