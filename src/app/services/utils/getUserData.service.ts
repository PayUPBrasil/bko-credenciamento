import { inject, Injectable } from "@angular/core";
import { SessionService } from "../session/session.service";
import { jwtDecode } from "jwt-decode";
import { UserService } from "../../components/core/pages/dashboard-pages/admin/users/user.service";

@Injectable({
  providedIn: "root"
})

export class GetUserLoggedService {

  userInfo : any = {}
  public sessionService = inject(SessionService)
  public userName = localStorage.getItem('dXNlcg==')
  public profilePic !: string;
  public token  = 'inicio'
  public userService = inject(UserService)
  public userLoggedData:any;
  public userUUid:any

   constructor(){
    this.tokenDecodedData()
   }

  public getUserData() {
    //console.log(this.userLoggedData, 'userLoggedData')
    return this.userInfo = {
      name: this.userName,
      email: "example@example.com",
      profilePic: this.getProfilePic(),
      role: "Administrador",
      permissions: ["admin", "user"]
    }
  }

  public decodeToken(token:string){
    return jwtDecode(token)
  }

  public tokenDecodedData()
{
       this.sessionService.getSessao().subscribe({
        next: (session:any) => {
          // console.log(session.id, 'id session')
          if (session?.id) {

            this.token =  session.id
            this.userUUid = this.decodeToken(this.token)

          }

        },
        error: (error) => console.error(error),
      })
  }

  public getUserById(userId: any) {
  this.userService.getUserById(userId).subscribe(
    {
      next: (user) => {
        console.log(user, 'usuario')
        this.userLoggedData = user
        console.log()
      },
      error: (error) => {
        console.error('Erro ao carregar nome do usuário:', error);
      }
    }
  )
  }

  private getProfilePic() {
     let userProfilePic = localStorage.getItem('profile')
     if(userProfilePic === 'undefined' && this.userName) {
      return this.generateProfilePic(this.userName)
     }
     return userProfilePic
  }

  public generateProfilePic(name:string){
    console.log('gerando pq nao tem nao')
    return name.substring(0,1).toUpperCase()
  }

}
