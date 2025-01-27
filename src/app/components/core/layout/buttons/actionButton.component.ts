import { Component, ElementRef, HostListener, inject, Input, Output, EventEmitter } from "@angular/core";
import { NgFor, NgIf } from "@angular/common";
import { fadeInOut } from "../../../animations/fadeInAnimation.component";
import { ActionButton } from "../../../../types/actionButton.interface";


@Component({
  selector: "app-layout-button-actionButton",
  imports: [NgIf, NgFor],
  templateUrl: "./actionButton.component.html",
  standalone: true,
  animations: [fadeInOut]
})

export class ActionButtonComponent {
  public showActionModal = false
  public dropIcon = "assets/icons/arrow-down-outline.svg"
  protected _eref = inject(ElementRef)
  @Input() actionButtonElements: ActionButton[] = []
  @Output() MenuClickedItem = new EventEmitter<string>

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this._eref.nativeElement.contains(event.target))
      this.showActionModal = false;
    if (this.showActionModal == false) this.dropIcon = "assets/icons/arrow-down-outline.svg"
  }

  ngOnInit(): void {
    console.log(this.actionButtonElements)
  }

  public clickedItem(value: any) {
    this.MenuClickedItem.emit(value)
    this.toggleDropdown()
  }

  toggleDropdown() {
    this.showActionModal = !this.showActionModal
    if (this.showActionModal == false) this.dropIcon = "assets/icons/arrow-down-outline.svg"
    else this.dropIcon = "assets/icons/arrow-up.svg"
  }


}
