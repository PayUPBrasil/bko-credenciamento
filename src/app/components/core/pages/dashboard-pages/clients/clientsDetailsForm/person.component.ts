import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, Inject, inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { FormatCpfCnpjPipe } from "../../../../../../pipes/format-cpf-cnpj.pipe";
import { FormatPhonePipe } from "../../../../../../pipes/format-phone.pipe";
import { UserService } from "../../admin/users/user.service";

@Component({
  selector: "app-pages-client-detail-person",
  templateUrl: "./person.component.html",
  standalone: true,
  imports: [NgIf, NgClass, NgFor, FormatCpfCnpjPipe, FormatPhonePipe]
})

export class PersonComponent{
  @Input() clientDetails: any = []
  @Input() createdBy !: string | null;

  public getIconSrc(status: string): string {
    switch (status) {
      case 'Rejeitado':
        return '/assets/icons/xCircleIcon.svg';
      case 'Pendente':
        return '/assets/icons/timerIcon.svg';
      default:
        return '/assets/icons/checkIcon.svg';
    }
  }


}
