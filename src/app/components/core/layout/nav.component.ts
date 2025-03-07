import { Component, inject, ChangeDetectorRef, OnInit, HostListener, ElementRef, OnDestroy } from "@angular/core";
import { NgIf } from "@angular/common";
import { SessionService } from "../../../services/session/session.service";
import { Router, RouterLink } from "@angular/router";
import { slideInOutAnimation } from "../../animations/slideInOutAnimation.component";
import { fadeInOut } from "../../animations/fadeInAnimation.component";
import { GetUserLoggedService } from "../../../services/utils/getUserData.service";
import { AuthService } from "../../../services/Auth/auth.service";


@Component({
  selector: "app-layout-nav",
  templateUrl: "./nav.component.html",
  standalone: true,
  imports: [ NgIf, RouterLink ],
  animations: [slideInOutAnimation, fadeInOut]
})

export class NavComponent  implements OnInit, OnDestroy {


  public showProfile = false;
  protected decodedToken!: string | undefined;
  private sessionService = inject(SessionService)
  private authService = inject(AuthService)
  private getUserLoggedService = inject(GetUserLoggedService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)
  protected _eref = inject(ElementRef)
  public dropdownIcon = 'assets/icons/arrow-down-outline.svg'
  public hasProfilePic = false;
  public profileUrl !: string | null;
  public leftLoginTimer !: any
  private timerInterval:any;
  public userInfo !: any


  constructor(){
    this.updateTime()
    this.leftLoginTimer = this.authService.getTimeRemaining()
  }

  ngOnInit() {
    this.startTimer();
    this.getUser()
    this.profilePicture()
  }

  profilePicture(){
    this.profileUrl = this.getUserProfilePic();
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

updateTime() {
  this.leftLoginTimer = this.authService.getTimeRemaining();
  if (this.authService.getTimeRemaining() < '1') {
    const sessionId = sessionStorage.getItem('auth');
    if (sessionId) {
      const start = sessionId.indexOf('"id":"');
      if (start !== -1) {
        const actualStart = start + '"id":"'.length;
        const end = sessionId.indexOf('"', actualStart);
        if (end !== -1) {
          const id_value = sessionId.substring(actualStart, end);
          this.authService.setAuthTimer(id_value);
        }
      }
    }
  }
}


  public getUser() {
    console.log('estou no navbarcomponent chamando a funcao getUserData')
    return this.getUserLoggedService.getUserData()
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this._eref.nativeElement.contains(event.target)) {
      this.showProfile = false;
      if (this.showProfile == false) this.dropdownIcon = 'assets/icons/arrow-down-outline.svg'
    }
  }

  public logoff() {
    this.sessionService.limparSessao()
    localStorage.removeItem('dXNlcg==')
    localStorage.removeItem('profile')
    this.router.navigate(['/'])
  }

  public toggleProfile() {
    console.log('chamei a funcao')
    this.showProfile = !this.showProfile;
    this.cdr.detectChanges();
    if (this.showProfile == false) this.dropdownIcon = 'assets/icons/arrow-down-outline.svg'
    else this.dropdownIcon = 'assets/icons/arrow-up.svg'
  }

  public getUserProfilePic() : string | null{
    let profilePic = this.getUserLoggedService.userInfo.profilePic;

    if(profilePic && profilePic.startsWith('http')){
        this.hasProfilePic = true;
       return profilePic;
     } else {
      this.hasProfilePic = false;
      }
      console.log(profilePic, 'verificando a foto do pergil profilePic')
     return profilePic
  }

  ngOnDestroy(): void {
    if(this.timerInterval){
      clearInterval(this.timerInterval);
    }
  }

}

