import { Component } from "@angular/core";
import { fadeInOut } from "../../animations/fadeInAnimation.component";
import { swipeAnimation } from "../../animations/swipeAnimation.component";
import { slideInOutAnimation } from "../../animations/slideInOutAnimation.component";

@Component({
  standalone: true,
  selector: 'app-layout-profileAside',
  templateUrl: './profileAside.component.html',
  imports: [],
  animations: [fadeInOut, swipeAnimation, slideInOutAnimation]
})

export class ProfileAsideComponent {
  animationState = 'in';

  toggleShowDiv(divName: string) {
    if (divName === 'divA') {
      console.log(this.animationState);
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
      console.log(this.animationState);
    }
  }

}
