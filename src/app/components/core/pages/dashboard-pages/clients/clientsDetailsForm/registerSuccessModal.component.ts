import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: "app-pages-register-success-modal",
  templateUrl: "./registerSuccessModal.component.html",
  standalone: true
})

export class RegisterSuccessModalComponent {

  @Output() generateContract = new EventEmitter();
  @Output() credClientOnAdiq= new EventEmitter();
  @Output() closeSuccessModal= new EventEmitter();

  public credAdiq(){
    this.credClientOnAdiq.emit();
  }

  public genContract(){
    this.generateContract.emit();
  }

  public close(){
    this.closeSuccessModal = new EventEmitter();
  }

}
