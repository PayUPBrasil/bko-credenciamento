import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../admin/users/user.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { catchError, forkJoin, map, Observable, of, shareReplay, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-pages-client-detail-history',
  templateUrl: './history.component.html',
  standalone: true,
  imports: [NgFor, NgIf, CommonModule]
})

export class HistoryDetailsComponent implements OnInit {

  @Input() clientDetails: any[] = [];
  private userName!:any;
  private destroy$ = new Subject<void>();
  constructor(private userService: UserService) { }
  userNameById !:  any;

  userNames: string[] = [];


  ngOnInit() {
  this.getUserById();
  }


  getUserById(): void {
    const userIds = this.clientDetails.map(client => client.userId);

    const requests = userIds.map(id =>
      this.userService.getUserById(id).pipe(
        map(user => user.name), // Assumindo que o objeto do usuário tem uma propriedade 'name'
        catchError(error => {
          console.error(`Erro ao carregar nome do usuário ${id}:`, error);
          return of(null); // Retorna null em caso de erro
        })
      )
    );

    forkJoin(requests).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (names) => {
        this.userNames = names.filter(name => name !== null) as string[];
        console.log('Nomes dos usuários:', this.userNames);
      },
      error: (error) => {
        console.error('Erro ao carregar nomes dos usuários:', error);
      }
    });
  }


  trackByFn(index: number, item: any): string {
    return item.id;
  }



  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

  }

}
