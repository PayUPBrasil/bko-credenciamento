import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ListRolesByIdService } from "./listRoleById.service";
import { Role, UserUsingRoleList } from "./types/role.interface";
import { TagComponent } from "../../../../layout/tag.component";
import { NgFor } from "@angular/common";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";
import { NotifyComponent } from "../../../../layout/notifyAlert.component";
import { ActionButtonList } from "../../../../../../types/actionButton.interface";

@Component({
  selector: "app-pages-admin-roleDetails",
  templateUrl: "./roleDetails.component.html",
  standalone: true,
  imports: [TagComponent, NgFor, ActionButtonComponent, NotifyComponent]
})


export class RoleDetailsComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  private listRolesByIdService = inject(ListRolesByIdService)
  private roleId!: string;
  public activeTab !: number
  public listRolesById!: Role;
  public listUserUsingRole!: UserUsingRoleList
  public router = inject(Router)
  public ShowNotifyModal = false
  public actionButtonElements: ActionButtonList = [
    {
      icon: 'assets/icons/trashIcon.svg',
      name: 'Excluir Permissão',

    }
  ]

  public notifyElements: any[] = [

  ]

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.roleId = params.get('id') || ''
    }
    )

    this.getRoleById()
  }

  public getRoleById() {

    this.listRolesByIdService.getRoleById(this.roleId).subscribe({
      next: (response) => {
        this.listRolesById = response.data.roleDetails
        this.listUserUsingRole = response.data.users
      },
      error: (error) => {
        console.error(error)
      }
    }
    )
  }

  public createANewProfile(event: any) {
    console.log(event, "Event ")
    switch (event) {
      case 'Excluir Permissão':
        this.deleteRoleByName()
        break;

      default:
        break;
    }
  }

  private deleteRoleByName() {
    this.listRolesByIdService.deleteRoleByName(this.listRolesById.name).subscribe(
      {
        next: (response) => {
          this.router.navigate(['/dashboard/admin/create-permissions'])
        },
        error: (error) => {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: error.error.error,
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta',
            }
          ]
          this.closeNotifylAutomatically()
        }
      }
    )
  }


  public removeUserFromRole(user: string) {
    this.listRolesByIdService.removeUserFromRole(user).subscribe({
      next: (response) => {
        if (response) {
          this.ShowNotifyModal = true

          this.notifyElements = [
            {
              notifyText: 'Usuário removido com sucesso!',
              notifyStatus: true,
              icon: "assets/icons/checkGreenIcon.svg",
              alt: 'Icone de Sucesso'
            }
          ]
          this.closeNotifylAutomatically()
          this.getRoleById()
        }
      },
      error: (error) => {
        this.ShowNotifyModal = true;
        this.notifyElements = [
          {
            notifyText: error.error.error,
            notifyStatus: true,
            icon: "assets/icons/alertIcon.svg",
            alt: 'Icone de alerta',
          }
        ]
        this.closeNotifylAutomatically()
        this.getRoleById()
      }
    })
  }



  public closeNotifylManually(event: any) {
    this.ShowNotifyModal = false;
    this.notifyElements = [];
  }


  public closeNotifylAutomatically(event = '') {
    setTimeout(() => {
      this.ShowNotifyModal = false
    }, 5000);
  }


}
