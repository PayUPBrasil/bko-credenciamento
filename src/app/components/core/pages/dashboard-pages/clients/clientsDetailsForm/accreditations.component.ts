import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, inject, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-pages-client-detail-accreditation",
  templateUrl: "./accreditations.component.html",
  standalone: true,
  imports: [NgIf, NgFor, NgClass]
})

export class AccreditationDetailsComponent {

  @Input() clientDetails: any = []
  router = inject(Router);

  public showDetails(location: string, crId: string) {
    switch (location) {
      case 'adiq':
        this.router.navigate(['dashboard/credAdiq/acompanhar-solicitacoes', crId])
        break;

      default:
        break;
    }
  }


}
