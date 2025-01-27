import { Directive, HostListener, ElementRef, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appPhoneValidator]',
  standalone: true
})

export class PhoneValidatorDirective {

  private el = inject(ElementRef)
  private control = inject(NgControl)


  @HostListener('input', ['$event']) onInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value;

    this.phoneValidator(value)
  }

  phoneValidator(numero: string) {
    const regex = /^(?!0|9)\d{10,11}$/;
    const validNumber = regex.test(numero)
    if (!validNumber) {
      this.control.control?.setErrors({ invalidPhone: "Informe um telefone válido" });
    }
    return true
  }


}
