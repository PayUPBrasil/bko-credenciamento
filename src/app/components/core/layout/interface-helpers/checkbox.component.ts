import { NgFor } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-layout-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls:['./checkbox.component.css'],
  standalone: true,
  imports: [NgFor]
})

export class CheckboxComponent {
    items = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
}
