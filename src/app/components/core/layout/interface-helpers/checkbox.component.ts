import { KeyValuePipe, NgFor } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CheckBoxService } from "./checkbox.service";

@Component({
  selector: "app-layout-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls:['./checkbox.component.css'],
  standalone: true,
  imports: [NgFor, KeyValuePipe]
})

export class CheckboxComponent implements OnInit {

  @Input() checkboxValues : object[]= [];
  @Output() checkboxItemClicked = new EventEmitter<Array<string>>(  );


  checkboxService = inject(CheckBoxService)
  public valueSelected : string[] = []

  ngOnInit(): void {
    console.log(this.checkboxValues)
    console.log(this.valueSelected, 'valueSelected')
  }

  public clickedCheckboxItem(item: string): void {
    this.checkboxService.valueSelected.includes(item)
      ? this.checkboxService.valueSelected = this.removeItemFromList(this.checkboxService.valueSelected, item)
      : this.checkboxService.valueSelected.push(item);
      this.checkboxItemClicked.emit(this.checkboxService.valueSelected);
  }

  private removeItemFromList(list: string[], item: string): string[] {
    return list.filter(i => i !== item);
  }

  //* Adicionando os valores já previamente selecionados quando o usuário já tiver feito isso

}
