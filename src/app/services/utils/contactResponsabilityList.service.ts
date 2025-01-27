import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class contactResponsabilityListService {

  private contactResponsabilityList = [
    'Administrador',
    'Assistente Administrativo',
    'Gerente',
    'Gestor',
    'Outro',
    'Presidente',
    'Secretário',
    'Supervisor',
    'Vice-Presidente'
  ]

  public getContactResponsabilityList() {
    return this.contactResponsabilityList;
  }
}
