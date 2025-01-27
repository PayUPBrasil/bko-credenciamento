import { Component, EventEmitter, Output } from "@angular/core";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";

@Component({
  selector: "app-pages-adiq-proposal-details",
  templateUrl: "./proposalDetails.component.html",
  standalone: true,
  animations:[fadeInOut]
})

export class ProposalDetailsComponent{

  @Output() modalVisibility = new EventEmitter<boolean>();

  closeModal(){
    console.log('acessei o modal de registro')
    this.modalVisibility.emit(false);
  }
}
