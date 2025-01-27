import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from "./components/core/layout/aside.component";
import { NavComponent } from "./components/core/layout/nav.component";
import { LoaderComponent } from "./components/core/layout/loader.component";
import { Router } from '@angular/router';

import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsideComponent, NavComponent, LoaderComponent, NgIf],
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
