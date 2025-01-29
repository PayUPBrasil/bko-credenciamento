import { KeyValuePipe, NgFor } from "@angular/common";
import { Component, EventEmitter, inject, Input,  Output } from "@angular/core";
import { CheckBoxService } from "./checkbox.service";

@Component({
  selector: "app-layout-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls:['./checkbox.component.css'],
  standalone: true,
  imports: [NgFor, KeyValuePipe]
})

export class CheckboxComponent {

  @Input() checkboxValues : object[]= [];
  @Output() checkboxItemClicked = new EventEmitter<Array<string>>(  );


  checkboxService = inject(CheckBoxService)
  public valueSelected : string[] = []


  public clickedCheckboxItem(item: string): void {
    this.checkboxService.valueSelected.includes(item)
      ? this.checkboxService.valueSelected = this.removeItemFromList(this.checkboxService.valueSelected, item)
      : this.checkboxService.valueSelected.push(item);
      this.checkboxItemClicked.emit(this.checkboxService.valueSelected);
  }

  private removeItemFromList(list: string[], item: string): string[] {
    return list.filter(i => i !== item);
  }

}
