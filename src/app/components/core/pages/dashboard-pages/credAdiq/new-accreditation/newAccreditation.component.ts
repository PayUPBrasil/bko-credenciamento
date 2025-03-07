import { Component, inject, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, lastValueFrom, takeUntil, timeout } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NgxMaskDirective } from 'ngx-mask';

// Components
import { BreadcrumbComponent } from '../../../../layout/breadcrumb.component';
import { ModalComponent } from '../../../../layout/modal.component';
import { LoaderComponent } from '../../../../layout/loader.component';
import { FlagTagComponent } from '../../../../layout/flagTag.component';
import { ButtonPrimaryComponent } from '../../../../layout/buttons/button-primary.component';
import { FakeLoaderComponent } from '../../../../layout/fakeLoader.component';
import { ContractModalComponent } from '../../contract/contractModal.component';
import { NewAccreditationModalComponent } from "./newAccreditationModal.component";
import { DocumentUploadComponent } from "./documentUpload.component";
import { ProductListConfigurationComponent } from './productListConfiguration.component';
import { AccreditationModalComponent } from './accreditationModal.component';

// Services
import { SearchCNPJService } from '../../../../../../services/utils/searchCnpj.service';
import { UfService } from '../../../../../../services/utils/uf.service';
import { DocService } from '../../../../../../services/utils/typeDocument.service';
import { TaxationService } from '../../../../../../services/utils/taxation.service';
import { CodProdutoAdiqService } from '../../../../../../services/utils/codProdutoAdiq.service';
import { PersonTypeFourbank } from '../../../../../../services/utils/personTypeFourbank.service';
import { RolePartnerFourBankService } from '../../../../../../services/utils/rolePartnerFourBank.service';
import { PermissionSignatureFourBankService } from '../../../../../../services/utils/permissionSignatureFourBank.service';
import { TecnologyTableAdiq } from '../../../../../../services/utils/tecnologyTableAdiq.service';
import { TypeEnterpriseService } from '../../../../../../services/utils/typeEnterprise.service';
import { NewAccreditationService } from './newAccreditation.service';
import { SearchCepService } from '../../../../../../services/utils/searchCep.service';
import { SearchCityIBGECodeService } from '../../../../../../services/utils/searchCityIBGECode.service';
import { CountriesService } from '../../../../../../services/utils/countries.service';
import { AccountTypesService } from '../../../../../../services/utils/accountTypes.service';
// Directives
import { DateValidatorDirective } from '../../../../../../directives/validators/date-validator.directive';
import { MonthYearValidatorDirective } from '../../../../../../directives/validators/month-year-validator.directive';
import { CpfCnpjValidatorDirective } from '../../../../../../directives/validators/cpfcnpj-validator.directive';
import { PhoneValidatorDirective } from '../../../../../../directives/validators/phone-validator.directive';

// Animations
import { fadeInOut } from '../../../../../animations/fadeInAnimation.component';

// Interfaces
import { Breadcrumb } from '../../../../layout/types/breadcrumb.interface';
import { SessionService } from '../../../../../../services/session/session.service';
import { contactResponsabilityListService } from '../../../../../../services/utils/contactResponsabilityList.service';
import { RegisterSuccessModalComponent } from "../../clients/clientsDetailsForm/registerSuccessModal.component";
import { SelectAccountTypeComponent } from "./selectAccountType.component";

@Component({
  selector: 'app-pages-newAccreditation',
  templateUrl: './newAccreditation.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    NgxMaskDirective,
    BreadcrumbComponent,
    ModalComponent,
    LoaderComponent,
    FlagTagComponent,
    ButtonPrimaryComponent,
    FakeLoaderComponent,
    ContractModalComponent,
    NewAccreditationModalComponent,
    DocumentUploadComponent,
    ProductListConfigurationComponent,
    AccreditationModalComponent,
    CpfCnpjValidatorDirective,
    DateValidatorDirective,
    MonthYearValidatorDirective,
    PhoneValidatorDirective,
    NgFor,
    NgIf,
    RegisterSuccessModalComponent,
    SelectAccountTypeComponent
],
  animations: [fadeInOut],
})
export class NewAccreditationComponent implements OnDestroy, OnInit {

