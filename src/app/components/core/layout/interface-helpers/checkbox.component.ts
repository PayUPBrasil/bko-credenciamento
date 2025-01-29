import { NgFor } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "app-layout-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls:['./checkbox.component.css'],
  standalone: true,
  imports: [NgFor]
})

export class CheckboxComponent {
  @Input() checkboxValues : string[]= [];
  @Output() checkboxItemClicked = new EventEmitter<Array<string>>(  );

  private valueSelected : string[] = []
  public clickedCheckboxItem(item:string) {
    this.valueSelected.includes(item) ? this.valueSelected = this.removeItemFromList( this.valueSelected,item)  : this.valueSelected.push(item) ;
    this.checkboxItemClicked.emit(this.valueSelected);
  }

  public removeItemFromList(list:string[], item:string) {
    return list.filter(i => i!== item);
  }
}
