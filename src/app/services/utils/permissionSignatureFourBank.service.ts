import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})


export class PermissionSignatureFourBankService {

  private assinatura = ['Sem Permissão', 'Conjuntamente', 'Isoladamente'];

  public signaturePermission() {
    return this.assinatura
  }
}
