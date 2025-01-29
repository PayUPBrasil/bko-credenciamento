import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataSetListService {
  private PFDatasetList = [
    { kyc:'KYC e Compliance',
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
