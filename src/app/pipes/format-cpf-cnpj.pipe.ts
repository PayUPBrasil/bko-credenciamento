import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCpfCnpj',
  standalone: true
})
export class FormatCpfCnpjPipe implements PipeTransform {

  transform(value: string | null): string {
    if (!value) {
      return '-';
    }

    const cleanedValue = value.replace(/\D+/g, '');


    if (cleanedValue.length === 14) {

      return cleanedValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
    } else if (cleanedValue.length === 11) {

      return cleanedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    return value;
  }
}
