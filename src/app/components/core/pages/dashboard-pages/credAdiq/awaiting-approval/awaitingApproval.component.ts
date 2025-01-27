import { Component } from "@angular/core";
import { SearchInputComponent } from "../../../../layout/searchInput.component";
import { BreadcrumbComponent } from "../../../../layout/breadcrumb.component";
import { PaginationComponent } from "../../../../layout/pagination.component";


@Component({
  selector: 'app-pages-awaitingApproval',
  templateUrl: './awaitingApproval.component.html',
  standalone:true,
  imports: [SearchInputComponent, BreadcrumbComponent, PaginationComponent]
})

export class AwaitingApprovalComponent {

}
