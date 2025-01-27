import { Component, ElementRef, EventEmitter, HostListener, inject, Output } from "@angular/core";
import { NgIf } from '@angular/common';
import { fadeInOut } from "../../../animations/fadeInAnimation.component";
import { Router } from "@angular/router";
@Component({
  selector: "app-layout-filter",
  imports: [NgIf],
  templateUrl: "./filterInput.component.html",
  standalone: true,
  animations: [fadeInOut]
})

export class FilterInputComponent {
  public showFilterModal = false;
  protected _eref = inject(ElementRef)
  router = inject(Router)
  @Output() selectedStatus = new EventEmitter<string>

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this._eref.nativeElement.contains(event.target))
      this.showFilterModal = false;



  }

  ngOnInit(): void {

  }


  public clickedItem(statusSelected: string) {
    this.selectedStatus.emit(statusSelected)
    this.showFilterModal = false;
  }
}
