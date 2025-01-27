import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class PersonTypeFourbank {

  private tipoPessoa = ['Física', 'Física Funcionário', 'Física Imune', 'Jurídica com Fins Lucrativos', 'Jurídica sem Fins Lucrativos', 'Jurídica sem Fins Lucrativos com Declaração'];


  public getPersonType(){
    return this.tipoPessoa;
  }

}
