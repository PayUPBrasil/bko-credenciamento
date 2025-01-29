import { KeyValuePipe, NgFor } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-layout-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls:['./checkbox.component.css'],
  standalone: true,
  imports: [NgFor, KeyValuePipe]
})

export class CheckboxComponent implements OnInit {
  ngOnInit(): void {
    console.log(this.checkboxValues)
    console.warn(this.checkboxValueAlreadyExists)
  }
  @Input() checkboxValues : object[]= [];
  @Input() checkboxValueAlreadyExists : string[] = []
  @Output() checkboxItemClicked = new EventEmitter<Array<string>>(  );

  private valueSelected : string[] = []
  public clickedCheckboxItem(item:string) : void {
    console.log(this.checkboxValueAlreadyExists, 'checkboxValueAlreadyExists')
    this.valueSelected.includes(item) ? this.valueSelected = this.removeItemFromList( this.valueSelected,item) : this.valueSelected.push(item) ;
    this.checkboxItemClicked.emit(this.valueSelected);
  }

  public removeItemFromList(list:any[], item:string) : string[]  {
    return list.filter(i => i!== item);
  }

  //* Adicionando os valores já previamente selecionados quando o usuário já tiver feito isso



}
