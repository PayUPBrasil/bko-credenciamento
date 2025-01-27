import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { UserService } from "./user.service";
import { User } from "./types/user.interface";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { NotificationsComponent } from "../../../../layout/notifications.component";
import { NotifyComponent } from "../../../../layout/notifyAlert.component";
import { SearchInputComponent } from "../../../../layout/searchInput.component";
import { HamburgerMenuComponent } from "../../../../layout/buttons/hamburgerMenu.component";
import { ModalComponent } from "../../../../layout/modal.component";
import { UserEditRoleModalComponent } from "./userEditRole.component";
import { Subscription } from "rxjs";
import { ListRolesByIdService } from "../create-permissions/listRoleById.service";
import { ActionButtonList } from "../../../../../../types/actionButton.interface";
import { PaginationComponent } from "../../../../layout/pagination.component";
@Component({
  selector: 'app-pages-admin-users',
  imports: [RouterLink, ActionButtonComponent, NgIf, NgFor, NgClass, NotificationsComponent, NotifyComponent, SearchInputComponent, HamburgerMenuComponent, ModalComponent, UserEditRoleModalComponent, PaginationComponent],
  templateUrl: './users.component.html',
  standalone: true,
  animations: [fadeInOut]
})

export class UsersComponent implements OnInit, OnDestroy {

  check !: any
  showActionModal: any = false

  private userService = inject(UserService)
  private listRolesByIdService = inject(ListRolesByIdService)

