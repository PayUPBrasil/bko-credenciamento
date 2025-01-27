import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class TypeEnterpriseService {

  private typeEnterprise = [
    'Pessoa Física',
    'Microempreendedor Individual (MEI)',
    'Empresário Individual (EI)',
    'Sociedade Limitada (Ltda.)',
    'Sociedade Simples (SS)',
    'Sociedade Anônima (SA)',
    'Sociedade Limitada Unipessoal (SLU)',
    'Empresa de pequeno porte (EPP)'
  ];

  public getEnterpriseTypes() {
    return this.typeEnterprise;
  }

}