  @ViewChild('addressDetails') addressDetails!: ElementRef;
  @ViewChild('bankDetails') bankDetails!: ElementRef;
  @ViewChild('basicDataDetails') basicDataDetails!: ElementRef;
  @ViewChild('contractDetails') contractDetails!: ElementRef;
  @ViewChild('partnerDetails') partnerDetails!: ElementRef;
  @ViewChild('operationDetails') operationDetails!: ElementRef;
  @ViewChild('productsDetails') productsDetails!: ElementRef;

  openAddressSummary() {
    const elements = [
      this.addressDetails,
      this.bankDetails,
      this.basicDataDetails,
      this.contractDetails,
      this.partnerDetails,
      this.operationDetails,
      this.productsDetails
    ];

    elements.forEach(element => {
      if (element && element.nativeElement) {
        element.nativeElement.open = true;
      }
    });
  }

  public accreditationOption!: number;
  // public accreditationOption = 2; //*-> Usado para testar um tipo específico de credenciamento (pf ou pj) -> Deve ser removido em produção
  public formBuilder = inject(FormBuilder);
  public router = inject(Router);

  public accreditationModalOptions = false;
  public loadingFake !: boolean;
  public generateContract = false;
  public isButtonDisabled  = true;

  // Services
  public enterpriseTypes = inject(TypeEnterpriseService).getEnterpriseTypes();
  private searchCNPJService = inject(SearchCNPJService);
  private searchCepService = inject(SearchCepService);
  public ufService = inject(UfService);
  private taxationService = inject(TaxationService);
  public taxationList = this.taxationService.getTaxationList();
  public codProdutoAdiqService = inject(CodProdutoAdiqService);
  public rolePartnerFourBankService = inject(RolePartnerFourBankService);
  public permissionSignatureFourBankService = inject(PermissionSignatureFourBankService);
  public newAccreditationService = inject(NewAccreditationService);
  public docService = inject(DocService);
  public accountTypesService = inject(AccountTypesService).getAccountTypes();
  public contactResponsabilityListService = inject(contactResponsabilityListService).getContactResponsabilityList()


  // Utils
  public tecnologyTableAdiq = inject(TecnologyTableAdiq);
  public personTypeFourbank = inject(PersonTypeFourbank);
  public codProdutosList = this.codProdutoAdiqService.getCodProdutoList();
  public codProdutoTagItems: any[] = [];
  public cidades: any = [];
  public productIcon!: any;

  // Visibilidade e mensagens
  public doAccreditation = false;
  public accreditationAdiq = false;
  public comboBox = false;
  public showModalAlert = false;
  public loader = true;
  public errorMessage!: any;
  public alertMessage = ''

  public produtosAdicionados: any = [];
  public codProdutoSelecionado: any[] = [];
  public clientId = ''
  public basicData = 'Finalizado'

  private destroy$ = new Subject<void>();

  private sessionService = inject(SessionService)

  // Valores passados para @inputs()
  public path: Breadcrumb[] = [
    {
      routeName: 'Cred. Adiq',
      routePath: 'http://localhost:4200/dashboard/home',
    },
    {
      routeName: `Novo Credenciamento`,
      routePath: 'http://localhost:4200/dashboard/credAdiq/novo-credenciamento',
    },
  ];


  //* Alerta que deve ser retornado quando houver algum erro no cnpj informado para cadastrado
  public alert!: any

  //* @Permite que o usuário final escolha o tipo de credenciamento que vai realizar
  public accreditationOptSelect(value: any) {
    this.accreditationOption = value;
    this.setValidators();
  }

