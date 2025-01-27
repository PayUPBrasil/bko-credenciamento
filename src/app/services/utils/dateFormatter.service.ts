import { Injectable } from "@angular/core";

@Injectable()

export class DateFormatterService {

  //Formata a data de 10111999 para 10/11/1999
  public dateFormatter(date: string) {
    const day = date.slice(0, 2);
    const month = date.slice(2, 4)
    const year = date.slice(4)
    return `${day}/${month}/${year}`;
  }
}
