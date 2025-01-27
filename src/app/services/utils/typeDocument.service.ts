import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DocService {
  private docList = [
    { sigla: 'CARTEIRA_IDENTIDADE', nome: 'Carteira de Identidade' },
    { sigla: 'CARTEIRA_HABILITACAO', nome: 'Carteira de Habilitação' },
    { sigla: 'CARTEIRA_TRABALHO', nome: 'Carteira de Trabalho' },
    { sigla: 'REGISTRO_PROFISSIONAL', nome: 'Registro Profissional' },
    { sigla: 'CONTRATO_SOCIAL', nome: 'Contrato Social' },
    { sigla: 'OUTROS', nome: 'Outros' },
  ];

  public getDocs() {
    return this.docList;
  }
}
