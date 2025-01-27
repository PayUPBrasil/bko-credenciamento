import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Session } from '../../types/session.interface';

const CHAVE_ACCESS_TOKEN = "auth"

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private session = new BehaviorSubject<Session | null>(null);

  constructor() {
    this.restaurarSessao();
  }

  restaurarSessao() {
    const jsonSessao = sessionStorage.getItem(CHAVE_ACCESS_TOKEN)
    if (!jsonSessao) {
      return;
    }

    const dadosSessao: Session =
      JSON.parse(jsonSessao);
    this.session.next(dadosSessao);

  }

  salvarSessao(dadosSessao: Session) {
    sessionStorage.setItem(
      CHAVE_ACCESS_TOKEN,
      JSON.stringify(dadosSessao)
    );

    this.session.next(dadosSessao);
  }


  limparSessao() {
    sessionStorage.clear();
    this.session.next(null);
  }

  getSessao() {
    return this.session.asObservable();
  }

  estaLogado() {
    return this.session.value !== null;
  }



}
