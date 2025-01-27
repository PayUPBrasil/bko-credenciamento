import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormatCpfCnpjPipe } from "../../../../../../pipes/format-cpf-cnpj.pipe";

@Component({
  selector: 'app-pages-client-detail-partners',
  standalone: true,
  templateUrl: './partners.component.html',
  imports: [NgClass, NgFor, NgIf, FormatCpfCnpjPipe]
})

export class PartnerDetailsComponent {
  @Input() clientDetails: any = []

  public socioDetails(socioId: string) {

  }

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

  check = false



}