  public users: Array<User> = []
  public userFiltered: Array<User> = []
  public noResultsMessage = ''
  public showModalUserEditData = false
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private subscription: Subscription | undefined
  public page !:number;
  public notifyElements!: any[]
  public ShowNotifyModal: boolean = false;
  public totalPages: number[] = [];

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = +params['page']
      this.getAllUsers(this.page)
    })
  }

  public userEditData: any[] = [
    {
      userName: '',
      userId: '',
      role: ''
    }
  ]


  public detalhesDoUsuario: any[] = [
    {
      icon: `/assets/icons/pincel.svg`,
      name: 'Editar Permissão',
      path: '/dashboard/admin/create-permissions',
    },
    {
      icon: `/assets/icons/trashIcon.svg`,
      name: 'Excluir Permissão',
      path: '/dashboard/admin/create-permissions',
    },

    {
      icon: `/assets/icons/usercross.svg`,
      name: 'Inativar Usuário',
      // path: '/dashboard/admin/create-permissions',
    },

    {
      icon: `assets/icons/reload.svg`,
      name: 'Resetar Senha',
      // path: '/dashboard/admin/create-permissions',
    },

    {
      icon: `/assets/icons/userplus.svg`,
      name: 'Ativar Usuário',
      // path: '/dashboard/admin/create-permissions',
    },

  ]

  public actionButtonElements: ActionButtonList = [
    {
      icon: `/assets/icons/userplus.svg`,
      name: 'Criar Usuário',
      path: '/dashboard/admin/create-user'
    }

  ]


  public getAllUsers(page = 1) {
    this.subscription = this.userService.listAllActiveUsers(page).subscribe({
      next: (response) => {
        this.users = response.clients
        this.userFiltered = this.users
        console.log(response.clients)

        let arr = []
        for(let i = 0; i < response.clients[0].totalPages; i++){
          arr.push(i + 1)
        }
        this.totalPages = arr.filter((item, index) => arr.indexOf(item) === index);
      },
      error: (error) => {
        console.error(error)
      }
    })
  }

  public filterUsers() {
    // userFiltered
  }

  // @ Função para buscar um usuário no input de busca

  public inputValue(event: any) {
    this.userFiltered = this.users.filter(users => {
      return users.name.toLowerCase().includes(event.toLowerCase())
    })

    if (this.userFiltered.length == 0) {

      this.noResultsMessage = "Não localizado";
    } else {
      this.noResultsMessage = "";
    }
  }


  public menuHamburgerClickedItem(event: any, userId: string) {

    console.log(event, 'event')

    switch (event) {
      case 'Criar Usuário':
        this.router.navigate(['/dashboard/admin/create-user'])
        break;

      case 'Editar Permissão':
        this.editPermission(userId)
        break;

      case 'Inativar Usuário':
        this.deactivateUser(userId)
        break;

      case 'Ativar Usuário':
        this.reactiveUser(userId)
        break;

      case 'Excluir Permissão':
        this.removeRoleFromUser(userId)
        break;

      case 'Resetar Senha':
        this.resetUserPassword(userId)
        break;

      default:
        break;
    }
  }

  public removeRoleFromUser(userId: string) {
    this.listRolesByIdService.removeUserFromRole(userId).subscribe({
      next: (response) => {
        if (response) {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: "Permissão removida com sucesso!",
              notifyStatus: true,
              icon: "assets/icons/checkGreenIcon.svg",
              alt: 'Icone de Sucesso'
            }
          ]
          this.getAllUsers()
        }
      },
      error: (error) => {
        this.ShowNotifyModal = true
        if (error.error.error) {
          this.notifyElements = [
            {
              notifyText: error.error.error,
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
          this.closeModalAutomatically()
        }

      }
    })

  }

  public resetUserPassword(userId: string) {

    this.userService.resetPassword(userId).subscribe({
      next: (response:any) => {
        if (response) {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: "Senha resetada com sucesso!",
              notifyStatus: true,
              icon: "assets/icons/checkGreenIcon.svg",
              alt: 'Icone de Sucesso'
            }
          ]
        }
      },
      error: (error) => {
        this.ShowNotifyModal = true
        if (error.error.error) {
          this.notifyElements = [
            {
              notifyText: error.error.error,
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
          this.closeModalAutomatically()
        }
      }

    })

  }
  public editPermission(userId: string) {
    this.userService.getUserById(userId).subscribe({
      next: (response) => {
        if (response.role.includes('master')) {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: "Você não tem permissão para realizar essa alteração.",
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]

          this.closeNotifyModal('close')
        } else {
          this.showModalUserEditData = true
        }

        this.userEditData[0]['role'] = response.role;
        this.userEditData[0]['userId'] = userId;
        this.userEditData[0]['userName'] = response.name;

      },
      error: (error) => {
        this.ShowNotifyModal = true
        this.notifyElements = [
          {
            notifyText: error.error.error,
            notifyStatus: true,
            icon: "assets/icons/alertIcon.svg",
            alt: 'Icone de alerta'
          }
        ]

      }
    })
  }

  public deactivateUser(userId: string) {
    this.subscription = this.userService.deleteUser(userId).subscribe({
      next: (response) => {
        this.getAllUsers()
        this.ShowNotifyModal = true
        this.notifyElements = [
          {
            notifyText: 'Usuário inativado com sucesso!',
            notifyStatus: true,
            icon: "assets/icons/checkGreenIcon.svg",
            alt: 'Icone de Sucesso'
          }
        ]
        this.closeModalAutomatically()
      },
      error: (error) => {
        this.ShowNotifyModal = true
        this.notifyElements = [
          {
            notifyText: error.error.error,
            notifyStatus: true,
            icon: "assets/icons/alertIcon.svg",
            alt: 'Icone de alerta'
          }
        ]
        this.closeModalAutomatically()
      }
    })
  }


  public reactiveUser(userId: string) {
    console.log(userId, 'verificando o id do usuário')

    if (userId) {
      this.subscription = this.userService.reactiveUser(userId).subscribe({
        next: (response) => {
          if (response) {
            this.getAllUsers()
            this.ShowNotifyModal = true
            this.notifyElements = [
              {
                notifyText: 'Usuário habilitado com sucesso!',
                notifyStatus: true,
                icon: "assets/icons/checkGreenIcon.svg",
                alt: 'Icone de Sucesso'
              }
            ]
            this.closeModalAutomatically()
          }
        },
        error: error => {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: error.error.error,
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
          this.closeModalAutomatically()
        }
      })
    }
    else {
      this.ShowNotifyModal = true
      this.notifyElements = [
        {
          notifyText: "Ocorreu um erro ao tentar habilitar o usuário. Entre em contato com o administrador do sistema.",
          notifyStatus: true,
          icon: "assets/icons/alertIcon.svg",
          alt: 'Icone de alerta'
        }
      ]

    }
  }

  public closeNotifyModal(event: string) {
    if (event) {
      this.ShowNotifyModal = false
    }
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : undefined
  }

  public closeRoleEditModal(event: string) {
    if (event) {
      this.showModalUserEditData = false
    }
  }

  private closeModalAutomatically() {
    setTimeout(() => {
      this.closeNotifyModal('close')
    }, 5000);
  }

}
