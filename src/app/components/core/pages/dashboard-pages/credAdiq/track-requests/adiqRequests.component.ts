import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { AdiqRequestsService } from "./adiqResquests.service";
import { FormatCpfCnpjPipe } from "../../../../../../pipes/format-cpf-cnpj.pipe";
import { SearchInputComponent } from "../../../../layout/searchInput.component";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";
import { ActivatedRoute } from "@angular/router";
import { PaginationComponent } from "../../../../layout/pagination.component";
@Component({
  selector: "app-pages-adiq-requests",
  templateUrl: "./adiqRequests.component.html",
  standalone:true,
  imports: [NgFor, NgIf, NgClass, FormatCpfCnpjPipe, SearchInputComponent, ActionButtonComponent, CommonModule, PaginationComponent]

})

export class AdiqRequestsComponent {
  private adiqRequestsService = inject(AdiqRequestsService);

  public allProposals:any = []
  public page !:number;
  public currentPage = 1;
  public totalPages: number[] = [];
  public route = inject(ActivatedRoute)


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = +params['page']
      this.getAllAdiqProposal(this.page);
    });
  }

  public getAllAdiqProposal(page = 1, searchInput = '') {

    console.log(page,'verificando a página')

    if(isNaN(page) || page < 1){
      page = 1;
    }

    this.adiqRequestsService.getAllProposals(page, searchInput).subscribe({
      next: (response) => {
        let arrPages = []
        console.log(response, 'response')
        for(let i = 0; i < response.data[0].totalPages; i++){
          arrPages.push(i + 1)
        }

        this.totalPages = arrPages.filter((item, index) => arrPages.indexOf(item) === index);


        let arr = [];

        console.log(response.data[0].totalPages, 'response.data[0].totalPages')

        this.totalPages .push= response.data[0].totalPages;
        for (let i = 0; i < response.data.length; i++) {
          arr.push(response.data[i].proposal);
        }

        this.allProposals = arr;
        console.log(this.allProposals, 'mostrando todas as propostas');
      },
      error: (error) => {
        console.log(error);
      },
    });
  }


    public getTypeClient(type:string | number) : string{
      if(type == '1'){
        return 'PF'
    } else {
      return 'PJ'
    }
  }


  public convertStatus(status:string) : string{
    switch(status){
      case 'waiting':
        return 'Enviado para fila Backoffice'
      case 'analyse':
        return 'Em análise'
      case 'pending':
        return 'Pendente'
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Rejeitado'
      case 'canceled':
        return 'Cancelado'
      default:
        return 'Status desconhecido'
    }
  }

  public productType(productId:string) : string{
    switch(productId){
      case '3' :
        return 'E-commmerce'
      case '4' :
        return 'POS'
      case '7' :
        return 'TEF'
    }
    return 'Produto desconhecido'
  }

  public searchValue (value:string):void{
    console.log(value, 'verificando o valor que está sendo pesquisado')
    if(value.length >= 6 ){
      this.getAllAdiqProposal(1, value);
    } else {
      return this.getAllAdiqProposal(1, '')
    }
    return
  }


}
