import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataSetListService {
  private PFDatasetList = [
    { basic_data:'Dados Básicos',
      lawsuits_distribution_data:'Distribuição de Processos',
      indebtedness_question: 'Inadimpências',
      financial_interests: 'Interesses Financeiros',
      financial_risk: 'Risco Financeiro'
    }
  ]

  private PJDatasetList = [{ basic_data:'Dados Básicos'}, {lawsuits_distribution_data: 'Distribuição de Processos' }]

  public getPFDatasetList() {
    return this.PFDatasetList;
  }
  public getPJDatasetList() {
    return this.PJDatasetList;
  }
  }
