import { NgFor } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormatCpfCnpjPipe } from "../../../pipes/format-cpf-cnpj.pipe";

@Component({
  selector: "app-simple-table",
  templateUrl: "./simpleTable.component.html",
  standalone: true,
  imports: [NgFor, FormatCpfCnpjPipe]
})

export class SimpleTableComponent implements OnInit {
  @Input() tableList: any
  @Output() remove: any = new EventEmitter()
  ngOnInit(): void {
    console.log(this.tableList)
  }

  removeItem(clientResponsabilityDoc: string): void {
    this.remove.emit(clientResponsabilityDoc)
  }
}
