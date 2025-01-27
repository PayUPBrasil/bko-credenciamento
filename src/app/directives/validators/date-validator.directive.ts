import { Directive, HostListener, ElementRef, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appDateValidator]',
  standalone: true
})

export class DateValidatorDirective {

  private el = inject(ElementRef)
  private control = inject(NgControl)



  @HostListener('input', ['$event']) onInput($event: Event) {
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value;

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      this.control.control?.setErrors({ dateInvalid: "Informe uma data válida" })
    }

    const partesData = value.split('/')

    const data = {
      dia: partesData[0],
      mes: partesData[1],
      ano: partesData[2]
    }

    // Converte strings em número
    const dia = parseInt(data.dia)
    const mes = parseInt(data.mes)
    const ano = parseInt(data.ano)

    // Dias de cada mês, incluindo ajuste para ano bissexto
    const diasNoMes = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Atualiza os dias do mês de fevereiro para ano bisexto
    if (ano % 400 === 0 || ano % 4 === 0 && ano % 100 !== 0) {
      diasNoMes[2] = 29
    }


    // Mês deve estar entre 1 e 12, e o dia deve ser maior que zero
    if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
      this.control.control?.setErrors({ dateInvalid: "Mês deve estar entre 1 e 12 e o dia deve ser maior que zero e menor que 31" })

    }
    // Valida número de dias do mês
    else if (dia > diasNoMes[mes]) {
      this.control.control?.setErrors({ dateInvalid: "Mês deve estar entre 1 e 12 e o dia deve ser maior que zero" })
    }

    return true


  }

}
