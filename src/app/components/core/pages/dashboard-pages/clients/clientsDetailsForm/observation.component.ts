import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-pages-client-detail-observation',
  templateUrl: './observation.component.html',
  imports: [NgIf],
  standalone: true,

})

export class ObservationDetailsComponent {
  @Input() clientDetails:any = []
}
