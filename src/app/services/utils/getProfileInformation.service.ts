import { inject, Injectable } from "@angular/core";
import { GetUserLoggedService

 } from "./getUserData.service";
@Injectable({
  providedIn: 'root'
})

export class GetProfileInformationService {

  private getUserLoggedService = inject(GetUserLoggedService)
  public hasProfilePic : boolean = false;

  public getUserProfilePic() : string | null{
    let profilePic = this.getUserLoggedService.getUserData().profilePic;
    if(profilePic && profilePic.startsWith('http')){
        this.hasProfilePic = true;
       return profilePic;
     } else {
      this.hasProfilePic = false;
      }
     return profilePic
  }









}
