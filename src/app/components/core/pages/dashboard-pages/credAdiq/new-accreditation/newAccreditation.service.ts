import { inject, Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../../../../environments/environment.development";
import { SessionService } from "../../../../../../services/session/session.service";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})




export class NewAccreditationService {

  private httpClient = inject(HttpClient)
  private url = environment.api.url
  private gatewayUrl = environment.api.url_gateway
  private CrId: any = ''
  private sessionService = inject(SessionService)

  //Lista com nome dos campos
  public basicDataDetailsStatus = 'Pendente'
  public contractDataFieldsDetailsStatus = 'Pendente'
  public addressDataFieldsDetailsStatus = 'Pendente'
  public bankDataFieldsDetailsStatus = 'Pendente'
  public partnerDataFieldsDetailsStatus = 'Pendente'
  public operationDataFieldsDetailsStatus = 'Pendente'
  public productConfigurationFieldsDetailsStatus = 'Pendente'
  public contactDataDetailsStatus = 'Pendente'

  public registerNewClient(client: any, accreditationEnterprise: string, codProdutos: any, type: string): Observable<any> {

    let body;
    if (type === 'PF') {
      body = {

        data: {
          type: type,
          basicData: {
            cpf: client.cpf,
            name: client.name,
            nameOnInvoice: client.nameOnInvoice,
            birthdayDate: client.birthdayDate,
            nationality: client.nationality,
            tradeName: client.tradeName,
            revenue: client.revenue,
            revenueReferenceMonthYear: client.revenueReferenceMonthYear,
          },
          contact: {
            contactEmail: client.contactEmail,
            contactPhone: client.contactPhone,
            contactResponsability: client.contactResponsability,
          },

          address: [{
            zipCode: client.zipCode,
            street: client.street,
            addressNumber: client.addressNumber,
            complement: client.complement,
            neighborhood: client.neighborhood,
            city: client.city,
            state: client.state,
          }],

          bank: [{
            codBank: client.codBank,
            ag: client.ag,
            cC: client.cC,
            agDigito: client.agDigito,
            chavePix: [
              {
                chavePix: client.chavePix
              }
            ],
            accountType: client.accountType,
            codProdutos: codProdutos,

            accountResponsibleName: client.accountResponsibleName,
            accountResponsibleDoc: client.accountResponsibleDoc,
          }],

          operation: {
            shopping: client.establishmentLocatedInShopping,
            shoppingDesc: client.shoppingDesc,
            openingHours: client.openingHours,
          },

          productConfiguration: {
            paymentType: client.paymentType
          }
        },
        accreditationEnterprise: accreditationEnterprise
      }
    } else {

      body = {
        data: {
          type: type,
          basicData: {
            cnpj: client.cnpj,
            tradeName: client.tradeName,
            corporateName: client.corporateName,
            commercialActivity: client.commercialActivity,
            enterpriseType: client.enterpriseType,
            openingDate: client.openingDate,
            mcc: client.codMcc,
            cnae: client.cnae,
            status: 'Pendente',
            legalNature: client.legalNature,
            revenue: client.revenue,
            revenueReferenceMonthYear: client.revenueReferenceMonthYear,
            incorporationDate: client.incorporationDate,
            nameOnInvoice: client.nameOnInvoice,
            matriz: client.matriz
          },

          contractData: {
            number: client.number,
            issuingBody: client.issuingBody,
            contractState: client.contractState,
            contractIssueDate: client.contractIssueDate,
            taxation: client.taxation
          },

          address: [{
            zipCode: client.zipCode,
            street: client.street,
            addressNumber: client.addressNumber,
            complement: client.complement,
            neighborhood: client.neighborhood,
            city: client.city,
            state: client.state,
          }],

          bank: [{
            codBank: client.codBank,
            ag: client.ag,
            cC: client.cC,
            agDigito: client.agDigito,
            chavePix: [
              {
                chavePix: client.chavePix
              }
            ],

            accountType: client.accountType,
            codProdutos: codProdutos,
            accountResponsibleName: client.accountResponsibleName,
            accountResponsibleDoc: client.accountResponsibleDoc,
          }],

          partners: [{
            partnerName: client.partnerName,
            partnerDocument: client.partnerCpfCnpj,
            typePartnerDocument: client.typePartnerDocument,
            typePartnerDocumentNumber: client.partnerDocument,
            partnerMotherName: client.partnerMotherName,
            partnerDocumentExpedidor: client.partnerDocumentExpedidor,
            partnerDocumentDateExpedidor: client.partnerDocumentDateExpedidor,
            partnerDocumentUf: client.partnerDocumentUf,
            partnerBornDate: client.partnerBornDate,
            partnerEmail: client.partnerEmail,
            partnerPhone: client.partnerPhone,
            partnerPosition: client.partnerPosition,
            shareholdingPercentage: client.shareholdingPercentage,
            partnerRelationshipStartDate: client.partnerRelationshipStartDate,
            partnerSignaturePermission: client.partnerSignaturePermission,
            partnerNationality: client.partnerNationality,
            zipCodePartner: client.zipCodePartner,
            streetPartner: client.streetPartner,
            addressNumberPartner: client.addressNumberPartner,
            complementPartner: client.complementPartner,
            statePartner: client.statePartner,
            neighborhoodPartner: client.neighborhoodPartner,
            cityPartner: client.cityPartner,
            country: client.country,
          }],

          operation: {
            shopping: client.establishmentLocatedInShopping,
            shoppingDesc: client.shoppingDesc,
            openingHours: client.openingHours,
          },

          productConfiguration: {
            paymentType: client.paymentType
          }
        },
        accreditationEnterprise: accreditationEnterprise
      }

    }

    return this.httpClient.post<any>(`${this.url}/registerClient`, body).pipe(
      switchMap((response) => {
        console.log(response, 'mostrando o response do switchmap');
        this.CrId = response.message;
        const document = client.cpf || client.cnpj
        console.log(document, ' client.cpf || client.cnpj')
        // Chama a função accreditationAdiq e retorna o resultado dela, se necessário.
        // return this.accreditationAdiq(client, accreditationEnterprise, type, document);
        return this.CrId
      })
    )

  }



