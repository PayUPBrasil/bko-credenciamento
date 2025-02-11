import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoaderComponent } from "./components/core/layout/loader.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'accreditationBackoffice';

  isLoginRoute: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      // this.isLoginRoute = this.router.url.includes('login') || this.router.url.includes('dashboard/admin/users') || this.router.url.includes('/dashboard/clients/details/');
      this.isLoginRoute = this.router.url.includes('login') || this.router.url.includes('/dashboard/clients/details/') || this.router.url.includes('/ocr/result/');
    });
  }
}
