import { Component, inject } from "@angular/core";
import { SearchInputComponent } from "../../../../layout/searchInput.component";
import { Subject } from "rxjs";
import { FormsModule } from "@angular/forms";
 import { NgClass } from "@angular/common";
import { ProposalCheckService } from "./proposalCheck.service";
@Component({
  selector: 'app-pages-adiq-proposalCheck',
  templateUrl: './proposalCheck.component.html',
  standalone: true,
  imports: [SearchInputComponent, FormsModule, NgClass]
})

export class ProposalCheckComponent {

  public proposalId!: string;
   public proposalCheckService = inject(ProposalCheckService)

  getProposalId() {

    this.proposalCheckService.searchProposalByProposal(this.proposalId).subscribe(
      {
        next: (response) => {console.log(response)},
        error: (error) => {console.log(error) }
      }
    )

  }

}
