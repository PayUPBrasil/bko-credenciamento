import { Component, Input } from "@angular/core";

@Component({
  selector: "app-layout-errorAlert",
  templateUrl: "./errorAlert.component.html",
  standalone: true
})
export class ErrorAlertComponent {

  @Input() error = []


  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log(this.error)
  }


}
