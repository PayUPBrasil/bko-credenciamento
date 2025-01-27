import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class CodProdutoAdiqService {

  private codProdutosList = [

    {
      "codProduto": 5,
      "nomeProduto": "TODAS AS BANDEIRAS",
    },

    {
      "codProduto": 1,
      "nomeProduto": "VISA CREDITO",
    },

    {
      "codProduto": 2,
      "nomeProduto": "VISA DEBITO",
    },

    {
      "codProduto": 3,
      "nomeProduto": "MASTER CREDITO",
    },

    {
      "codProduto": 4,
      "nomeProduto": "MASTER DEBITO",
    },

    {
      "codProduto": 22,
      "nomeProduto": "ELO CREDITO",
    },

    {
      "codProduto": 23,
      "nomeProduto": "ELO DEBITO",
    },

    {
      "codProduto": 28,
      "nomeProduto": "HIPERCARD",
    },

  ]


  public getCodProdutoList(){
    return this.codProdutosList;
  }
}
