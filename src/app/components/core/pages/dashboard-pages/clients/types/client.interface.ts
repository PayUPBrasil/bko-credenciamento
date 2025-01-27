export interface Client {
  basicData: BasicData;
  address: Address[];
  banks: Bank[];
  operation: Operation[];
  codProdutos: CodProdutos[];
  accreditationAdiq: any[];
  clientHistory: any[];
  registerStatus: string;
  registerUuid: string;
  type: "PJ" | "PF";
  contractData?: ContractData; // Só para PJ
  partners?: Partner[]; // Só para PJ
  contact?: Contact; // Só para PF
}

interface BasicData {
  crId: string;
  document: string; // CPF ou CNPJ
  tradeName?: string; // Nome fantasia, só para PJ
  corporateName?: string; // Razão social, só para PJ
  name?: string; // Nome completo, só para PF
  birthdayDate?: string; // Data de nascimento, só para PF
  type: "PJ" | "PF";
  commercialActivity?: string; // Só para PJ
  openingDate?: string; // Só para PJ
  cnae?: string; // Só para PJ
  status?: string; // Só para PJ
  legalNature?: string; // Só para PJ
  revenue?: string; // Só para PJ
  revenueReferenceMonthYear?: string; // Só para PJ
  incorporationDate?: string; // Só para PJ
}

interface Address {
  street: string;
  addressNumber: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  delivery_address: "S" | "N";
}

interface Bank {
  codBank: string;
  ag: string;
  cC: string; // Conta corrente
  chavePix: PixKey[];
  accountResponsibleName: string;
  accountResponsibleDoc: string; // CPF
  accountType?: "C" | "P"; // Conta corrente ou poupança (opcional)
  last_modification: string;
  last_modification_user: string;
}

interface PixKey {
  chavePix: string;
  last_modification: string;
  last_modification_user: string;
  _id: string;
}

interface Partner {
  partnerDocument: string; // CPF
  partnerName: string;
  partnerPosition: string;
  partnerRelationshipStartDate: string;
  partnerSignaturePermission: string;
  typePartnerDocumentNumber?: string;
  partnerDocumentExpedidor?: string;
  partnerBornDate?: string;
  partnerDocumentUf?: string;
  partnerEmail?: string;
  partnerPhone?: string;
  partnerMotherName?: string;
}

interface ContractData {
  number: string;
  issuingBody: string;
  contractState: string;
  contractIssueDate: string;
  taxation: string;
}

interface Operation {
  shopping: string;
  shoppingDesc?: string;
  openingHours: string;
  last_modification: string;
  last_modification_user: string;
}

interface CodProdutos {
  codes: string[];
}

interface Contact {
  contactEmail: string;
  contactPhone: string;
  contactResponsability: string;
}
