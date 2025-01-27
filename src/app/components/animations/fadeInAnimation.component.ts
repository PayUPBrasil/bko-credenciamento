import { animation, style, animate, trigger, transition, useAnimation } from '@angular/animations'


export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [style({ opacity: 0 }), animate('.2s ease-out', style({ opacity: 1 }))]),
  transition(':leave', [animate('.2s ease-in', style({ opacity: 0 }))])
]);
