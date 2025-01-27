import { style, animate, trigger, transition } from '@angular/animations'


export const swipeUpAnimation = trigger('swipeUpAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('.6s ease-out', style({ transform: 'translateY(0%)' }))
  ]),

]);
