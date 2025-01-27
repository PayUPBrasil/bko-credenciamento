import { Component, inject, OnDestroy } from "@angular/core";
import { UserService } from "./user.service";
import { Subscription } from "rxjs";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { EmailCorporateValidatorDirective } from "../../../../../../directives/validators/corporate-email-validator.directive";
import { Router } from "@angular/router";
@Component({
  selector: "app-pages-admin-createNewUser",
  templateUrl: "./createNewUser.component.html",
  imports: [ReactiveFormsModule, NgIf, NgClass, EmailCorporateValidatorDirective],
  standalone: true
})

export class CreateNewUserComponent implements OnDestroy {

  private subscription: Subscription | undefined
  private userService = inject(UserService)
  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  public errorMessage!: string;

  public createNewUserForm = this.formBuilder.group({

    name: ['Fabiana', [Validators.required]],
    email: ['fabiana.souza@payupbrasil.com.br', [Validators.required, Validators.email]],
    seller: [],

  })


  public createNewUser() {

    const { email, name, seller } = this.createNewUserForm.value

    let isSeller = seller? true : false

    console.log(isSeller, 'é seler')

    if (email && name ) {
      this.subscription = this.userService.createNewUser(name, email, isSeller).subscribe({
        next: (response) => {
          if (response.message == 'Account created successfully') {
            this.router.navigate(['/dashboard/admin/users'])
          }
        },
        error: (error) => {
          if (error.error) {
            this.errorMessage = error.error.error
          }
        }
      })
    }
  }

  public backPage() {
    this.router.navigate(['/dashboard/admin/users'])
  }
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}

