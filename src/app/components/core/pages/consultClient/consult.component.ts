import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-pages-client-detail-documents",
  templateUrl: "./consult.component.html",
  standalone: true,
 })

export class ConsultClientComponent {

  constructor() { }

  private router = inject(Router)

  public goToAnotherPage(typeConsulting:string){
    let type = typeConsulting
   return this.router.navigate([`/dashboard/onboarding/${type}`])
  }
}
