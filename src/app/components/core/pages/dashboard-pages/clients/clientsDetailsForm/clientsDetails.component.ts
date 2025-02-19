import { Component, inject, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "../../../../layout/breadcrumb.component";
import { PaginationComponent } from "../../../../layout/pagination.component";
import { Breadcrumb } from "../../../../layout/types/breadcrumb.interface";
import { ActivatedRoute, Router } from "@angular/router";
import { ClientService } from "../services/clients.service";
import { NgClass, NgFor, NgIf, Location } from "@angular/common";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";
import { HamburgerMenuComponent } from "../../../../layout/buttons/hamburgerMenu.component";
import { NewAccreditationModalComponent } from "../../credAdiq/new-accreditation/newAccreditationModal.component";
import { FormatCpfCnpjPipe } from "../../../../../../pipes/format-cpf-cnpj.pipe";
import { ContractModalComponent } from "../../contract/contractModal.component";
import { ModalComponent } from "../../../../layout/modal.component";
import { ConfirmModalComponent } from "../../../../layout/confirmModal.component";
import { NotifyComponent } from "../../../../layout/notifyAlert.component";
import { ActionButtonList } from "../../../../../../types/actionButton.interface";
import { EstabelishmentDetailsComponent } from "./estabelishment.component";
import { AccreditationDetailsComponent } from "./accreditations.component";
import { FlagsDetailsComponent } from "./flags.component";
import { AddressDetailsComponent } from "./address.component";
import { PartnerDetailsComponent } from "./partners.component";
import { DocumentDetailsComponent } from "./documents.component";
import { ObservationDetailsComponent } from "./observation.component";
import { HistoryDetailsComponent } from "./history.component";
import { OperationDetailsComponent } from "./operation.component";
import { SolutionDetailsComponent } from "./solution.component";
import { UserPermissionsService } from "../../../../../../services/permissions/userPermissions.service";
import { ChangeClientStatusService } from "../../../../../../services/client/changeClientStatus.service";
import { PersonComponent } from "./person.component";
import { ClientsModalEditDataComponent } from "../clientsModalEditData.component";
import { ButtonPrimaryComponent } from "../../../../layout/buttons/button-primary.component";
import { UserService } from "../../admin/users/user.service";
import { noteComponent } from "./note.component";
@Component({
  selector: 'app-pages-clientsDetails',
  templateUrl: './clientsDetails.component.html',
  standalone: true,
  imports: [BreadcrumbComponent, PaginationComponent, NgClass, NgFor, NgIf, ActionButtonComponent, HamburgerMenuComponent, NewAccreditationModalComponent, FormatCpfCnpjPipe, ContractModalComponent, ModalComponent, ConfirmModalComponent, NotifyComponent, EstabelishmentDetailsComponent, AccreditationDetailsComponent, FlagsDetailsComponent, AddressDetailsComponent, PartnerDetailsComponent, DocumentDetailsComponent, ObservationDetailsComponent, HistoryDetailsComponent, OperationDetailsComponent, SolutionDetailsComponent, PersonComponent, ClientsModalEditDataComponent, ButtonPrimaryComponent, noteComponent]
})

export class ClientsDetailsComponent implements OnInit {

  //Services
  private activatedRoute = inject(ActivatedRoute)
  private changeClientStatusService = inject(ChangeClientStatusService)
  private userPermissionsService = inject(UserPermissionsService)
  private clientService = inject(ClientService)
  private userService = inject(UserService)

  private clientId!: string;
  public activeTab !: number
  public userName !: string;

  public clientDetails: Array<any> = []
  private router = inject(Router)
  public clientType!: string
  public check!: boolean;
  public accreditationAdiq = false
  public generateContract = false
  public rejectCustomerModal = false
  public showEditDataModal = false
  public editionDetails !: any;
  public ShowNotifyModal = false
  public notifyElements = [{}]
  public generateContractModal = false
  public showNoteEditor = false
  public modalConfirmationValues = {
    'title': 'Deseja gerar contrato para o cliente?',
    'description': 'Você tem certeza que deseja gerar um contrato para este cliente?',
  }


  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.clientId = params.get('id') || ''
      this.getClientDetailById(this.clientId)
      // Somente para testar o modal de editar as bandeiras
      // this.modalConfigurations('Bandeiras Hab')
    })
    window.scrollTo(0, 0)
  }

  public clickedItem(value: any) {

    console.log(value, 'valor clicado em clickedItem')
    switch (value) {
      case 'Credenciar na Adiq':
        this.accreditationAdiq = true
        break;

      case 'Gerar Contrato':
        this.generateContractModal = true
        break;

      case 'Rejeitar Cliente':
        this.rejectCustomerModal = true
        break;

      case 'Fechar Confirm Modal':
        this.rejectCustomerModal = false
        break;

      case 'Confirmar Rejeicao':
        this.changeCustomerStatus('Rejeitado', this.clientId)
        break;

      case 'Editar Cadastro':
        this.showEditDataModal = true
        break;

      case 'Adicionar Nota':
        this.showNoteEditor = true
        break;

      default:
        break;
    }
  }

  public modalValues = {
    'icon': 'assets/icons/errorIcon.svg',
    'title': 'Rejeitar Cliente',
    'description': 'Você tem certeza que deseja rejeitar o cadastro? Uma vez rejeitado, o cliente não poderá ser credenciado em nenhuma adiquirente.',
  }


  public modalConfigurations(title:string){
    this.editionDetails = [{
      title:title,
      description: 'Visualize e edite os dados do cliente.'
    }]
    this.showEditDataModal = !this.showEditDataModal
  }

  //*ngIf="hasAccess(['admin', 'master', 'Visualizar a lista completa de clientes'])"

  public actionButtonElements: ActionButtonList = [

  ]

  public detalhesDoEstabelecimentoEdit: ActionButtonList = [
    {
      icon: ``,
      name: 'Editar dados',
      path: '/dashboard/admin/create-permissions'
    },

  ]

  public enderecoEdit: ActionButtonList = [
    {
      icon: `/assets/icons/pincel.svg`,
      name: 'Editar endereço',
      path: '/dashboard/admin/create-permissions'
    },
  ]

  public path: Breadcrumb[] = [
    {
      routeName: 'Dashboard',
      routePath: 'http://localhost:4200/dashboard/home'
    },
    {
      routeName: 'Clientes',
      routePath: 'http://localhost:4200/dashboard/todos-os-clientes'
    },
    {
      routeName: `Detalhes do Cliente ${this.router.url.replace(/\D/g, '')}`,
      routePath: `http://localhost:4200/${this.router.url}`
    }
  ];


  public changeClientStatus(event: any) {
    if (event === 'confirmar') {
      this.changeClientStatusService.changeAccountStatus(Number(this.clientId), 'Rejeitado').subscribe({
        next: (response) => {
          console.log(response, 'Status do cliente alterado com sucesso')
          if (response) {
            location.reload();
          }
        },
        error: (error) => {
          console.error(error, 'Erro ao alterar o status do cliente')
        }
      })
    }
    else {
      this.rejectCustomerModal = false
    }
  }

  public getClientDetailById(id: string) {
    this.clientService.getClientDetailsById(id).subscribe({
      next: (response) => {
        this.clientDetails.push(response.data[0])
        this.clientType = response.data[0].type
        this.createItemsListOfMenu(this.clientDetails[0].registerStatus)

        if(response && response.data && response.data[0] && response.data[0].created_by){
          this.getUserNameByUserId( response.data[0].created_by)
        }
      },
      error: (error) => {
        if(error){
          this.router.navigate(['/dashboard/todos-os-clientes/1'])
        }
      }
    })
  }

  public getUserNameByUserId(userId:string){
     this.userService.getUserNameById(userId).subscribe({
      next: (response) => {
        if(response) return this.userName = response.name;
        return this.userName = 'N/A'
      },
      error: (error) => {
        console.error(error, 'Erro ao buscar o nome do usuario')
        return null
      }
    })
  }


  //Preciso verificar o satus do cliente e a permissão do usuario

  public createItemsListOfMenu(clientStatus: string) {
    const userPermissions = this.userPermissionsService.getPermissions();
    this.actionButtonElements = [];


    const isAdminOrMaster = userPermissions.includes('admin') || userPermissions.includes('master');


    if (isAdminOrMaster) {
      this.addAllButtons(clientStatus);
    } else {

      // Botão comum a todos os status
      this.addButtonIfPermitted('/assets/icons/bank.svg', 'Abrir Conta GV8', '/dashboard/admin/create-permissions', userPermissions);

      // Botões específicos para cada status
      switch (clientStatus) {
        case 'Pendente':
          this.addButtonIfPermitted('/assets/icons/contract.svg', 'Rejeitar Cliente', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/contract.svg', 'Gerar Contrato', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/userplus.svg', 'Credenciar na Adiq', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/addDoc.svg', 'Incluir Documento', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/pincel.svg', 'Editar Cadastro', '/dashboard/admin/create-permissions', userPermissions);
          break;
        case 'Aprovado':
          this.addButtonIfPermitted('/assets/icons/contract.svg', 'Gerar Contrato', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/pincel.svg', 'Editar Cadastro', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/userplus.svg', 'Credenciar na Adiq', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/addDoc.svg', 'Incluir Documento', '/dashboard/admin/create-permissions', userPermissions);
          break;

        case userPermissions.includes('master') || userPermissions.includes('admin'):
          this.addButtonIfPermitted('/assets/icons/contract.svg', 'Gerar Contrato', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/userplus.svg', 'Credenciar na Adiq', '/dashboard/admin/create-permissions', userPermissions);
          this.addButtonIfPermitted('/assets/icons/addDoc.svg', 'Incluir Documento', '/dashboard/admin/create-permissions', userPermissions);

        // Adicione mais casos conforme necessário
      }
    }
  }

  private addAllButtons(clientStatus: string) {

    if (clientStatus == 'Pendente') {
      this.actionButtonElements.push(
        {
          icon: '/assets/icons/removeIcon.svg',
          name: 'Rejeitar Cliente',
          path: '/dashboard/admin/create-permissions'
        },
        {
          icon: '/assets/icons/contract.svg',
          name: 'Gerar Contrato',
          path: '/dashboard/admin/create-permissions'
        },

        {
          icon: '/assets/icons/userplus.svg',
          name: 'Credenciar na Adiq',
          path: '/dashboard/admin/create-permissions'
        },

        {
          icon: '/assets/icons/clip.svg',
          name: 'Incluir Documento',
          path: '/dashboard/admin/create-permissions'
        },


        {
          icon: '/assets/icons/pincel.svg',
          name: 'Adicionar Nota',
          path: '/dashboard/admin/create-permissions'
        },

      )
    } else {

      this.actionButtonElements.push(

        {
          icon: '/assets/icons/contract.svg',
          name: 'Gerar Contrato',
          path: '/dashboard/admin/create-permissions'
        },

        {
          icon: '/assets/icons/userplus.svg',
          name: 'Credenciar na Adiq',
          path: '/dashboard/admin/create-permissions'
        },

        {
          icon: '/assets/icons/clip.svg',
          name: 'Incluir Documento',
          path: '/dashboard/admin/create-permissions'
        },

        {
          icon: '/assets/icons/pincel.svg',
          name: 'Adicionar Nota',
          path: '/dashboard/admin/add-information'
        },

        {
          icon: '/assets/icons/bank.svg',
          name: 'Solicitar Conta GV8',
          path: '/dashboard/admin/open-account'
        },

      );
    }


  }

  private addButtonIfPermitted(icon: string, name: string, path: string, userPermissions: string[]) {
    // Aqui você pode adicionar a lógica para verificar se o usuário tem permissão para esta ação específica
    // Por exemplo, você pode mapear nomes de ações para permissões necessárias

    const permissionMap: { [key: string]: string } = {
      'Rejeitar Cliente': 'Rejeitar Cliente',
      'Gerar Contrato': 'Gerar Contrato',
      'Credenciar na Adiq': 'Credenciar na Adiq',
      'Incluir Documento': 'Incluir Documento',
      'Abrir Conta GV8': 'Abrir Conta GV8'
    };

    const requiredPermission = permissionMap[name];

    if (requiredPermission && userPermissions.includes(requiredPermission)) {
      this.actionButtonElements.push({ icon, name, path });
    }
  }



  public showDetails(location: string, crId: string) {
    switch (location) {
      case 'adiq':
        console.log('cliente é adiq')
        this.router.navigate(['dashboard/credAdiq/acompanhar-solicitacoes', crId])
        break;

      default:
        break;
    }
  }

  public getIconSrc(status: string): string {
    switch (status) {
      case 'Rejeitado':
        return '/assets/icons/xCircleIcon.svg';
      case 'Pendente':
        return '/assets/icons/timerIcon.svg';
      default:
        return '/assets/icons/checkIcon.svg';
    }
  }


  public changeCustomerStatus(newStatus: string, crId: string) {
    this.rejectCustomerModal = false
    console.log(newStatus, 'newStatus')
    this.clientService.changeClientStatus(newStatus, crId).subscribe({
      next: (response) => {
        console.log(response, 'cliente mudou de status')
        location.reload()

      },
      error: (error) => {
        console.error(error, "Mostrando o erro da requisição")
        if (error) {
          this.ShowNotifyModal = true

          this.notifyElements = [
            {
              notifyText: error.error.error,
              notifyStatus: true,
              icon: "assets/icons/errorIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
        }
      }
    })
  }

  public socioDetails(socioId: string) {

  }

  public closeModalOfAccreditation(event: string) {
    console.log(event, 'event')
    if (event) {
      this.accreditationAdiq = false
    }
  }

  clickedButton(clickedValue: string) {
    console.log(clickedValue, 'verificando o valor que foi clicado')
  }

  public contractModal(message: any) {
    if (message === 'confirmar') {
      this.generateContract = true
      this.generateContractModal = false
    } else {
      this.generateContractModal = false
    }
  }
}


