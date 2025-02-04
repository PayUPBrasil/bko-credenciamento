import { NgIf } from "@angular/common";
import { Component, EventEmitter, inject, Output } from "@angular/core";
import { Session } from "../../../types/session.interface";
import { SessionService } from "../../../services/session/session.service";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { jwtDecode } from "jwt-decode";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
  selector: "app-layout-aside",
  imports: [NgIf, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: "./aside.component.html",
  standalone: true,
  animations: [
    trigger('slideInOut', [
      state('closed', style({
        transform: 'translateX(calc(-100%))'
      })),
      state('open', style({
        transform: 'translateX(0)'
      })),
      transition('open => closed', [
        animate('300ms ease-in-out')
      ]),
      transition('closed => open', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})


export class AsideComponent {

  @Output() sideBarState = new EventEmitter<boolean>();

  session$: Observable<Session | null>;
  decodedToken!: any;
  private sessionService = inject(SessionService)


  constructor() {
    this.session$ = this.sessionService.getSessao()

    this.session$.subscribe({
      next: (session) => {
        if (session?.id) {
          this.decodedToken = jwtDecode(session?.id)
          console.log(typeof(this.decodedToken), 'tipo do token decodificado')
        }
      },
      error: (error) => console.error(error),
    })
  }

  public hasAccess(permissions: string[]): boolean {
    return this.decodedToken.permissions.some((val: any) => permissions.includes(val))
  }



  public showMenu = false;
  public showMenuPinBank = false;
  public showAdminOptions = false;

  public dropdownIconshowAdminOptions = 'assets/icons/arrow-down-outline.svg'
  public dropdownIconshowAAdiqOptions = 'assets/icons/arrow-down-outline.svg'

  toggleShowAdminOptions() {
    this.showAdminOptions = !this.showAdminOptions
    if (this.showAdminOptions) {
      this.dropdownIconshowAdminOptions = 'assets/icons/arrow-up.svg'
    } else {
      this.dropdownIconshowAdminOptions = 'assets/icons/arrow-down-outline.svg'

    }
  }

  toggleShowAdiqOptions() {
    this.showMenu = !this.showMenu;
    if (this.showMenu) {
      this.dropdownIconshowAAdiqOptions = 'assets/icons/arrow-up.svg'
    } else {
      this.dropdownIconshowAAdiqOptions = 'assets/icons/arrow-down-outline.svg'
    }
  }

  // changeIconToggleIcon() {
  //   this.dropdownIcon = this.dropdownIcon == 'assets/icons/arrow-down-outline.svg' ? 'assets/icons/arrow-up.svg' : 'assets/icons/arrow-down-outline.svg'
  // }

  isSidebarOpen= true

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sideBarState.emit(this.isSidebarOpen);
  }
}
