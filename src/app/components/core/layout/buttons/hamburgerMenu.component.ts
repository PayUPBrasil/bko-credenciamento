import { NgFor, NgIf } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, Output } from "@angular/core";
import { fadeInOut } from "../../../animations/fadeInAnimation.component";

@Component({
  selector: 'app-layouts-button-hambuger',
  templateUrl: './hamburgerMenu.component.html',
  standalone: true,
  imports: [NgFor, NgIf],
  animations: [fadeInOut]
})


export class HamburgerMenuComponent {

  public showActionModal = false
  protected _eref = inject(ElementRef)
  @Input() actionButtonElements: any = []
  @Output() HamburgerClickedItem = new EventEmitter<string>

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this._eref.nativeElement.contains(event.target))
      this.showActionModal = false;
  }

  ngOnInit(): void {
    console.log(this.actionButtonElements)
  }

  public clickedItem(value: any) {
    this.HamburgerClickedItem.emit(value)
  }


}
