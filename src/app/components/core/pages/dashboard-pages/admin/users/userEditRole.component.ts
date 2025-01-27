import { NgFor, Location, NgIf } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { ListRolesService } from "../create-permissions/listRoles.service";
import { UserService } from "./user.service";

@Component({
  selector: 'app-pages-admin-userEditRoleModal',
  templateUrl: './userEditRole.component.html',
  standalone: true,
  imports: [NgFor, NgIf]

})

export class UserEditRoleModalComponent implements OnInit {

  @Input() userEditRole: any = []
  @Output() button = new EventEmitter<string>();
  private userService = inject(UserService)
  protected location = inject(Location)

  ngOnInit(): void {
    this.allRolesActive()
    console.log(this.userEditRole, 'Mostrando o user Edit Role')
  }

  public roleList: any = []

  private listRolesService = inject(ListRolesService)

  public allRolesActive() {
    this.listRolesService.getRoles().subscribe({
      next: (response) => { this.roleList = response.data },
      error: (error) => { console.error(error) }
    })
  }

  public assignRoleToUser() {
    // userId: '',
    // roleName: '',
  }

  public salvar(selectedRole: string) {
    let userId = this.userEditRole[0].userId
    let roleName = selectedRole

    this.userService.assingRoleToUser(userId, roleName).subscribe({
      next: (response) => {
        if (response.message === "Role assigned successfully") {
          location.reload();
        }
      },
      error: (error) => {
        console.error(error, "Mostrando o resultado de assingRoleToUser, em error")
      }
    }
    )
  }


  public cancel() {
    this.button.emit('close edit role modal')
  }
}