  //* Declarações Iniciais do Componente
  ngOnInit(): void {
    this.FilteredProductNames();
    this.searchCityIBGECode();
    this.setValidators();

    this.accreditationForm
      .get('establishmentLocatedInShopping')
      ?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.shoppingDescValidators(value);
        }
      });

      this.sessionService.getSessao()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sessao) => {
          sessao ? this.clientId = sessao.id : this.clientId = '';
        },
        error: (error) => {
          console.error('Erro ao buscar sessão', error);
        }
      })
  }

  //* @ Campos do formulário de credenciamento, PF e PJ
  public accreditationForm = this.formBuilder.group({
    cnpj: ['', [Validators.minLength(14), Validators.maxLength(18)]],
    cpf: ['', [Validators.minLength(14), Validators.maxLength(14)]],
    name: [''],
    birthdayDate: [''],
    contactEmail: [''],
    nationality: [''],
    contactPhone: [''],

    contactResponsability: [''],
    corporateName: ['', [Validators.maxLength(100)]],
    tradeName: ['', [Validators.maxLength(100), Validators.required]],
    stateRegistration: ['', [Validators.maxLength(100)]],
    nameOnInvoice: ['', [Validators.maxLength(35), Validators.required]],
    commercialActivity: ['', []],
    openingDate: ['22/11/2019', []],
    cnae: ['', []],
    situation: ['', []],
    legalNature: ['409-0 - Candidato a Cargo Político Eletivo', []],
    revenue: ['', [Validators.required]],
    revenueReferenceMonthYear: ['10/2023', [Validators.required]],
    incorporationDate: ['', []],
    enterpriseType: ['', []],

    // Dados do contrato social
    number: ['329.267.754.170', []],
    issuingBody: ['JUCESP', []],
    contractState: ['', []],
    contractIssueDate: ['22/11/2019', []],
    matriz: ['', []],
    taxation: ['', []],
    accreditationType: ['true'],

    // Endereço
    zipCode: ['12442-390', [Validators.required]],
    street: ['Avenida Nove De Julho', [Validators.required, Validators.maxLength(32)]],
    neighborhood: ['Jardim Paulista', [Validators.required, Validators.maxLength(32)]],
    city: ['', [Validators.required, Validators.maxLength(32)]],
    state: ['', [Validators.required]],
    addressNumber: ['', [Validators.required]],
    complement: ['', [Validators.maxLength(32)]],

    // Dados Bancários
    codBank: ['', [Validators.required]],
    ag: ['', [Validators.required]],
    cC: ['', [Validators.required]],
    chavePix: [''],
    accountType: ['', [Validators.required]],
    accountResponsibleName: ['', [Validators.required]],
    accountResponsibleDoc: ['', [Validators.required]],

    // Sócios
    partnerName: ['', []],
    partnerCpfCnpj: ['', []],
    partnerType: ['', []],
    partnerNationality: ['', []],
    partnerDocument: ['', []],
    typePartnerDocument: ['', []],
    partnerMotherName: ['', []],
    partnerDocumentExpedidor: ['', []],
    partnerDocumentDateExpedidor: ['', []],
    partnerDocumentUf: ['', []],
    partnerBornDate: ['', []],
    partnerEmail: [
      '',
      [Validators.email],
    ],
    partnerPhone: ['', []],
    partnerPosition: ['', []],
    shareholdingPercentage: ['', []],
    partnerRelationshipStartDate: ['', []],
    partnerSignaturePermission: ['', []],

    //Endereço do Sócio
    zipCodePartner: ['', []],
    streetPartner: ['', []],
    neighborhoodPartner: ['', []],
    cityPartner: ['', []],
    country: ['Brasil', [Validators.required]],
    statePartner: ['', []],
    addressNumberPartner: ['', []],
    complementPartner: ['', []],

    //Funcionamento
    openingHours: ['', [Validators.required]],
    establishmentLocatedInShopping: ['false', [Validators.required]],
    shoppingDesc: [''],

    //Documentos

    //Solução e produtos
    mid: ['93996', [Validators.required]],
    codProd: [''],
    idCanal: ['170001', [Validators.required]],
    paymentType: ['1', [Validators.required]],
    tecnologyCode: ['', []],
    qtSolution: ['2'],

    codMcc: ['1', [Validators.required]],
    descMcc: ['CONSTRUCAO', [Validators.required]],
    combo: ['COMBO FAC CERT 9', [Validators.required]],
    taxa: ['TAXA FAC CERT 9', [Validators.required]],
  });


  //* @Buscando o CNPJ informado na receita e capturando os dados caso o CNPJ seja ativo e válido.

  public getCnpjData() {
    let formValues = this.accreditationForm.value;
    let cnpj = formValues.cnpj;

    if (cnpj && cnpj.length >= 14) {
      const cnpjValue = cnpj;
      this.searchCNPJService
        .searchCnpj(cnpjValue)
        .pipe(timeout(3000),
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (res) => {
            console.log(res, 'verificando a resposta do cnpj search')
            if (res.data.situation !== 'ATIVA') {
              this.alert = {
                title: 'Identificamos um problema',
                message:
                  'O CNPJ informado consta como "INATIVO" na receita federal. Considere tal informação antes de prosseguir.',
                buttonConfirmText: 'Ok, estou ciente',
              };
              this.showModalAlert = true;
            } else {
              this.accreditationForm.patchValue(res.data);
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  //* @Buscando o CEP informado na viaCep e capturando os dados caso o CEP seja válido.
  public getCepData(cep: string, origem: string) {
    let zipCode = cep;

    if (zipCode && zipCode.length >= 9) {
      this.searchCepService.searchCep(zipCode)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            const city = res.data.city
              .toUpperCase()
              .replace('Ã', 'A')
              .replace('É', 'E');

            switch (origem) {
              case 'socio':
                const partnerFormControls = [
                  { control: 'zipCodePartner', value: res.data.zipCode },
                  { control: 'streetPartner', value: res.data.street },
                  {
                    control: 'neighborhoodPartner',
                    value: res.data.neighborhood,
                  },
                  { control: 'cityPartner', value: city },
                  { control: 'statePartner', value: res.data.uf },
                ];

                partnerFormControls.forEach(({ control, value }) => {
                  this.accreditationForm.get(control)?.setValue(value);
                });

                break;
              default:
                const addressFormControls = [
                  { control: 'zipCode', value: res.data.zipCode },
                  { control: 'street', value: res.data.street },
                  { control: 'neighborhood', value: res.data.neighborhood },
                  { control: 'city', value: city },
                  { control: 'state', value: res.data.uf },
                ];

                addressFormControls.forEach(({ control, value }) => {
                  this.accreditationForm.get(control)?.setValue(value);
                });

                break;
            }
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
  }

  //* @Buscando o país --not emplemented--
  public countriesList() {
    // this.countriesService.listAllCountries().subscribe({
    //   next: (res) => {
    //     console.log(res);
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   },
    // });
  }

  //* @Manipulando os valores combobox de city e cityPartner --not emplemented--
  public searchCityIBGECode(event = '') {
    if (event.length > 0) {
      this.comboBox = true;
    }
    let searchText = event;
    // this.searchCityIBGECodeService.getIBGECode(searchText).subscribe({
    //   next: (response) => {
    //     this.cidades = response.data.searchCity;
    //   },
    //   error: (error) => {
    //     console.error(error);
    //   },
    // });
  }

  //*@Manipulando a visibilidade do combobox
  public selectedValue(value: string) {
    this.accreditationForm.get('city')?.setValue(value);
    this.comboBox = false;
  }

  public button(buttonText: string) {
    if (buttonText) {
      this.showModalAlert = false;
    }
  }

  //* @Responsável por criar a lista de produtos disponíveis (bandeiras -> Visa, master, elo...) e filtrar mostrando somente os valores que ainda não foram selecionados pelo usuário final
  public FilteredProductNames(produto = '') {
    let valueClicked = Number(produto);

    //* Se todos os produtos (bandeiras -> Visa, Elo, Master) já tiverem sido selecionados. Zero a lista de produtos.
    if (this.codProdutoTagItems.length === 7) {
      this.codProdutosList.shift();
    }

    this.codProdutosList = this.codProdutosList.filter((availableProducts) => {
      this.accreditationForm.get('codProd')?.reset();
      if (valueClicked === 5) {
        if (availableProducts.codProduto !== 5) {
          this.codProdutoTagItems.push(
            `${availableProducts.nomeProduto}, ${availableProducts.codProduto}`
          );
          return (availableProducts.nomeProduto = '');
        }
      } else if (valueClicked !== 5) {
        if (availableProducts.codProduto === valueClicked) {
          if (
            !this.codProdutoTagItems.includes(availableProducts.nomeProduto)
          ) {
            this.codProdutoTagItems.push(
              `${availableProducts.nomeProduto}, ${availableProducts.codProduto}`
            );
          }
        }
      }

      return availableProducts.codProduto !== valueClicked;
    });
  }

  // @ Responsável por excluir uma bandeira (tag) que havia sido selecionada anteriormente, e retornar as demais bandeiras.

  public removeTag(tag: string) {
    let cod = Number(tag.split(',')[1].trim());
    let tagName = tag.split(',')[0].trim();

    this.codProdutoTagItems = this.codProdutoTagItems.filter((item) => {
      return item !== tag;
    });

    this.codProdutosList.push({
      nomeProduto: tagName,
      codProduto: cod,
    });

    // Adiciona 'TODAS AS BANDEIRAS' apenas se não estiver presente na lista e se houver mais valores a serem selecionados além de 'todas as bandeiras'
    if (
      !this.codProdutosList.some(
        (produto) => produto.nomeProduto === 'TODAS AS BANDEIRAS'
      )
    ) {
      this.codProdutosList.push({
        nomeProduto: 'TODAS AS BANDEIRAS',
        codProduto: 5,
      });
    }
  }

  //* @Funções responsáveis por adicionar e remover elementos do array de configuração de produtos, onde clico em `adicionar produto` no html
  public addProd() {
    let formValues = this.accreditationForm.value;

    const dados = {
      codigo: formValues.codMcc,
      descricao: formValues.descMcc,
      cnae: formValues.cnae,
      combo: formValues.combo,
      taxa: formValues.taxa,
      terminais: {
        posTerminal: {
          tecnologyCode: formValues.tecnologyCode,
        },
        qt: formValues.qtSolution,
      },
    };

    if (this.produtosAdicionados.length > 0) {
      const existe = this.produtosAdicionados.some(
        (produtosExistentes: any) => {
          return (
            produtosExistentes.terminais.posTerminal.tecnologyCode ===
            dados.terminais.posTerminal.tecnologyCode
          );
        }
      );

      if (!existe) {
        this.produtosAdicionados.push(dados);
      }
    } else if (dados.terminais.posTerminal.tecnologyCode) {
      this.produtosAdicionados.push(dados);
    }
  }

  // @ Responsável por excluir um valor do array
  public removeProd(productId: string) {
    this.produtosAdicionados = this.produtosAdicionados.filter(
      (produtos: any) => {
        return produtos.terminais.posTerminal.tecnologyCode !== productId;
      }
    );
  }

  // @ Responsável por fechar o modal de credenciamento e encaminhar o usuario para os detalhes do cadastro recém feito.
  public closeModalOfAccreditation(event: string) {
    this.doAccreditation = false;
    let crId = this.newAccreditationService.getCrId();
    this.goToClientDetails(crId);
  }

  // @ Direciona o usuário para o cadastro recém feito.
  public goToClientDetails(crId: string) {
    this.router.navigate(['/dashboard/clients/details', crId]);
  }


  public remaindMeLater() {
    let crId = this.newAccreditationService.getCrId()
    this.router.navigate(['/dashboard/clients/details', crId]);
  }
  // @ Funções responsáveis por realizar validações no formulário

  public setValidators() {
    //Dados somente de PJ
    if (this.accreditationOption == 1) {
      console.log('trata-se de um pj')
      this.accreditationForm.get('cnpj')?.setValidators(Validators.required);
      this.accreditationForm.get('corporateName')?.setValidators(Validators.required);
      this.accreditationForm.get('enterpriseType')?.setValidators(Validators.required)
      this.accreditationForm.get('tradeName')?.setValidators(Validators.required);
      this.accreditationForm.get('enterpriseType')?.setValidators(Validators.required)
      this.accreditationForm.get('commercialActivity')?.setValidators(Validators.required)
      this.accreditationForm.get('openingDate')?.setValidators(Validators.required);
      this.accreditationForm.get('cnae')?.setValidators(Validators.required);
      this.accreditationForm.get('situation')?.setValidators(Validators.required);
      this.accreditationForm.get('legalNature')?.setValidators(Validators.required);
      this.accreditationForm.get('incorporationDate')?.setValidators(Validators.required);


      //Dados do contrao social
      this.accreditationForm.get('number')?.setValidators(Validators.required);
      this.accreditationForm
        .get('issuingBody')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('contractState')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('contractIssueDate')
        ?.setValidators(Validators.required);
      this.accreditationForm.get('matriz')?.setValidators(Validators.required);
      this.accreditationForm
        .get('taxation')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('accreditationType')
        ?.setValidators(Validators.required);

      //Dados do sócio
      this.accreditationForm.get('partnerName')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerCpfCnpj')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerType')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerNationality')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerDocument')?.setValidators(Validators.required);
      this.accreditationForm.get('typePartnerDocument')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerMotherName')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerDocumentExpedidor')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerDocumentDateExpedidor')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerDocumentUf')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerBornDate')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerEmail')?.setValidators([Validators.email, Validators.required]);

      this.accreditationForm.get('partnerPhone')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerPosition')?.setValidators(Validators.required);
      this.accreditationForm.get('shareholdingPercentage')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerRelationshipStartDate')?.setValidators(Validators.required);
      this.accreditationForm.get('partnerSignaturePermission')?.setValidators(Validators.required);
      this.accreditationForm.get('zipCodePartner')?.setValidators(Validators.required);
      this.accreditationForm.get('streetPartner')?.setValidators(Validators.required);
      this.accreditationForm.get('neighborhoodPartner')?.setValidators(Validators.required);
      this.accreditationForm.get('cityPartner')?.setValidators(Validators.required);
      this.accreditationForm.get('statePartner')?.setValidators(Validators.required);
      this.accreditationForm.get('addressNumberPartner')?.setValidators(Validators.required);
    } else if (this.accreditationOption == 2) {
      // this.accreditationForm.clearAsyncValidators()
      this.accreditationForm.get('cpf')?.setValidators(Validators.required);
      this.accreditationForm.get('name')?.setValidators(Validators.required);
      this.accreditationForm
        .get('birthdayDate')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('contactEmail')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('nationality')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('contactPhone')
        ?.setValidators(Validators.required);
      this.accreditationForm
        .get('contactResponsability')
        ?.setValidators(Validators.required);
    }

    this.accreditationForm.updateValueAndValidity();
  }

  public shoppingDescValidators(establishmentLocatedInShopping: string) {
    const shoppingDescControl = this.accreditationForm.get('shoppingDesc');

    if (establishmentLocatedInShopping == 'true') {
      shoppingDescControl?.setValidators(Validators.required);
    } else {
      shoppingDescControl?.clearValidators();
    }
    shoppingDescControl?.updateValueAndValidity();
  }

  //  @ Responsável por finalizar o cadastro de um cliente PF ou PJ, realizando a chamada do serviço - front/back
  public async finishRegistration() {
    this.doAccreditation = true;
    // Manipulando o ícone que aparece durante o credenciamento do modal 'doAccreditation'
    let formValues = this.accreditationForm.value;

    let validProductCode$ = this.codProdutoTagItems.map((productNumber) =>
      productNumber.replace(/\D/g, '')
    );

    let accreditationEnterprise = 'adiq';

    try {
      let type = this.accreditationOption == 2 ? 'PF' : 'PJ';

      const res = await lastValueFrom(
        this.newAccreditationService.registerNewClient(
          formValues,
          accreditationEnterprise,
          validProductCode$,
          type
        )
      );

      if (res) {
        this.accreditationModalOptions = true;
        this.loadingFake = true

        this.clientId = res.message
        console.log(res, 'dentro de response, vou remover a animação ')
        setTimeout(() => {
          this.loadingFake = false
        }, 3000)
      }
    } catch (error) {
      this.openAddressSummary();
      console.log(error, 'o erro aconteceu');
      if (error instanceof HttpErrorResponse) {

        this.alertMessage = error.error

        if (Array.isArray(error.error.errors)) {
          this.handleFormErrors(error.error.errors);
        }

        this.errorMessage = error.error.error;
        console.log('valor posteiror')
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    }
  }

  private handleFormErrors(errors: any[]) {
    let hasAddressError = false;

    errors.forEach(error => {
      const parts = error.path.split(".");
      const lastPart = parts[parts.length - 1];

      const control = this.accreditationForm.get(lastPart);

      console.log(control, 'control');
      if (control) {
        control.setErrors({ serverError: error.msg });
        control.markAsTouched();

        // Verifique se o erro está relacionado a campos de endereço
        if (['zipCode', 'street', 'neighborhood', 'city', 'state'].includes(error.path)) {
          hasAddressError = true;
        }
      }
    });


  }


  //* Helper responsável por manipular o input de situação cadastral

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
