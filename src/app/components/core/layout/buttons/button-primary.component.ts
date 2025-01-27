import { Component, inject, Input } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../types/button.interface';

@Component({
  standalone: true,
  selector: 'app-layout-buttons-primary-button',
  imports: [NgClass, NgIf, RouterLink],
  templateUrl: './button-primary.component.html',
})

export class ButtonPrimaryComponent {
  @Input() data !: Button;

  public router = inject(Router)

  public goTo(){
    setTimeout(() => {
      // this.router.navigate([this.data.routerLink])
      console.log('não tenho routerlink para ser direcionado e por isso vou reportar um erro.')
    }, 2000)
  }

}
