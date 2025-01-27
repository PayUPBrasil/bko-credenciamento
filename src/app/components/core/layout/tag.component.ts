import { NgFor } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-layout-tag",
  templateUrl: "./tag.component.html",
  standalone: true,
  imports: [NgFor]
})

export class TagComponent {
  @Input() Item: any = [];


  ngOnInit(): void {
    console.log(this.Item)
  }

}
