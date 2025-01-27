import { NgClass, NgIf } from "@angular/common";
import { Component, Input, Output } from "@angular/core";
import { swipeUpAnimation } from "../../animations/swipeUpAnimation.component";
import { EventEmitter } from "@angular/core";
@Component({
  selector: "app-layout-notify",
  imports: [NgIf, NgClass],
  templateUrl: "./notifyAlert.component.html",
  standalone: true,
  animations: [swipeUpAnimation]
})

export class NotifyComponent {
  @Input() notifyElements: any = []
  @Output() buttonClicked = new EventEmitter<string>();
  public showNotify = true

  // @Input() notifyToggle = 'toggle da notificação'
  // @Input() notifyTitle = 'Titulo da Notificação'
  // @Input() notifyText = 'Texto da notificação'
  // @Input() notifyImage = '/assets/icons/envelopeIcon.svg'
  // @Input() timeStamp = '4 segundo atrás'
  // @Input() notifyStatus = false

  ngOnInit(): void {
    console.log(this.notifyElements, "Mostrando os valores passados em notifyAlert")
    this.showModal()
  }


  public showModal() {
    if (this.notifyElements.length > 0) {
      this.showNotify = true
    }
  }

  public closeModal() {
    this.buttonClicked.emit('close notify modal')
  }

}
