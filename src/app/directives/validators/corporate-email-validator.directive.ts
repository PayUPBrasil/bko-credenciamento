import { Directive, HostListener, ElementRef, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appEmailCorporateValidator]',
  standalone: true
})

export class EmailCorporateValidatorDirective {

  private el = inject(ElementRef)
  private control = inject(NgControl)


  @HostListener('input', ['$event']) onInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value;
    this.emailCorporateValidator(value)
  }

  emailCorporateValidator(email: string) {
    if (!email.includes('payupbrasil.com.br') && !email.includes('gv8capital.com.br')) {
      this.control.control?.setErrors({ invalidCorporateEmail: "Informe um corporativo válido" });
    }
    return true
  }


}
