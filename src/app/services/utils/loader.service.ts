import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  show(): void {
    setTimeout(() => this.isLoadingSubject.next(true), 0);
  }

  hide(): void {
    setTimeout(() => this.isLoadingSubject.next(false), 0);
  }
}
