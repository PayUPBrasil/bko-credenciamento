import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AdiqRequestByClientService } from "./adiqRequestByClient.service";
import { map, Observable, of, shareReplay, Subscription, takeUntil, tap } from "rxjs";
import { CommonModule, NgClass, NgFor, NgIf } from "@angular/common";
import { BreadcrumbComponent } from "../../../../layout/breadcrumb.component";
import { Breadcrumb } from "../../../../layout/types/breadcrumb.interface";
import { NotifyComponent } from "../../../../layout/notifyAlert.component";
import { ProposalDetailsComponent } from "../proposalDetails/proposalDetails.component";
import { ButtonPrimaryComponent } from "../../../../layout/buttons/button-primary.component";
import { UserService } from "../../admin/users/user.service";
@Component({
  selector: 'app-pages-adiq-requestByClient',
  templateUrl: './adiqRequestByClient.component.html',
  imports: [NgIf, NgClass, NgFor, BreadcrumbComponent, CommonModule, NotifyComponent, ProposalDetailsComponent, ButtonPrimaryComponent],
  standalone: true,
})

export class AdiqRequestByClientComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute)
  private adiqRequestByClientService = inject(AdiqRequestByClientService)
  protected subscription: Subscription | undefined

  private clientId!: string;
  public sendEmailRequestAdiq = '/assets/icons/sendEmail.svg'
  private router = inject(Router)
  private userService = inject(UserService)
  public ShowNotifyModal = false
  public notifyElements = [{}]
  public adiqAccreditationList: any = []

  public showProposalDetails = false;

  public last_modification_user$ = of([{}])

  private userNameCache: { [key: string]: Observable<string> } = {};

  public path: Breadcrumb[] = [
    {
      routeName: 'Dashboard',
      routePath: 'http://localhost:4200/dashboard/home'
    },
    {
      routeName: 'Clientes',
      routePath: 'http://localhost:4200/dashboard/todos-os-clientes'
    },
    {
      routeName: `Detalhes do cliente - ${this.router.url.replace(/\D/g, '')}`,
      routePath: `http://localhost:4200/dashboard/clients/details/${this.router.url.replace(/\D/g, '')}`
    },
    {
      routeName: `Credenciamentos do Cliente - ${this.router.url.replace(/\D/g, '')}`,
      routePath: `http://localhost:4200/${this.router.url}`
    }
  ];

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.clientId = params.get('id') || ''
      this.getAdiqRequestById(this.clientId)
    })
    window.scrollTo(0, 0)
  }



  //** Function to convert user id to user name

  getUserById(id: string): Observable<string> {
    if (!this.userNameCache[id]) {
       this.userNameCache[id] = this.userService.getUserById(id).pipe(
        map(user => user.name),
        shareReplay(1)
      );
    }
    return this.userNameCache[id];
  }


  public closeModal(){
    this.showProposalDetails = false
  }

  private getAdiqRequestById(crId: string) {
    this.subscription = this.adiqRequestByClientService.getAdiqRequestByClient(crId).subscribe({
      next: (response) => {
        this.accreditationToAccreditationList(response.data)
      },
      error: (error) => {
        console.log(error, 'mostrando o error aqui')

        if (error) {
          this.adiqAccreditationList = []
        }
      },
    })
  }

  public requestAdiqKey(idProposal: string) {
    this.adiqRequestByClientService.sendEmailRequestAdiqECMid(idProposal).subscribe({
      next: (response) => {
        if (response) {
          this.ShowNotifyModal = true
          this.notifyElements = [
            {
              notifyText: "E-mail enviado com sucesso!",
              notifyStatus: true,
              icon: "assets/icons/checkGreenIcon.svg",
              alt: 'Icone de Sucesso'
            }
          ]
        }
      },
      error: (error) => { console.log(error) },
    })

  }

  private accreditationToAccreditationList(accreditation: any) {
    accreditation.forEach((element: any) => {
      console.log(element, 'verificando a resposta que obtive em getAdiqRequestByClient')
      this.adiqAccreditationList.push(element)
    });
  }

  public trackByIdProposal(_index: number, item: any): string {
    return item.idProposal;
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : undefined
  }

  activeIndex: number | null = null;

  public toggleItem(index: number): void {
    if (this.activeIndex === index) {
      this.activeIndex = null;
    } else {
      this.activeIndex = index;
    }
  }


  public backToClientPage() {
    console.log("tentando voltar para pagina de clientes")
    let url = `${this.router.url.replace(/\D/g, '')}`
    this.router.navigate(['/dashboard/clients/details/' + url])
  }



  // 2e92fe5b-61fc-4e21-9214-9634598bf810







}
