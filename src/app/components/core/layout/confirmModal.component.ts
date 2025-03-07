import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-layout-confirmModal",
  templateUrl: "./confirmModal.component.html",
  standalone: true,
})

export class ConfirmModalComponent {

  @Input() modalValues: any;
  @Output() clickedBtn = new EventEmitter<string>

  public clickedButton(clickedValue: string) {
    console.log(clickedValue)
    this.clickedBtn.emit(clickedValue)
  }
}
