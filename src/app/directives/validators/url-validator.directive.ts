import { Directive, ElementRef, HostListener, inject, Inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appUrlValidator]',
  standalone: true
})

export class UrlValidatorDirective {

  private el = inject(ElementRef)
  private control = inject(NgControl)

  @HostListener('input', ['$event']) onInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value;

    if (value.includes('https://')) {
      this.isValidHtpUrl(`${value}`)
    } else {
      this.isValidHtpUrl(`https://${value}`)
    }
  }


  private isValidHtpUrl(el: string) {
    let url;

    let regex = /^(?:https?:\/\/)?(w{3}\.)?[\w_-]+((\.\w{2,}){1,2})(\/([\w\._-]+\/?)*(\?[\w_-]+=[^\?\/&]*(\&[\w_-]+=[^\?\/&]*)*)?)?$/gm;
    let validation = regex.test(el)

    if (!validation) {
      this.control.control?.setErrors({ invalidUrl: "Informe uma url válida!" })
    }
  }

}
