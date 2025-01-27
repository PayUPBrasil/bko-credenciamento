import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class UfService {

  private ufList = [
    { id: 27, name: 'Acre', acronym: 'AC', code: 27, ibgeStateCode: 12 },
    { id: 14, name: 'Alagoas', acronym: 'AL', code: 14, ibgeStateCode: 27 },
    { id: 23, name: 'Amapá', acronym: 'AP', code: 23, ibgeStateCode: 16 },
    { id: 26, name: 'Amazonas', acronym: 'AM', code: 26, ibgeStateCode: 13 },
    { id: 12, name: 'Bahia', acronym: 'BA', code: 12, ibgeStateCode: 29 },
    { id: 18, name: 'Ceará', acronym: 'CE', code: 18, ibgeStateCode: 23 },
    { id: 8, name: 'Distrito Federal', acronym: 'DF', code: 8, ibgeStateCode: 53 },
    { id: 7, name: 'Espírito Santo', acronym: 'ES', code: 7, ibgeStateCode: 32 },
    { id: 9, name: 'Goiás', acronym: 'GO', code: 9, ibgeStateCode: 52 },
    { id: 20, name: 'Maranhão', acronym: 'MA', code: 20, ibgeStateCode: 21 },
    { id: 11, name: 'Mato Grosso', acronym: 'MT', code: 11, ibgeStateCode: 51 },
    { id: 10, name: 'Mato Grosso do Sul', acronym: 'MS', code: 10, ibgeStateCode: 50 },
    { id: 3, name: 'Minas Gerais', acronym: 'MG', code: 3, ibgeStateCode: 31 },
    { id: 22, name: 'Pará', acronym: 'PA', code: 22, ibgeStateCode: 15 },
    { id: 16, name: 'Paraíba', acronym: 'PB', code: 16, ibgeStateCode: 25 },
    { id: 6, name: 'Paraná', acronym: 'PR', code: 6, ibgeStateCode: 41 },
    { id: 15, name: 'Pernambuco', acronym: 'PE', code: 15, ibgeStateCode: 26 },
    { id: 19, name: 'Piauí', acronym: 'PI', code: 19, ibgeStateCode: 22 },
    { id: 2, name: 'Rio de Janeiro', acronym: 'RJ', code: 2, ibgeStateCode: 33 },
    { id: 17, name: 'Rio Grande do Norte', acronym: 'RN', code: 17, ibgeStateCode: 24 },
    { id: 5, name: 'Rio Grande do Sul', acronym: 'RS', code: 5, ibgeStateCode: 43 },
    { id: 24, name: 'Rondônia', acronym: 'RO', code: 24, ibgeStateCode: 11 },
    { id: 25, name: 'Roraima', acronym: 'RR', code: 25, ibgeStateCode: 14 },
    { id: 4, name: 'Santa Catarina', acronym: 'SC', code: 4, ibgeStateCode: 42 },
    { id: 1, name: 'São Paulo', acronym: 'SP', code: 1, ibgeStateCode: 35 },
    { id: 13, name: 'Sergipe', acronym: 'SE', code: 13, ibgeStateCode: 28 },
    { id: 21, name: 'Tocantins', acronym: 'TO', code: 21, ibgeStateCode: 17 }
  ];



  public getUfs() {
    return this.ufList;
  }
}

