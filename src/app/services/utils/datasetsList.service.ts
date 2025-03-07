import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataSetListService {
  private PFDatasetList = [
    { kyc:'KYC e Compliance',
      circles_first_level_relatives:'Círculos - Parentes (1º grau)',
      related_people:'Pessoas Relacionadas',
      circles_relatives:'Círculos - Relacionados',
    }
  ]

  private PJDatasetList = [
    { owners_kyc:'KYC e Compliance dos Sócios',
      kyc:'KYC e Compliance'
    }
]

  public getPFDatasetList() {
    return this.PFDatasetList;
  }
  public getPJDatasetList() {
    return this.PJDatasetList;
  }
  }
