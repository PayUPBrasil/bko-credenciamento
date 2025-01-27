import { Component, inject, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "../../../layout/breadcrumb.component";
import { PaginationComponent } from "../../../layout/pagination.component";
import { SearchInputComponent } from "../../../layout/searchInput.component";
import { FilterInputComponent } from "../../../layout/buttons/filterInput.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ActionButtonComponent } from "../../../layout/buttons/actionButton.component";
import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { SessionService } from "../../../../../services/session/session.service";
import { FormatCpfCnpjPipe } from "../../../../../pipes/format-cpf-cnpj.pipe";
import { TagComponent } from "../../../layout/tag.component";
import { ConfirmModalComponent } from "../../../layout/confirmModal.component";
import { ClientService } from "./services/clients.service";
@Component({
  selector: 'app-pages-clients',
  templateUrl: './clients.component.html',
  imports: [BreadcrumbComponent, PaginationComponent, SearchInputComponent, FilterInputComponent, RouterLink, ActionButtonComponent, NgFor, NgClass, NgIf, CommonModule, FormatCpfCnpjPipe, TagComponent, ConfirmModalComponent],
  standalone: true
})

export class ClientsComponent implements OnInit {

  public page!: number;
  public status !: string
  public searchTerm = '';
  public check = false
  private router = inject(Router)
  public allClients: Array<any> = []
  public filterOptions: any = []
  public filteredClients: Array<any> = this.allClients
  public clientService = inject(ClientService)
  public sessionService = inject(SessionService)
  public route = inject(ActivatedRoute)
  public clientes: any[] = [];
  public currentPage = 1;
  public totalPages: number[] = [];
  public dontHaveClientsYet !:boolean;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = +params['page']
      this.getAllClients(this.page);
    });
  }

  public searchInput(value: any) {
    this.searchTerm = value
    this.getAllClients(1, this.searchTerm, '')
    if (this.searchTerm) {
      this.filterOptions = []
      this.status = ''
    }
  }

  public searchFilter(status: string) {
    this.status = status;
    this.filterOptions[0] = this.status
    this.page = 1
    this.router.navigate(['/dashboard/todos-os-clientes', 1]);
    this.getAllClients(this.page, this.searchTerm, this.status)
  }

  public getIconSrc(status: string): string {
    switch (status) {
      case 'Rejeitado':
        return '/assets/icons/xCircleIcon.svg';
      case 'Pendente':
        return '/assets/icons/timerIcon.svg';
      default: 'Ativo'
        return '/assets/icons/checkIcon.svg';
    }
  }

  public getAllClients(page: number, search = '', status = this.status) {

    if (this.totalPages.length < 1) {
      this.router.navigate(['/dashboard/todos-os-clientes', 1]);
    } else if (page > this.totalPages.length) {
      this.router.navigate(['/dashboard/todos-os-clientes', 1]);
    }

    this.clientService.getAllClients(page, search, status).subscribe(
      {
        next: (response) => {
          this.allClients = response.data
          this.filteredClients = response.data.clientActive
          let arr = []

          for (let i = 0; i < response.data.totalPages; i++) {
            arr.push(i + 1)
          }

          this.totalPages = arr.filter((item, index) => arr.indexOf(item) === index);
          this.currentPage = page;
        },
        error: (error) => {
          console.error(error)
          this.dontHaveClientsYet = true
        }
      }
    )
  }

  public clearFilter() {
    this.status = ''
    this.filterOptions = []
    this.router.navigate(['/dashboard/todos-os-clientes', 1]);
    this.getAllClients(1)
  }
  public clientDetails(crId: string) {
    this.router.navigate(['/dashboard/clients/details', crId])
  }

  public selectedClient(event: any) {
    console.log(event)
  }


}
