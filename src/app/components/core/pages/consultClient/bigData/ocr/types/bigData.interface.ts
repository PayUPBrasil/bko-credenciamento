export interface Root {
  Result: Result[]
  QueryId: string
  ElapsedMilliseconds: number
  QueryDate: string
  Status: Status
  Evidences: Evidences
}

export interface Result {
  MatchKeys: string
  BasicData: BasicData
  IndebtednessQuestion: IndebtednessQuestion
  LawsuitsDistributionData: LawsuitsDistributionData | any;
  FinancialRisk: FinancialRisk
  FinancialInterests: FinancialInterests
}

export interface BasicData {
  TaxIdNumber: string
  TaxIdCountry: string
  AlternativeIdNumbers: AlternativeIdNumbers
  Name: string
  Aliases: Aliases
  Gender: string
  NameWordCount: number
  NumberOfFullNameNamesakes: number
  NameUniquenessScore: number
  FirstNameUniquenessScore: number
  FirstAndLastNameUniquenessScore: number
  BirthDate: string
  Age: number
  ZodiacSign: string
  ChineseSign: string
  BirthCountry: string
  MotherName: string
  FatherName: string
  MaritalStatusData: MaritalStatusData
  TaxIdStatus: string
  TaxIdOrigin: string
  TaxIdFiscalRegion: string
  HasObitIndication: boolean
  TaxIdStatusDate: string
  TaxIdStatusRegistrationDate: string
  CreationDate: string
  LastUpdateDate: string
}

export interface AlternativeIdNumbers {
  VoterId: string
  SocialSecurityNumber: string
}

export interface Aliases {
  CommonName: string
  StandardizedName: string
}

export interface MaritalStatusData {}

export interface IndebtednessQuestion {
  LikelyInDebt: boolean
}

export interface LawsuitsDistributionData {
  TotalLawsuits: number
  TypeDistribution: TypeDistribution
  CourtNameDistribution: CourtNameDistribution
  StatusDistribution: StatusDistribution
  StateDistribution: StateDistribution
  PartyTypeDistribution: PartyTypeDistribution
  CourtTypeDistribution: CourtTypeDistribution
  CourtLevelDistribution: CourtLevelDistribution
  CnjProcedureTypeDistribution: CnjProcedureTypeDistribution
  CnjSubjectDistribution: CnjSubjectDistribution
  CnjBroadSubjectDistribution: CnjBroadSubjectDistribution
}

export interface TypeDistribution {
  "PROCEDIMENTO DO JUIZADO ESPECIAL CIVEL": number
  "EXECUCAO DE TITULO EXTRAJUDICIAL": number
  "DESPEJO POR FALTA DE PAGAMENTO": number
  "DESPEJO POR FALTA DE PAGAMENTO CUMULADO COM COBRANCA": number
  "CUMPRIMENTO DE SENTENCA": number
}

export interface CourtNameDistribution {
  TJSP: number
}

export interface StatusDistribution {
  ARQUIVADO: number
  "TRANSITADO EM JULGADO": number
  SUSPENSO: number
}

export interface StateDistribution {
  SP: number
}

export interface PartyTypeDistribution {
  CLAIMED: number
}

export interface CourtTypeDistribution {
  "ESPECIAL CIVEL": number
  CIVEL: number
}

export interface CourtLevelDistribution {
  "1": number
}

export interface CnjProcedureTypeDistribution {
  "PROCEDIMENTO DO JUIZADO ESPECIAL CIVEL": number
  "EXECUCAO DE TITULO EXTRAJUDICIAL": number
  "DESPEJO POR FALTA DE PAGAMENTO": number
  "DESPEJO POR FALTA DE PAGAMENTO CUMULADO COM COBRANCA": number
  "CUMPRIMENTO DE SENTENCA": number
}

export interface CnjSubjectDistribution {
  "DEFEITO, NULIDADE OU ANULACAO": number
  COMPROMISSO: number
  "DESPEJO PARA USO PROPRIO": number
  "ESPECIES DE CONTRATOS": number
  "LOCACAO DE IMOVEL": number
  "CAUSAS SUPERVENIENTES A SENTENCA": number
}

export interface CnjBroadSubjectDistribution {
  "DIREITO CIVIL": number
  "DIREITO PROCESSUAL CIVIL E DO TRABALHO": number
}

export interface FinancialRisk {
  TotalAssets: string
  EstimatedIncomeRange: string
  IsCurrentlyEmployed: boolean
  IsCurrentlyOwner: boolean
  LastOccupationStartDate: string
  IsCurrentlyOnCollection: boolean
  Last365DaysCollectionOccurrences: number
  CurrentConsecutiveCollectionMonths: number
  IsCurrentlyReceivingAssistance: boolean
  FinancialRiskScore: number
  FinancialRiskLevel: string
}

export interface FinancialInterests {
  FinancialActivityLevel: string
  IsFinancialSectorOwner: boolean
  IsFinancialSectorEmployee: boolean
  FinancialEducationCertificates: any[]
  RelatedFinancialInstitutionActivities: RelatedFinancialInstitutionActivity[]
  PossibleUtilizedBanks: any[]
}

export interface RelatedFinancialInstitutionActivity {
  RelationshipType: string
  EconomicActivityCode: string
  EconomicActivity: string
  IsMainEconomicActivity: boolean
}

export interface Status {
  basic_data: BasicDaum[]
  indebtedness_question: IndebtednessQuestion2[]
  lawsuits_distribution_data: LawsuitsDistributionDaum[]
}

export interface BasicDaum {
  Code: number
  Message: string
}

export interface IndebtednessQuestion2 {
  Code: number
  Message: string
}

export interface LawsuitsDistributionDaum {
  Code: number
  Message: string
}

export interface Evidences {}
