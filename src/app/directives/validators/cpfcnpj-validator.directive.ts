import { Directive, HostListener, ElementRef } from '@angular/core';
import { AbstractControl, NgControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Directive({
  selector: '[appCpfCnpjValidator]',
  standalone:true
})

export class CpfCnpjValidatorDirective {

  static validateCpf(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cpf = control.value?.replace(/[^\d]+/g, '');
      if (cpf && cpf.length === 11) {
        // Implementar a lógica de validação do CPF aqui
        const isValid = CpfCnpjValidatorDirective.isValidCpf(cpf);
        return isValid ? null : { cpfInvalid: true };
      }
      return null;
    };
  }

  private static isValidCpf(cpf: string): boolean {
    if (cpf === new Array(11).fill(cpf[0]).join('')) return false;

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;

    return true;
  }

  static validateCnpj(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const cnpj = control.value?.replace(/[^\d]+/g, '');
      if (cnpj && cnpj.length === 14) {
        const isValid = CpfCnpjValidatorDirective.isValidCnpj(cnpj);
        return isValid ? null : { cnpjInvalid: true };
      }
      return null;
    };
  }


  private static isValidCnpj(cnpj: string): boolean {
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;



    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;

    if (cnpj === new Array(14).fill(cnpj[0]).join('')) return false;


    return true;
  }


  constructor(private el: ElementRef, private control: NgControl) { }

  @HostListener('input', ['$event']) onInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value.replace(/\D/g, '');

    if (value.length === 11) {
      this.control.control?.setErrors(this.isInvalidCpf(value) ? { cpfInvalid: true } : null);
    } else if (value.length === 14) {
      this.control.control?.setErrors(this.isInvalidCnpj(value) ? { cnpjInvalid: true } : null);
    } else {
      this.control.control?.setErrors(null);
    }
  }

  private isInvalidCpf(cpf: string): boolean {
    console.log(cpf, 'verificando o cpf')
    let sum = 0;
    let remainder = 0;

    if (cpf === new Array(11).fill(cpf[0]).join('')) return true; // Todos os dígitos iguais

    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return true;

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return true;

    return false;
  }

  private isInvalidCnpj(cnpj: string): boolean {
    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return true;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return true;

    return false;
  }
}
