import { Component, Input } from "@angular/core";
import { HamburgerMenuComponent } from "../../../../layout/buttons/hamburgerMenu.component";
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-pages-client-detail-address",
  templateUrl: "./address.component.html",
  standalone: true,
  imports: [HamburgerMenuComponent, NgFor, NgIf]
})

export class AddressDetailsComponent {
  @Input() clientDetails: any = []

  enderecoEdit!:any
}
