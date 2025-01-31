import { NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { ButtonPrimaryComponent } from "../../../layout/buttons/button-primary.component";
import { ReactiveFormsModule, Validators, FormBuilder } from "@angular/forms";
import { Client } from "./types/client.interface";
import { FlagTagComponent } from "../../../layout/flagTag.component";
import { fadeInOut } from "../../../../animations/fadeInAnimation.component";
import { ClientService } from "./services/clients.service";
import { Subject, takeUntil } from "rxjs";
import { NgxMaskDirective } from "ngx-mask";
import { CodProdutoAdiqService } from "../../../../../services/utils/codProdutoAdiq.service";
@Component({
  selector: "app-pages-clientsModalEditData",
  templateUrl: "./clientsModalEditData.component.html",
  standalone:true,
  imports: [NgFor, NgIf, ButtonPrimaryComponent, ReactiveFormsModule, FlagTagComponent, NgxMaskDirective],
  animations: [fadeInOut]
})

export class ClientsModalEditDataComponent implements OnInit{
  @Input() editionDetails : any = [{}]
  @Input() clientDetails : any
  @Output() closeModal = new EventEmitter<string>()

  public editInputsList: string[] = [];
  public editInputTitles: string[] = [];
  public editInputOldValues: any[] = [];
  public flagsByNames : string[] = []
  public updateClientDataForm!: any;
  public inputType = 'text';
  private destroy$ = new Subject<void>();
  public flagEdit = false;
  public enableSubmit = false
  public hasError = false;
  public maskByInput !: any;
  public remainderFlags : any[] = []

  private codProdutoAdiqService = inject(CodProdutoAdiqService)
  private fb = inject(FormBuilder)
  private clientService = inject(ClientService)

  public submitFormButtonElement =
  {
      title: 'Salvar Alterações',
      color: 'text-white',
      bg_color: 'bg-red-500 hover:bg-red-600',
      aria_label: 'Botão de Salvar',
      disabled: true,
      loadingStatus: 'hidden',
      routerLink:''
    }

  ngOnInit(): void {
    this.getInputsToEdition(this.editionDetails[0].title);
    console.log(this.clientDetails,' detalhes do cliente que estou atualizando')
    // this.getInputsToEdition('Bandeiras Habilitadas');
    this.createDynamicForm();
  }

  public enableSubmitButton():void {
      this.submitFormButtonElement.disabled = !this.submitFormButtonElement.disabled;
  }

  public checkForAlterations(): { hasChanges: boolean; changedFields: { fieldName: string; newValue: any }[] } {
    let formsValues = this.updateClientDataForm.value;
    let hasChanges = false;
    let changedFields: { fieldName: string; newValue: any }[] = [];

    this.editInputOldValues.forEach((value, index) => {
      const fieldName = this.editInputsList[index];
      const newValue = formsValues[fieldName];

      if (value !== newValue) {
        hasChanges = true;
        const fullFieldPath = this.findFieldPath(this.clientDetails, fieldName) || fieldName;
        changedFields.push({ fieldName: fullFieldPath, newValue });
      }
    });

    //Função para habilitar o botão de salvar apenas se existirem alterações
    if(hasChanges && changedFields.length > 0){
      console.log('existe alterações')
      this.submitFormButtonElement.disabled = false
    } else {
      this.submitFormButtonElement.disabled = true
    }

    return { hasChanges, changedFields };
  }


  // public findFieldPath(obj: any, fieldName: string, currentPath: string = ''): string | null {

  //   console.log("===================================")
  //   console.log('em findFieldPath')
  //   console.log(obj, fieldName, currentPath)
  //   console.log("===================================")

  //   let fieldNameWithoutNumbers = fieldName.replace(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ'\s]+$/ ,'')

  //   if (Array.isArray(obj)) {
  //     for (let i = 0; i < obj.length; i++) {
  //       const result = this.findFieldPath(obj[i], fieldNameWithoutNumbers, `${currentPath}[${i}]`);
  //       if (result) return result;
  //     }
  //   } else if (typeof obj === 'object' && obj !== null) {
  //     for (let key in obj) {
  //       if (key === fieldNameWithoutNumbers) {
  //         return currentPath ? `${currentPath}.${key}` : key;
  //       }
  //       const result = this.findFieldPath(obj[key], fieldNameWithoutNumbers, currentPath ? `${currentPath}.${key}` : key);
  //       if (result) return result;
  //     }
  //   }
  //   return null;
  // }


  public findFieldPath(obj: any, fieldName = 'partnerPhone', currentPath: string = ''): string | null {
    const match = fieldName.match(/^(.+?)_(\d+)$/);
    let fieldNameWithoutIndex = fieldName;
    let index = null;

    if (match) {
      fieldNameWithoutIndex = match[1];
      index = parseInt(match[2]);
    }

    let cleanFieldName = fieldNameWithoutIndex.replace(/[^A-Za-z]/g, '').toLowerCase();

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        const result = this.findFieldPath(obj[i], cleanFieldName, `${currentPath}[${i}]`);
        if (result) {
          if (index !== null && i === index) {
            return result;
          }
          if (index === null) {
            return result;
          }
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        const cleanKey = key.replace(/[^A-Za-z]/g, '').toLowerCase();
        if (cleanKey === cleanFieldName) {
          let path = currentPath ? `${currentPath}.${key}` : key;
          if (index !== null) {
            const result = this.findFieldPath(obj[key], fieldName, path);
            if (result) return result;
          } else {
            return path;
          }
        }
        const result = this.findFieldPath(obj[key], fieldName, currentPath ? `${currentPath}.${key}` : key);
        if (result) return result;
      }
    }
    return null;
  }

  public saveAlterations():void{

    let alterations = this.checkForAlterations();
    let crId = this.clientDetails.basicData.crId;

    for(let i = 0; i < alterations.changedFields.length; i++){
      if(alterations.changedFields[i].fieldName.includes('Data')){
       alterations.changedFields[i].newValue =  this.maskDateValues(alterations.changedFields[i].newValue);
      } else if (alterations.changedFields[i].fieldName.includes('zip')){
        alterations.changedFields[i].newValue =  this.maskDateCEP(alterations.changedFields[i].newValue);
      }
    }
    if(alterations.hasChanges){
      this.clientService.updateClientData(alterations, crId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response.message){
            window.location.reload();
          }
        },
        error: (error) => {
          if(error) this.hasError = true
          console.error(error, "Mostrando o erro da requisição")
        }
      })
    }
  }


 public maskDateCEP(cep:string) : string | undefined{
  let cepClean = cep.replace(/\D/g, '');

  if(cepClean.length === 8){
    const cepMask = `${cepClean.substr(0, 5)}-${cepClean.substr(5, 3)}`;
    return cepMask;
  }
  return
 }
  public maskDateValues(value: string): string {
    const cleanValue = value.replace(/\D/g, '');

   if (cleanValue.length === 8) {
      const day = cleanValue.substr(0, 2);
      const month = cleanValue.substr(2, 2);
      const year = cleanValue.substr(4, 4);
      return `${day}/${month}/${year}`;
    }
    return value;
  }

  private getInputsToEdition(subject: string): Array<string> | any {
    switch (subject) {
      case 'Detalhes do Estabelecimento':
        return this.getEstablishmentDetails();
      case 'Bandeiras Habilitadas':
        return this.getEnabledFlags();
      case 'Endereço do Estabelecimento':
        return this.getEstablishmentAddress();
      default:
        return 'Nenhum';
    }
  }

  private getEstablishmentDetails(): Array<string> | void {
    const basicDataCopy = this.getFilteredBasicData();
    const additionalFields = this.getAdditionalFields();
    const contractData = this.getContractData()
    const combinedData = { ...basicDataCopy, ...additionalFields, ...contractData };

    this.editInputOldValues = Object.values(combinedData);
    this.editInputsList = Object.keys(combinedData);
    this.editInputTitles = this.editInputsList.map(field => this.getFieldTitle(field));


    // return this.setCustomValidators(this.editInputsList);
  }

  private getEstablishmentAddress() : any | void {

    const addressCopy = this.getFilteredAddress();

    console.log(addressCopy, 'dados do endereço do cliente')


    this.editInputOldValues = Object.values(addressCopy);
      console.log(this.editInputOldValues, 'valores antigos do endereço do cliente')
      this.editInputsList = Object.keys(addressCopy);
      console.log('lista de informações', this.editInputsList)
      this.editInputTitles = this.editInputsList.map(field => this.getFieldTitle(field));
  }

  private getFieldTitle(fieldName: string): string {
    console.log(fieldName, 'estando o nome do campo')
    const titleMap: { [key: string]: string } = {
      tradeName: 'Nome Fantasia',
      corporateName: 'Razão Social',
      commercialActivity: 'Atividade Comercial',
      openingDate: 'Data de Abertura',
      legalNature: 'Natureza Jurídica',
      revenue: 'Faturamento',
      revenueReferenceMonthYear: 'Mês e Ano de Referência',
      incorporationDate: 'Data de Inscrição',
      nameOnInvoice: 'Nome na Fatura',
      contractState: 'Estado de Emissão',
      contractIssueDate: 'Data de Emissão do Contrato',
      taxation:'Tributação',
      number:'Número',
      issuingBody:'Órgão Emissor',
      street:'Rua',
      addressNumber: 'Número',
      complement :'Complemento',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'UF',
      zipCode: 'CEP',
      country: 'País',
      delivery_address:"Endereço de Entrega"
    };

    return titleMap[fieldName] || this.formatFieldName(fieldName);
  }

  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private getFilteredBasicData(): Partial<Client['basicData']> {
    const { crId, status, type, document, ...filteredData } = this.clientDetails.basicData;
    return filteredData;
  }

  private getFilteredAddress() : Partial<Client['address']> {
    const { ...filteredData} = this.clientDetails.address[0];
    return filteredData;
  }

  public getContractData() : Partial<Client['contractData']> {
    if(this.clientDetails.type === 'PJ'){
      const { contractType, contractNumber, contractStartDate, contractEndDate, ...contractData } = this.clientDetails.contractData;
      return contractData;
    } else {
      return {};
    }
  }

  private getAdditionalFields(): { [key: string]: any } {
    const additionalFields: { [key: string]: any } = {};

    if(this.clientDetails.type === 'PJ') {
      this.clientDetails.partners.forEach((partner: any, index: number) => {
        const filteredPartnerData = this.getFilteredPartnerData(partner);
        Object.entries(filteredPartnerData).forEach(([key, value]) => {
          additionalFields[`${key}_${index}`] = value;
        });
      });
      return additionalFields;
    } else {
      return {
        ...this.clientDetails.contact
      };
    }
  }

  private getFilteredPartnerData(partner: any): Partial<any> {
    const excludedFields = [
      'partnerBornDate', 'partnerDocument', 'partnerDocumentExpedidor',
      'partnerDocumentUf', 'partnerName', 'partnerMotherName',
      'partnerPosition', 'partnerRelationshipStartDate',
      'partnerSignaturePermission', 'typePartnerDocumentNumber'
    ];

    return Object.fromEntries(
      Object.entries(partner).filter(([key]) => !excludedFields.includes(key))
    );
  }


  public closeEditModal() : void{
    this.closeModal.emit('close')
    window.location.reload();
  }

  //* Creating the form dynamically according to the data the user request to chenge


  public createDynamicForm(): void {
    const formGroup: { [key: string]: any } = {};

    this.editInputsList.forEach((input: string, index: number) => {
      formGroup[input] = [this.editInputOldValues[index], Validators.required];
    });

    this.editInputsList.forEach((input: string, index: number) => {
      formGroup[input] = [this.editInputOldValues[index], Validators.required];
    });

    this.updateClientDataForm = this.fb.group(formGroup);

    this.defineMaskInputByInputNameOrType()
  }

  //* Methods for working with flag editing

  public getFlagNames(flagNumbers: number[]): string[] {
    console.log(flagNumbers, 'vendo o que foi recebido no método de flag')
    const flagMap: { [key: number]: string } = {
      1: 'VISA CREDITO',
      2: 'VISA DEBITO',
      3: 'MASTER CREDITO',
      4: 'MASTER DEBITO',
      22: 'ELO CREDITO',
      23: 'ELO DEBITO',
      28: 'HIPERCARD',
    };
    return this.flagsByNames = flagNumbers.map(num => flagMap[num] || 'Unknown Flag');

  }


  private getEnabledFlags(): Array<string> {
    this.flagEdit = true;
    this.getFlagNames(this.clientDetails.codProdutos[0].codes)
    this.identifyRemainderFlags()
    return Object.keys(this.clientDetails.codProdutos[0].codes);
  }

  public editFlagsValues() : void{
    this.getEnabledFlags();
  }

  public clickedFlagValue(e: any): void {
    let arrFlags = [e];
    // let flagCode = this.getFlagCode(arrFlags);

    // console.log(flagCode[0], 'capturando o código da bandeira conforme interação ')

    this.flagsByNames = (this.flagsByNames).filter((flag:any) => {
      return flag !== e
    })

    this.identifyRemainderFlags()


  }

  //* Method who show the remaining flags to user add

  private identifyRemainderFlags() : void {
    this.remainderFlags = this.codProdutoAdiqService.getCodProdutoList().filter((allFlags:any) => {
      if(allFlags.nomeProduto !== 'TODAS AS BANDEIRAS'){
        return !this.flagsByNames.includes(allFlags.nomeProduto)
      }
      return
    }).map((flag:any) => { return flag.nomeProduto})
  }

  public saveNewFlags(){
    console.log('novas flags para salvar', this.flagsByNames)
  }

  public getFlagCode(flagCode:string[]) : number[]{
    const flagMap: { [key: string]: number } = {
      'VISA CREDITO': 1,
      'VISA DEBITO': 2,
      'MASTER CREDITO': 3 ,
      'MASTER DEBITO': 4 ,
      'ELO CREDITO' : 22 ,
      'ELO DEBITO': 23 ,
      'HIPERCARD': 28 ,
    };
    return flagCode.map(string => flagMap[string]);
  }

  public defineMaskInputByInputNameOrType() : void {
    let formControlNames = Object.keys(this.updateClientDataForm.controls);
    this.maskByInput = [];
    formControlNames.forEach(controlName => {

      let maskConfig: any = {
        name: controlName,
        mask: '',
        type: 'text' // Default type
      };

      if (controlName.includes('Date')) {
        maskConfig.mask = '00/00/0000';
        maskConfig.type = 'text';
      } else if (controlName.includes('Phone') || controlName.includes('Telefone')) {
        maskConfig.mask = '(00) 00000-0000';
        maskConfig.type = 'tel';
      } else if (controlName.includes('Cpf')) {
        maskConfig.mask = '000.000.000-00';
      } else if (controlName.includes('Cnpj')) {
        maskConfig.mask = '00.000.000/0000-00';
      } else if (controlName.includes('Cep')) {
        maskConfig.mask = '00000-000';
      } else if (controlName === 'revenue') {
        maskConfig.mask = 'separator.2';
        maskConfig.prefix = 'R$ ';
        maskConfig.thousandSeparator = '.';
      } else if (controlName.includes('cnae')) {
        maskConfig.mask = '00.00-0-00';
      } else if (controlName.includes('zipCode')) {
        maskConfig.mask = '00000-000';
      }

      if (maskConfig.mask) {
        this.maskByInput.push(maskConfig);
      }

      if(maskConfig.type){
        console.log(maskConfig.type, 'Configuração do input')
      }

    });
  }

  public getMaskConfig(inputName: string) {
    return this.maskByInput.find((config:any) => config.name === inputName);
  }

  // * Finnaly methods methods

  trackByFn(index: number, item: string): string {
    return item;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



}
