import { Component, inject, OnInit } from "@angular/core";
import { LoginService } from "./login.service";
import { FormBuilder, Validators, ReactiveFormsModule } from "@angular/forms";
import { ButtonPrimaryComponent } from "../../layout/buttons/button-primary.component";
import { jwtDecode } from "jwt-decode";
import { NgIf } from "@angular/common";
import { SessionService } from "../../../../services/session/session.service";
import { Router } from "@angular/router";

interface user {
  user: string;
  email: string
}
@Component({
  selector: 'app-forms-login',
  imports: [ReactiveFormsModule, ButtonPrimaryComponent],
  templateUrl: './loginForm.component.html',
  styleUrl: './loginForm.component.scss',
  standalone: true
})

export class LoginFormComponent {
  public inputPassType = 'password'
  public passwordIcon = '/assets/icons/eyeOpen.svg'
  public errorMsg = ''
  private loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);
  private sessionService = inject(SessionService);
  private router = inject(Router)
  public loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  })


  //* Function to hidden or show password at input field
  public showPassword() {
    if (this.inputPassType === 'password') {
      this.inputPassType = 'text'
      this.passwordIcon = '/assets/icons/eyeClose.svg'
    } else {
      this.inputPassType = 'password'
      this.passwordIcon = '/assets/icons/eyeOpen.svg'
    }
  }

  // Propriedades utilizadas no botão de continuar
  public data = {
    title: 'Entrar',
    color: 'text-white',
    bg_color: 'bg-red-500',
    aria_label: 'Botão de Continuar',
    disabled: false,
    loadingStatus: 'hidden',
  }


  //* Method to make login at plataform

  public doLogin() {
    this.data.disabled = true
    console.log('cliquei no botao ')
    this.data.loadingStatus = "visible"
    const formValues = this.loginForm.value
    const { username, password } = formValues


    if (username && password) {
      this.loginService.loginUser(username, password).subscribe({
        next: (response) => {
          this.sessionService.salvarSessao(response.message)
          const userToken = jwtDecode(response.message.id)
          this.me(userToken.sub || '')
        },
        error: (error) => {
          this.data.disabled = false
          console.log(error, 'mostrando o error no login')
          if (error) {
            this.data.loadingStatus = "hidden"
            switch (error.error.error) {
              case "Usuário não possui perfil atrelado.":
                this.errorMsg = "Um gestor deve aprovar sua conta, por favor, comunique seu superior."
                break;

              case "Você não tem permissão para acessar o sistema. Comunique seu gestor.":
                this.errorMsg = "Você não tem permissão para acessar o sistema, por favor, comunique seu superior."
                break;

              case "Usuário não localizado!":
                this.errorMsg = "Usuário não cadastrado no sistema. Entre em contato com o seu superior."
                break;

              default: this.errorMsg = "Não foi possível realizar o login, contate o administrador do sistema."
                break;
            }
            setTimeout(() => {
              this.errorMsg = ''
            }, 5000)
          }
        }
      })
    }
  }

  public me(token: string) {
    this.loginService.me(token).subscribe({
      next: (response) => {
        localStorage.setItem('dXNlcg==', response.data.name)
        localStorage.setItem('profile', response.data.profilePic)
        if (response) {
          // this.data.routerLink = "dashboard/home"
          // this.router.navigate(['dashboard/home'])
          this.router.navigate(['dashboard/consultar-cliente'])
        }
      },
      error: (error) => {
        this.data.disabled = false
        console.log(error, 'verificando o erro mesmo que desconhecido')
        this.errorMsg = 'Não foi possível acessar o sistema. Entre em contato com o suporte.'
      }
    })
  }


}
