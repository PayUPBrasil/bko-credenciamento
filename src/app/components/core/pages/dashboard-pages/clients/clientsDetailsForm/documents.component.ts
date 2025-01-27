import { Component, Input } from "@angular/core";

@Component({
  selector: "app-pages-client-detail-documents",
  templateUrl: "./documents.component.html",
  standalone: true
})

export class DocumentDetailsComponent {
  @Input() clientDetails: any = []

}
