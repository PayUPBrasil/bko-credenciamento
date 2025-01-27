import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { SessionService } from '../session/session.service';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  private tokenExpirationTimer : any;
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  private expirationDate: Date | null = null;


  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}


  setAuthTimer(token:string){
    try {
      const decodedToken: any = jwtDecode(token);
      this.expirationDate = new Date(decodedToken.exp * 1000);
      const now = new Date();
      const expiresIn = this.expirationDate.getTime() - now.getTime();

      this.tokenExpirationTimer = timer(expiresIn).subscribe(() => {
        this.logout();
      });

      this.isAuthenticated.next(true);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.isAuthenticated.next(false);
    }
  }

  private getTimeRemainingMs(): number {
    if (!this.expirationDate) {
      return 0;
    }
    const now = new Date();
    return Math.max(0, this.expirationDate.getTime() - now.getTime());
  }

  getTimeRemaining(): string {

    const remaining = this.getTimeRemainingMs();
    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / (1000 * 60)) % 60);
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  logout() {
    this.sessionService.limparSessao();
    this.isAuthenticated.next(false);
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.router.navigate(['/login']);
  }


  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticated.asObservable();
  }


}

