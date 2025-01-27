import { Component, Input, SimpleChanges } from "@angular/core";
import { TagComponent } from "../../../../layout/tag.component";
import { NgFor } from "@angular/common";

@Component({
  selector: "app-pages-client-detail-flags",
  templateUrl: "./flags.component.html",
  standalone: true,
  imports: [TagComponent, NgFor]
})

export class FlagsDetailsComponent {

  @Input() clientDetails: any = []

  public flagNames: string[] = []; // Mudamos para um array de strings

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(this.clientDetails, 'detalhes do cliente');
    if (this.clientDetails && this.clientDetails.length > 0 && this.clientDetails[0].codes) {
      this.flagNames = this.getFlagNames(this.clientDetails[0].codes);
    }
  }

  public getFlagNames(flagNumbers: number[]): string[] {
    //console.log(flagNumbers, 'flagNumbers');

    const flagMap: { [key: number]: string } = {
      1: 'VISA CREDITO',
      2: 'VISA DEBITO',
      3: 'MASTER CREDITO',
      4: 'MASTER DEBITO',
      22: 'ELO CREDITO',
      23: 'ELO DEBITO',
      28: 'HIPERCARD',
    };

    return flagNumbers.map(num => flagMap[num] || 'Unknown Flag');
  }

}
