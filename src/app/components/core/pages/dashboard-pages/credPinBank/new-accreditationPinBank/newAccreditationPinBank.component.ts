
import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "../../../../layout/breadcrumb.component";
import { Breadcrumb } from '../../../../layout/types/breadcrumb.interface';
import { NgIf, NgFor, NgClass } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators, ValidationErrors } from "@angular/forms";
import { SearchCNPJService } from "../../../../../../services/utils/searchCnpj.service";
import { NgxMaskDirective } from "ngx-mask";
import { Subscription } from "rxjs";
import { ModalComponent } from "../../../../layout/modal.component";
import { LoaderComponent } from "../../../../layout/loader.component";
import { UfService } from "../../../../../../services/utils/uf.service";
import { DocService } from "../../../../../../services/utils/typeDocument.service";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";



@Component({
  selector: 'app-pages-newAccreditation',
  templateUrl: './newAccreditationPinBank.component.html',
  standalone: true,
  imports: [BreadcrumbComponent, NgIf, NgFor, NgClass, ReactiveFormsModule, NgxMaskDirective, ModalComponent, LoaderComponent],
  animations: [fadeInOut]
})



export class NewAccreditationComponentPinBank implements OnDestroy {

  public formBuilder = inject(FormBuilder)
  public accreditationOption!: string;
  private searchCNPJService = inject(SearchCNPJService)
  private subscription: Subscription | undefined;
  public showModalAlert = false;
  public loader = true;
  public ufService = inject(UfService)
  public docService = inject(DocService)

  public path: Breadcrumb[] = [
    {
      routeName: 'Cred. PinBank',
      routePath: 'http://localhost:4200/dashboard/home'
    },
    {
      routeName: 'Novo Credenciamento',
      routePath: 'http://localhost:4200/dashboard/credAdiq/novo-credenciamento'
    }
  ];


  //Dados passados para o modal de alerta


  public alert = {
    title: 'Identificamos um problema',
    message: 'O CNPJ informado consta como "INATIVO" na receita federal. Considere tal informação antes de prosseguir.',
    buttonConfirmText: 'Ok, estou ciente',
  }


  public propriedades = {

  }




  public accreditationForm = this.formBuilder.group({

    //Tipo de cadastro
    cnpj: ['32.825.240/0001-11', [Validators.required, Validators.minLength(14)]],
    corporateName: ['', [Validators.required]],
    tradeName: ['', [Validators.required]],
    stateRegistration: ['', [Validators.required]],
    commercialActivity: ['', [Validators.required]],
    openingDate: ['', [Validators.required]],
    mcc: ['', [Validators.required]],
    cnae: ['', [Validators.required]],
    situation: ['', [Validators.required]],
    legalNature: ['', [Validators.required]],
    revenue: ['', [Validators.required]],
    revenueReferenceMonthYear: ['', [Validators.required]],
    incorporationDate: ['', [Validators.required]],

    // Dados do contrato social
    number: ['', [Validators.required]],
    issuingBody: ['', [Validators.required]],
    contractState: ['', [Validators.required]],
    contractIssueDate: ['', [Validators.required]],
    taxation: ['', [Validators.required]],

    // Endereço
    zipCode: ['', [Validators.required]],
    street: ['', [Validators.required]],
    neighborhood: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    addressNumber: ['', [Validators.required]],
    complement: [''],

    // Dados Bancários
    codBank: ['', [Validators.required]],
    ag: ['', [Validators.required]],
    cC: ['', [Validators.required]],
    agDigito: ['', [Validators.required]],
    chavePix: ['', [Validators.required]],
    accountResponsibleName: ['', [Validators.required]],
    accountResponsibleDoc: ['', [Validators.required]],

    // Sócios
    partnerName: ['', [Validators.required]],
    partnerDocument: ['', [Validators.required]],
    typePartnerDocument: ['', [Validators.required]],
    typePartnerDocumentNumber: ['', [Validators.required]],
    partnerMotherName: ['', [Validators.required]],
    partnerDocumentExpedidor: ['', [Validators.required]],
    partnerDocumentDateExpedidor: ['', [Validators.required]],
    partnerDocumentUf: ['', [Validators.required]],
    partnerBornDate: ['', [Validators.required]],
    partnerEmail: ['', [Validators.required]],
    partnerPhone: ['', [Validators.required]],
    partnerPosition: ['', [Validators.required]],
    shareholdingPercentage: ['', [Validators.required]],
    partnerRelationshipStartDate: ['', [Validators.required]],
    partnerSignaturePermission: ['', [Validators.required]],

    //Representante
    agentName: ['', [Validators.required]],
    agentDocument: ['', [Validators.required]],
    agentRelationshipStartDate: ['', [Validators.required]],
    agentBornDate: ['', [Validators.required]],
    typeAgentDocument: ['', [Validators.required]],
    agentDocumentNumber: ['', [Validators.required]],
    agentDocumentExpedidor: ['', [Validators.required]],
    agentDocumentDateExpedidor: ['', [Validators.required]],

    //Procurador




    //Documentos


  });

  //Buscando o CNPJ informado na receita e capturando os dados caso o CNPJ seja ativo e válido.

  public getCnpjData() {
    let formValues = this.accreditationForm.value
    let cnpj = formValues.cnpj

    if (cnpj && cnpj.length >= 14) {
      const cnpjValue = cnpj
      this.subscription = this.searchCNPJService.searchCnpj(cnpjValue).subscribe(
        (res) => {
          console.log(res, "Mostrando a res")
          if (res.data.situation !== 'ATIVA') {
            this.showModalAlert = true
          } else {
            this.accreditationForm.patchValue(res.data)
          }
        },
        (error) => {
          console.error(error)
        }
      )
    }
  }

  public button(buttonText: string) {
    if (buttonText) {
      this.showModalAlert = false;
    }
  }


  accreditationOptSelect(event: any) {
    this.accreditationOption = event.value
  }


  ngOnDestroy(): void {
    this.subscription ? this.subscription.unsubscribe() : undefined
  }

}


