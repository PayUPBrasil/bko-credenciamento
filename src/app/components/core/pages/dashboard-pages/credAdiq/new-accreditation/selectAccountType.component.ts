import { Component, Output, EventEmitter } from "@angular/core";


@Component({
  selector: "app-pages-select-account-type",
  templateUrl: "./selectAccountType.component.html",
  standalone: true
})

export class SelectAccountTypeComponent {
  @Output() selectedAccountType  = new EventEmitter()

  public optionSelected (number:string) : void {
     this.selectedAccountType.emit(number)
  }
}
