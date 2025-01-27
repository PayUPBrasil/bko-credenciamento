import { Directive, HostListener, ElementRef, inject } from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[appMonthYearValidator]',
  standalone: true
})

export class MonthYearValidatorDirective {

  private el = inject(ElementRef)
  private control = inject(NgControl)

  @HostListener('input', ['$event'])

  onInput($event: Event) {

    console.log("Estou realizando a validação do mes e ano")
    const inputElement = $event.target as HTMLInputElement;
    const value = inputElement.value;

    // Verifica se o formato da data está correto (dd/mm/aaaa)
    if (!/^\d{2}\/\d{4}$/.test(value)) {
      this.control.control?.setErrors({ dateInvalid: "Informe uma data válida no formato mm/aaaa" });
      return;
    }

    const partesData = value.split('/');

    const data = {
      mes: partesData[0],
      ano: partesData[1]
    };

    // Converte strings em número
    const mes = parseInt(data.mes);
    const ano = parseInt(data.ano);

    // Valida se o mês está entre 1 e 12
    if (mes < 1 || mes > 12) {
      this.control.control?.setErrors({ dateInvalid: "Mês deve estar entre 1 e 12" });
      return;
    }

    // Valida se o ano tem 4 dígitos e se é um número razoável (por exemplo, a partir de 1900 até o ano atual + 100)
    const anoAtual = new Date().getFullYear();
    if (ano < 1900 || ano > anoAtual + 100) {
      this.control.control?.setErrors({ dateInvalid: `Ano deve estar entre 1900 e ${anoAtual + 100}` });
      return;
    }

    // Se chegou até aqui, a data é válida (considerando apenas mês e ano)
    this.control.control?.setErrors(null);
    return true;
  }


}
