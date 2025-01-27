import { NgFor } from "@angular/common";
import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-layout-flagTag",
  templateUrl: "./flagtag.component.html",
  standalone: true,
  imports: [NgFor]
})

export class FlagTagComponent {
  @Input() Item: any = [];
  @Output() ItemClicked = new EventEmitter<string>();

  public removeTag(value: string) {
    this.ItemClicked.emit(value)
  }

  ngOnInit(): void {
    console.log(this.Item, 'mostrando os itens no service')
  }

}
