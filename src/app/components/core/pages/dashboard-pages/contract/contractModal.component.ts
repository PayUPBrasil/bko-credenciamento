import { AfterViewInit, Component, EventEmitter, inject, input, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ContractService } from "./contract.service";
import { Subscription } from "rxjs";
import { NgIf } from "@angular/common";
import { Router } from "@angular/router";
@Component({
  selector: "app-pages-contractModal",
  templateUrl: "./contractModal.component.html",
  standalone: true,
  imports: [NgIf]
})

export class ContractModalComponent implements OnDestroy, AfterViewInit, OnInit {
  private messages: string[] = [
    'Ligando a luz da sala do servidor...',
    'Preparando a impressora...',
    'Só mais um momento, quase pronto...',
    ''
  ];

  currentMessage: string = this.messages[0];
  private router = inject(Router)
  public errorAtContractGeneration = false;
  private messageIndex: number = 0;
  public loader_contractGenerator = true //*Responsável pela animação 'ligando a luz da sala do servidor...'
  private intervalId: any;
  @Input() newContract!: boolean;
  @Input() clientId!: string;
  @Input() clientDocument!: string;
  @Output() closeModalEvent = new EventEmitter<string>()
  @Output() blobExternalDownload = new EventEmitter<string>()

  private contractService = inject(ContractService)
  private subscription: Subscription | undefined
  shootExecuted: boolean = false;
  paused = true
  public pendingBlob: Blob | null = null;

  ngOnInit(): void {
    this.startMessageRotation();
  }

  ngAfterViewInit(): void {
    this.newContract ? this.generateContract(this.clientDocument) : null
  }


  public startMessageRotation(): void {
    this.intervalId = setInterval(() => {
      this.messageIndex = (this.messageIndex + 1) % this.messages.length;
      this.currentMessage = this.messages[this.messageIndex];

      // Verifica se a rotação de mensagens chegou ao final
      if (this.messageIndex === this.messages.length - 1 && !this.shootExecuted && this.errorAtContractGeneration !== true) {
        // this.shoot();
        // this.shootExecuted = true;
        this.loader_contractGenerator = false
      }
    }, 3000);
  }

  public generateContract(clientDocument: string) {
    this.contractService.generateClienContract(clientDocument).subscribe({
      next: (blob) => {
        console.log('Contrato gerado com sucesso')
        this.pendingBlob = blob
        this.errorAtContractGeneration = false
      },
      error: (error) => {
        if(error){
          this.loader_contractGenerator = false
          this.errorAtContractGeneration = true
          console.log('Não conseguiu gerar o contrato')
        }
      }
    });
  }


  public closeModal() {
    if (this.clientId) {
      let rota = `/dashboard/clients/details/${this.clientId}`
      this.router.navigate([rota])
    } else {
      this.closeModalEvent.emit()

    }
  }
  public downloadDocument() {

    if (!this.pendingBlob) {
      this.blobExternalDownload.emit()

      console.log('nao tem nada pra baixar')
    } else {
      const url = window.URL.createObjectURL(this.pendingBlob!);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    }
  }


  shoot() {
    try {
      this.confetti({
        angle: this.random(60, 120),
        spread: this.random(10, 50),
        particleCount: this.random(40, 50),
        origin: {
          y: 0.6
        }
      });
    } catch (e) {
    }
  }

  random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  confetti(args: any) {
    return (window as any)['confetti'].apply(this, arguments);
  }

  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : undefined
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}

