import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataSetService {
  private PFDatasetList = [
  '  basic_data','lawsuits_distribution_data','indebtedness_question','financial_interests','financial_risk'
  ]
  private PJDatasetList = ['basic_data','lawsuits_distribution_data']


  public getPFDatasetList() {
    return this.PFDatasetList;
  }
  public getPJDatasetList() {
    return this.PJDatasetList;
  }
  }
