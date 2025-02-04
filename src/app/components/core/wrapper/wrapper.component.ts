import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AsideComponent } from "../layout/aside.component";
import { NavComponent } from "../layout/nav.component";
import { NgClass } from "@angular/common";

@Component ({
  selector: 'app-wrapper',
  imports: [RouterOutlet, AsideComponent, NavComponent, NgClass],
  templateUrl: './wrapper.component.html',
  standalone:true
})

export class WrapperComponent {
  isSideBarOpen = true;
  expandScreen = true

  toggleSideBarSatus(event:any){
      this.expandScreen = !this.expandScreen
  }
}
