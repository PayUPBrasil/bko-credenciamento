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
  public userName : any = ''
  public profilePic !: string;
  public token  = 'inicio'
  public userService = inject(UserService)
  public userLoggedData:any;
  public userUUid:any

   constructor(){
    this.tokenDecodedData()
   }

  public getUserData() {
     return this.userInfo = {
      name: localStorage.getItem('dXNlcg=='),
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
          if (session?.id) {
            console.log(session.id, 'id session')

            this.token =  session.id
            this.userUUid = this.decodeToken(this.token)
            console.log(this.userUUid, 'token decodificado')

            return this.getUserById(this.userUUid.sub)
          }

        },
        error: (error) => console.error(error),
      })
  }

  public getUserById(userId: any) {
  this.userService.getUserById(userId).subscribe(
    {
      next: (user) => {
        return this.userLoggedData = user
      },
      error: (error) => {
        console.error('Erro ao carregar nome do usuário:', error);
      }
    }
  )
  }

  private getProfilePic() {
     const userProfilePic = localStorage.getItem('profile')
      this.userName =  localStorage.getItem('dXNlcg==');
     if(userProfilePic === 'undefined' && this.userName) {
      return this.generateProfilePic(this.userName)
     }
     return userProfilePic
  }

  public generateProfilePic(name:string){
    return name.substring(0,1).toUpperCase()
  }

}
