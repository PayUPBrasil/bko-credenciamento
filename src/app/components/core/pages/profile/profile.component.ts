import { Component, inject } from "@angular/core";
import { GetUserLoggedService } from "../../../../services/utils/getUserData.service";
import { NgIf } from "@angular/common";
import { UserService } from "../dashboard-pages/admin/users/user.service";
import { SessionService } from "../../../../services/session/session.service";
import { fadeInOut } from "../../../animations/fadeInAnimation.component";
@Component({
  selector: "app-pages-profile",
  templateUrl: "./profile.component.html",
  standalone: true,
  imports: [NgIf],
  animations: [fadeInOut]
})

export class ProfileComponent {
  public userData:any = inject(GetUserLoggedService).userInfo;
  public userSerivce = inject(UserService)
  public sessionService = inject(SessionService)
  public userName !: string;
  public hasProfilePic = false;
  public userShareLink !: string
  public sellerId!:string

  public userId = '123456'
  public showProfileActions = false
  public getUserDataService = inject(GetUserLoggedService)

  ngOnInit(): void {
      this.hasProfilePic = this.userData.profilePic && this.userData.profilePic.startsWith
      ('http')
      this.getSellerId()
  }

  public async copyInputMessage(inputElement: HTMLInputElement){
    try {
      await navigator.clipboard.writeText(inputElement.value);
      this.userShareLink = 'Link copiado com sucesso!';
      setTimeout(() => {
        this.userShareLink = `https://payup.com.br/seller/${this.sellerId}`

      }, 3000);
    } catch (err) {
      this.userShareLink = 'Falha ao copiar texto';
      setTimeout(() => {
        this.userShareLink = `https://payup.com.br/seller/${this.sellerId}`
      }, 3000);

    }
  }

  public getSellerId() {
    let userId  =  this.getUserDataService.userUUid.sub
    if(userId){
      const userId = this.getUserDataService.userUUid.sub
    this.userSerivce.getSellerId(userId).subscribe({
      next: (response) => {
        console.log(response, 'pegando o nome do vendedor'  )

        this.sellerId = response.sellerId
        this.userShareLink = `https://payup.com.br/seller/${this.sellerId}`
      },
      error: (error) => {
        console.error(error)
      }
    })
  }
}

public changeProfilePicture(event: Event) {
  // const file = (event.target as HTMLInputElement).files[0];
  // if (file) {
    // this.userService.changeProfilePicture(this.userId, file).subscribe(
    //   response => {
    //     console.log('Foto de perfil atualizada', response);
    //     // Atualizar a UI conforme necessário
    //   },
    //   (      error: any) => {
    //     console.error('Erro ao atualizar foto de perfil', error);
    //     // Tratar o erro conforme necessário
    //   }
    // );
  // }
}

}