  public accreditationAdiq(client: any, accreditationEnterprise: any, type: string, document = '', user:string): Observable<any> {

    let body;

    if (type === 'PF') {
      body = {
        document: document,
        user: this.decodeJwtToken(user).sub,
        adquirente: accreditationEnterprise,
        departamentos: [
          {
            codigo: client.codMcc,
            descricao: client.descMcc,
            combo: client.combo,
            taxa: client.taxa,
          }
        ],
        terminais: [{
          posTerminal: {
            tecnologyCode: client.tecnologyCode
          },
          qt: client.qtSolution
        }],
      }

    } else {

      body = {
        document: document,
        user: this.decodeJwtToken(user).sub,
        adquirente: accreditationEnterprise,
        departamentos: [
          {
            codigo: client.codMcc,
            descricao: client.descMcc,
            cnae: client.cnae,
            combo: client.combo,
            taxa: client.taxa,
          }
        ],
        terminais: [{
          posTerminal: {
            tecnologyCode: client.tecnologyCode
          },
          qt: client.qtSolution
        }],
      }
    }
    return this.httpClient.post(`${this.gatewayUrl}/newRegistration`, body)
  }

  public getCrId() {
    console.log(this.CrId)
    return this.CrId;
  }

  public formProgress(formValues: any) {

    const allFields = [
      'cnpj',
      'cpf',
      'name',
      'birthdayDate',
      'contactEmail',
      'nationality',
      'contactPhone',
      'contactResponsability',
      'corporateName',
      'tradeName',
      'stateRegistration',
      'nameOnInvoice',
      'commercialActivity',
      'openingDate',
      'cnae',
      'situation',
      'legalNature',
      'revenue',
      'revenueReferenceMonthYear',
      'incorporationDate',
      'number',
      'issuingBody',
      'contractState',
      'contractIssueDate',
      'matriz',
      'taxation',
      'accreditationType',
      'zipCode',
      'street',
      'neighborhood',
      'city',
      'state',
      'addressNumber',
      'complement',
      'codBank',
      'ag',
      'cC',
      'agDigito',
      'chavePix',
      'accountType',
      'accountResponsibleName',
      'accountResponsibleDoc',
      'partnerName',
      'partnerCpfCnpj',
      'partnerType',
      'partnerNationality',
      'partnerDocument',
      'typePartnerDocument',
      'partnerMotherName',
      'partnerDocumentExpedidor',
      'partnerDocumentDateExpedidor',
      'partnerDocumentUf',
      'partnerBornDate',
      'partnerEmail',
      'partnerPhone',
      'partnerPosition',
      'shareholdingPercentage',
      'partnerRelationshipStartDate',
      'partnerSignaturePermission',
      'zipCodePartner',
      'streetPartner',
      'neighborhoodPartner',
      'cityPartner',
      'country',
      'statePartner',
      'addressNumberPartner',
      'complementPartner',
      'openingHours',
      'establishmentLocatedInShopping',
      'shoppingDesc',
      'mid',
      'codProd',
      'idCanal',
      'paymentType',
      'tecnologyCode',
      'qtSolution',
      'codMcc',
      'descMcc',
      'combo',
      'taxa',
    ]

    const basicDataFields = [
      'cnpj',
      'cpf',
      'name',
      'birthdayDate',
      'nationality',
      'corporateName',
      'tradeName',
      'stateRegistration',
      'nameOnInvoice',
      'commercialActivity',
      'openingDate',
      'cnae',
      'situation',
      'legalNature',
      'revenue',
      'revenueReferenceMonthYear',
      'incorporationDate',
    ]

    const contractDataFields = [
      'number',
      'issuingBody',
      'contractState',
      'contractIssueDate',
      'matriz',
      'taxation',
      'accreditationType',
    ]

    const addressDataFields = [
      'zipCode',
      'street',
      'neighborhood',
      'city',
      'state',
      'addressNumber',
      'complement',
    ]

    const contactDataFields = [
      'contactPhone',
      'contactResponsability',
      'contactEmail',
    ]

    const bankDataFields = [
      'codBank',
      'ag',
      'cC',
      'agDigito',
      'chavePix',
      'accountType',
      'accountResponsibleName',
      'accountResponsibleDoc',
    ]

    const partnerDataFields = [
      'partnerName',
      'partnerCpfCnpj',
      'partnerType',
      'partnerNationality',
      'partnerDocument',
      'typePartnerDocument',
      'partnerMotherName',
      'partnerDocumentExpedidor',
      'partnerDocumentDateExpedidor',
      'partnerDocumentUf',
      'partnerBornDate',
      'partnerEmail',
      'partnerPhone',
      'partnerPosition',
      'shareholdingPercentage',
      'partnerRelationshipStartDate',
      'partnerSignaturePermission',
      'zipCodePartner',
      'streetPartner',
      'neighborhoodPartner',
      'cityPartner',
      'country',
      'statePartner',
      'addressNumberPartner',
      'complementPartner',
    ]

    const operationDataFields = [
      'establishmentLocatedInShopping',
      'openingHours',
      'shoppingDesc',
    ]


    const productConfigurationFields = [
      'mid',
      'codProd',
      'idCanal',
      'paymentType',
      'tecnologyCode',
      'qtSolution',
      'codMcc',
      'descMcc',
      'combo',
      'taxa',
    ]

    let unfilledFieldsSize = allFields.filter(field => !formValues[field] || formValues[field].trim() === '');
    let fieldsFilledSize = allFields.length - unfilledFieldsSize.length;

    const filledFieldsName = allFields.filter(field => formValues[field] && formValues[field].trim() !== '');

    const filledbasicDataFields = filledFieldsName.filter(field => basicDataFields.includes(field));
    const filledcontactDataFields = filledFieldsName.filter(field => contactDataFields.includes(field));
    const filledcontractDataFields = filledFieldsName.filter(field => contractDataFields.includes(field));
    const filledaddressDataFields = filledFieldsName.filter(field => addressDataFields.includes(field));
    const filledbankDataFields = filledFieldsName.filter(field => bankDataFields.includes(field));
    const filledpartnerDataFields = filledFieldsName.filter(field => partnerDataFields.includes(field));
    const filledoperationDataFields = filledFieldsName.filter(field => operationDataFields.includes(field));
    const filledproductConfigurationFields = filledFieldsName.filter(field => productConfigurationFields.includes(field));


    if (filledbasicDataFields.length === basicDataFields.length) {
      this.basicDataDetailsStatus = "Finalizado";
    } else if (filledbasicDataFields.length > 0) {
      this.basicDataDetailsStatus = "Em Andamento";
    } else {
      this.basicDataDetailsStatus = "Pendente";
    }
    if (filledcontactDataFields.length === contactDataFields.length) {
      this.contactDataDetailsStatus = "Finalizado";
    } else if (filledcontactDataFields.length > 0) {
      this.contactDataDetailsStatus = "Em Andamento";
    } else {
      this.contactDataDetailsStatus = "Pendente";
    }

    if (filledcontractDataFields.length === contractDataFields.length) {
      this.contractDataFieldsDetailsStatus = "Finalizado";
    } else if (filledcontractDataFields.length > 0) {
      this.contractDataFieldsDetailsStatus = "Em Andamento";
    } else {
      this.contractDataFieldsDetailsStatus = "Pendente";
    }

    if (filledaddressDataFields.length === addressDataFields.length) {
      this.addressDataFieldsDetailsStatus = "Finalizado";
    } else if (filledaddressDataFields.length > 0) {
      this.addressDataFieldsDetailsStatus = "Em Andamento";
    } else {
      this.addressDataFieldsDetailsStatus = "Pendente";
    }

    if (filledbankDataFields.length === bankDataFields.length) {
      this.bankDataFieldsDetailsStatus = "Finalizado";
    } else if (filledbankDataFields.length > 0) {
      this.bankDataFieldsDetailsStatus = "Em Andamento";
    } else {
      this.bankDataFieldsDetailsStatus = "Pendente";
    }

    if (filledpartnerDataFields.length === partnerDataFields.length) {
      this.partnerDataFieldsDetailsStatus = "Finalizado";
    } else if (filledpartnerDataFields.length > 0) {
      this.partnerDataFieldsDetailsStatus = "Em Andamento";
    } else {
      this.partnerDataFieldsDetailsStatus = "Pendente";
    }

    if (filledoperationDataFields.length === operationDataFields.length) {
      this.operationDataFieldsDetailsStatus = "Finalizado";
    } else if (filledoperationDataFields.length > 0) {
      this.operationDataFieldsDetailsStatus = "Em Andamento";
    } else {
      this.operationDataFieldsDetailsStatus = "Pendente";
    }

    if (filledproductConfigurationFields.length === productConfigurationFields.length) {
      this.productConfigurationFieldsDetailsStatus = "Finalizado";
    } else if (filledproductConfigurationFields.length > 0) {
      this.productConfigurationFieldsDetailsStatus = "Em Andamento";
    } else {
      this.productConfigurationFieldsDetailsStatus = "Pendente";
    }





  }

  public decodeJwtToken(token: string): any {
    return jwtDecode(token);
  }

}
