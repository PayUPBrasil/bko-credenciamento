import { style, animate, trigger, transition } from '@angular/animations'


export const swipeAnimation = trigger('swipeAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(3%)' }),
    animate('.4s ease-out', style({ transform: 'translateX(0%)' }))
  ]),

  transition(':leave', [
    animate('.2s ease-in', style({ opacity: 0 }))
  ])
]);
