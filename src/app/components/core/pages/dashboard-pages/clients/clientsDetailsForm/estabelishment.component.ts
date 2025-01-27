import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormatCpfCnpjPipe } from "../../../../../../pipes/format-cpf-cnpj.pipe";
import { FormatPhonePipe } from "../../../../../../pipes/format-phone.pipe";
import { UserService } from "../../admin/users/user.service";

@Component({
  selector: "app-pages-client-detail-estabelishment",
  templateUrl: "./estabelishment.component.html",
  standalone: true,
  imports: [NgClass, NgFor, NgIf, FormatCpfCnpjPipe, FormatPhonePipe]
})

export class EstabelishmentDetailsComponent {

  @Input() clientDetails: any = []
  @Input() createdBy!: string;


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
