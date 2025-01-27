import { Component, inject } from "@angular/core";
import { BreadcrumbComponent } from "../../../../layout/breadcrumb.component";
import { ListPermissionService } from "./listPermission.service";
import { ListRolesService } from "./listRoles.service";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { Breadcrumb } from "../../../../layout/types/breadcrumb.interface";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { TagComponent } from "../../../../layout/tag.component";
import { CreateRolesService } from "./createNewRole.service";
import { Location } from "@angular/common";
import { ErrorAlertComponent } from "../../../../layout/errorAlert.component";
import { Router } from "@angular/router";
import { Permission } from "./types/permission.interface";
import { Role } from "./types/role.interface";
import { ActionButtonList } from "../../../../../../types/actionButton.interface";

@Component({
  selector: 'app-pages-admin-create-permissions',
  imports: [BreadcrumbComponent, NgFor, NgIf, NgClass, ActionButtonComponent, TagComponent, ErrorAlertComponent],
  templateUrl: './createPermissions.component.html',
  standalone: true,
  animations: [fadeInOut]
})

export class CreatePermissionsComponent {
  private listPermissionService = inject(ListPermissionService)
  private listRolesService = inject(ListRolesService)
  private createRolesService = inject(CreateRolesService)
  public location = inject(Location)
  public createProfile = false;
  public listPermissions: Array<Permission> = []
  public listRoles: Array<Role> = []
  public permissionSelected: any[] = []
  public errorData: any;

  private router = inject(Router)

  ngOnInit(): void {
    this.getAllPermissions()
    this.getAllRoles()
  }

  public getAllPermissions() {
    this.listPermissionService.getPermission().subscribe((response) => {

      for (let i = 0; i < response.data.length; i++) {
        this.listPermissions.push(response.data[i])
      }
    },
      (error) => {
        console.error(error);

      }
    )
  }

  //Roles
  public getAllRoles() {
    this.listRolesService.getRoles().subscribe(
      (res) => {
        for (let i = 0; i < res.data.length; i++) {
          if (!this.listRoles.includes(res.data[i].name)) {
            this.listRoles.push(res.data[i]);
          }
        }
      },
      (error) => {
        console.error(error);
      }
    )
  }

  public showRoleDetails(roleId: String) {
    this.router.navigate(['/dashboard/admin/role', roleId])
  }

  // Rotas para breadcrumb
  public path: Breadcrumb[] = [
    {
      routeName: 'Admin',
      routePath: 'http://localhost:4200/dashboard/admin'
    },
    {
      routeName: 'Criar Permissões',
      routePath: 'http://localhost:4200/dashboard/admin/create-permissions'
    }
  ];

   public actionButtonElements: ActionButtonList  = [
    {
      icon: `/assets/icons/userplus.svg`,
      name: 'Criar Perfil',
      path: '/dashboard/admin/create-permissions'
    }
  ]

  public checkedItemList(event: any, permissionName: string) {

    if (event.target.checked && !this.permissionSelected.includes(permissionName)) {
      this.permissionSelected.push(permissionName)
    } else {
      this.permissionSelected = this.permissionSelected.filter((removedItem) => removedItem != permissionName)
    }
    console.log(this.permissionSelected)
  }

  public createANewProfile(event: any) {
    this.createProfile = !this.createProfile

    if (event == false) {
      this.permissionSelected = []
    }
  }

  public createRole(name: string) {
    console.log("Acerssei o create ROle")
    this.createRolesService.createNewRole(name, this.permissionSelected).subscribe(
      (res) => {
        if (res.message) {
          this.createANewProfile('')
          location.reload();
        }
      },
      (err) => {
        //Tratamento de erros
        if (err.error.error === 'Role já existe!') {
          this.errorData = "Já existe um perfil com este nome."
        } else if (err.error.error === "O campo *Name* é obrigatório") {
          this.errorData = "Você precisa informar um nome válido para o perfil."
        }
        else if (err.error.error === "O campo *permissionNames* é obrigatório") {
          this.errorData = "Você precisa selecionar ao menos uma permissão!"
        }

        else if (err.error.error === "O campo *Name* é obrigatório,O campo *permissionNames* é obrigatório") {
          this.errorData = "Você precisa preencher o nome e selecionar permissões"
        } else {
          this.errorData = "Erro ao criar perfil, tente novamente mais tarde"
        }

        setTimeout(() => {
          this.errorData = ''
        }, 5000)
      }
    )
  }

}
