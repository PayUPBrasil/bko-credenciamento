import { NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProductListConfigurationComponent } from "./productListConfiguration.component";
import { TecnologyTableAdiq } from "../../../../../../services/utils/tecnologyTableAdiq.service";
import { CommonModule } from "@angular/common";
import { NewAccreditationService } from "./newAccreditation.service";
import { Router } from "@angular/router";
import { lastValueFrom, Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { AccreditationModalComponent } from "./accreditationModal.component";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { SessionService } from "../../../../../../services/session/session.service";
@Component({
  selector: "app-pages-newAccreditationModal",
  templateUrl: "./newAccreditationModal.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, ProductListConfigurationComponent,  CommonModule, AccreditationModalComponent],
  animations: [fadeInOut]
})

export class NewAccreditationModalComponent implements OnInit, OnDestroy {

  @Input() clientDocument !: string;
  @Input() type !: string;
  @Output() closeModalAccreditation = new EventEmitter<string>();

  private formBuiler = inject(FormBuilder)
  public produtosAdicionados: any = []
  public tecnologyTableAdiq = inject(TecnologyTableAdiq)
  public doAccreditation = false
  public newAccreditationService = inject(NewAccreditationService)
  protected router = inject(Router)
  protected subscription: Subscription | undefined
  public productIcon!: any;
  public errorMessage = ''
  public clientId = ''
  private sessionService = inject(SessionService)

  public AdiqAccreditationModalForm = this.formBuiler.group({
    mid: ['93996', [Validators.required]],
    idCanal: ['170001', [Validators.required]],
    paymentType: ['1', [Validators.required]],
    tecnologyCode: ['', [Validators.required]],
    qtSolution: ['', [Validators.required]],
    cnae: ['', []],

    codMcc: ['1', [Validators.required]],
    descMcc: ['CONSTRUCAO', [Validators.required]],
    combo: ['COMBO FAC CERT 9', [Validators.required]],
    taxa: ['TAXA FAC CERT 9', [Validators.required]],
    sendEmailAdiqAutomatically: []
  })

  ngOnInit(): void {
    console.log('clientDocument', this.clientDocument)
    console.log(this.tecnologyTableAdiq.getTecnologyTableAdiq())

    this.sessionService.getSessao().subscribe({
      next: (sessao) => {
        sessao ? this.clientId = sessao.id : this.clientId = '';
      },
      error: (error) => {
        console.error('Erro ao buscar sessão', error);
      }
    })
  }



  public async doNewAccreditation() {
    this.doAccreditation = true

    // Manipulando o ícone que aparece durante o credenciamento do modal 'doAccreditation'
    this.productIcon = {};

    for (const productCode of this.produtosAdicionados) {
      this.productIcon[productCode.terminais.posTerminal.tecnologyCode] = '/assets/icons/clockIcon.svg';
    }

    for (const productCode of this.produtosAdicionados) {

      console.log(this.produtosAdicionados)
      this.productIcon[productCode.terminais.posTerminal.tecnologyCode] = '/assets/icons/loadingAnimation.gif';

      let accreditationEnterprise = 'adiq'

      try {

        const document = this.clientDocument

        const dados = {
          codMcc: productCode.codigo,
          descMcc: productCode.descricao,
          cnae: productCode.cnae,
          combo: productCode.combo,
          taxa: productCode.taxa,
          tecnologyCode: productCode.terminais.posTerminal.tecnologyCode,
          qtSolution: productCode.terminais.qt,
        };

        const res = await lastValueFrom(this.newAccreditationService.accreditationAdiq(dados, accreditationEnterprise, this.type, document, this.clientId))

        console.log(res, 'res')

        if (res.data) {
          this.productIcon[productCode.terminais.posTerminal.tecnologyCode] = '/assets/icons/confirmIcon.svg';
        }

      } catch (error) {
        console.log(error, 'error')
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = error.error.error

          setTimeout(() => {
            this.errorMessage = ''
          }, 9000)
        }
        this.productIcon[productCode.terminais.posTerminal.tecnologyCode] = '/assets/icons/errorIcon.svg';
      }
    }

  }

  public closeNewAccreditationModal() {

  }

  //*@Funções responsáveis por adicionar e remover elementos do array de configuração de produtos, onde clico em `adicionar produto` no html
  public addProd() {
    let formValues = this.AdiqAccreditationModalForm.value

    const dados = {
      codigo: formValues.codMcc,
      descricao: formValues.descMcc,
      cnae: formValues.cnae,
      combo: formValues.combo,
      taxa: formValues.taxa,
      terminais: {
        posTerminal: {
          tecnologyCode: formValues.tecnologyCode
        },
        qt: formValues.qtSolution
      }
    }

    if (this.produtosAdicionados.length > 0) {
      const existe = this.produtosAdicionados.some((produtosExistentes: any) => {
        return produtosExistentes.terminais.posTerminal.tecnologyCode === dados.terminais.posTerminal.tecnologyCode
      })

      if (!existe) {
        this.produtosAdicionados.push(dados)
      }
    } else if (dados.terminais.posTerminal.tecnologyCode) {
      this.produtosAdicionados.push(dados)
    }
  }

  //* @ Responsável por excluir um valor do array
  public removeProd(productId: string) {
    this.produtosAdicionados = this.produtosAdicionados.filter((produtos: any) => {
      return produtos.terminais.posTerminal.tecnologyCode !== productId
    })
  }

  //* @ Responsável por fechar o modal de credenciamento e encaminhar o usuario para os detalhes do cadastro recém feito.
  public closeModalOfAccreditation(event: string) {
    console.log(event, 'mostrando o evento')
    // this.doAccreditation = false
    // let crId = this.newAccreditationService.getCrId()
    // this.goToClientDetails(crId)

    this.closeModalAccreditation.emit(event)
  }

  //* @ Direciona o usuário para o cadastro recém feito.
  public goToClientDetails(crId: string) {
    console.log(crId, 'crId')
    this.router.navigate(['/dashboard/clients/details', crId])
  }


  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : undefined
  }

}

