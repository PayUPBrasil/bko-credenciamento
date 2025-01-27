import { Component, Input, Output, EventEmitter } from "@angular/core";

interface Alert {
  title: string,
  message: string,
  buttonConfirmText: string
 }
@Component({
  selector: "app-layout-modal",
  templateUrl: "./modal.component.html",
  standalone: true
})


export class ModalComponent {
  @Input() alert!: Alert;
  @Output() newItemEvent = new EventEmitter<string>();

  public modalButton(event: any) {
    this.newItemEvent.emit(event);
  }
}
