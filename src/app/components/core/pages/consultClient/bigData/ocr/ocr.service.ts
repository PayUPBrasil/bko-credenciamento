import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../../../../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { BasicData, ConsultingParamsBigData } from "./types/bigData.interface";

@Injectable({
  providedIn: 'root'
})

export class OcrService {

  private url  = environment.api.url;
  private http = inject(HttpClient)
  public lawTitles : any = []

  public returnObje : any = {}


  //* BigData
  public searchInformationAtBigDataCorp(consultingParams:ConsultingParamsBigData) : Observable<any>  {
    const body = {
      document: consultingParams.document,
      datasets: consultingParams.datasets
    }
      return this.http.post(`${this.url}/ocr/bigData`, body)
  }


  public forceNewSearchAtBigDataCorp(document:string) : Observable<any> {
    const body = {
      document: document
    }
    return this.http.post<any>(`${this.url}/ocr/bigData/force`, body, {observe:'response'})
  }



    //* Gemini

  public searchTermWithAI(terms:string) : Observable<any> {
    const body = {
      prompt: terms
    }
    return this.http.post(`${this.url}/gemini`, body)
  }

  //* Methods for support PF

  public filterBasicDataPF(basicData: BasicData) {
    return {
        Documento: this.formaterDocument(basicData.TaxIdNumber),
        PaisIdFiscal: basicData.TaxIdCountry,
        Nome: basicData.Name,
        Genero: basicData.Gender,
        DataNascimento: this.formaterDate(basicData.BirthDate),
        Idade: basicData.Age,
        PaisNascimento: basicData.BirthCountry,
        NomeMae: basicData.MotherName,
        // NomePai: basicData.FatherName,
        StatusIdFiscal: basicData.TaxIdStatus,
        OrigemIdFiscal: basicData.TaxIdOrigin,
        RegiaoFiscalIdFiscal: basicData.TaxIdFiscalRegion,
        IndicacaoObito: this.translateBooleanValue(basicData.HasObitIndication),
        DataUltimaAtualizacao:  this.formaterDate(basicData.LastUpdateDate),
    }
  }

  public filterPocessInformation(processInformation: any) : Object {
    return Object.fromEntries(
      Object.entries(processInformation).map(([key, value]) => [key, value])
    );
  }



  public filterFinancialInterestsInformationPF(financialInterestsInformation:any) :Object {
    return {
      NivelAtividadeFinanceira:this.translateFinancialActivityLevel(financialInterestsInformation.FinancialActivityLevel),
      EProprietarioSetorFinanceiro:this.translateBooleanValue(financialInterestsInformation.IsFinancialSectorOwner),
      EFuncionarioSetorFinanceiro:this.translateBooleanValue(financialInterestsInformation.IsFinancialSectorEmployee),
    }
  }

  public filterFinancialRiskPF(financialRiskInformation:any) : Object{
    return {
      TotalAtivos: financialRiskInformation.TotalAssets || 'Não informado',
      FaixaRendaEstimativa: financialRiskInformation.EstimatedIncomeRange || 'Não informado',
      EstaAtualmenteEmpregado: this.translateBooleanValue(financialRiskInformation.IsCurrentlyEmployed ?? null),
      EhProprietarioAtualmente: this.translateBooleanValue(financialRiskInformation.IsCurrentlyOwner ?? null),
      DataInicioUltimaOcupacao: financialRiskInformation.LastOccupationStartDate ? this.formaterDate(financialRiskInformation.LastOccupationStartDate) : 'Não informado',
      EstaAtualmenteEmCobranca: this.translateBooleanValue(financialRiskInformation.IsCurrentlyOnCollection ?? null),
      OcorrenciasCobrancaUltimos365Dias: financialRiskInformation.Last365DaysCollectionOccurrences ?? 'Não informado',
      MesesConsecutivosCobrancaAtuais: financialRiskInformation.CurrentConsecutiveCollectionMonths ?? 'Não informado',
      EstaAtualmenteRecebendoAssistencia: this.translateBooleanValue(financialRiskInformation.IsCurrentlyReceivingAssistance ?? null),
      PontuacaoRiscoFinanceiro: financialRiskInformation.FinancialRiskScore ?
        `${financialRiskInformation.FinancialRiskScore} → (Quanto mais próximo a 1000 melhor).` : 'Não informado',
      NivelRiscoFinanceiro: financialRiskInformation.FinancialRiskLevel ?
        `${financialRiskInformation.FinancialRiskLevel} → Valores de A até H → onde A (menor risco) a H (maior risco).` : 'Não informado',
    };
  }

  public filterResumeInformationPF(processInformation:any) : Object {
    return {
      DistribuicaoAssuntoAmplo:processInformation.CnjBroadSubjectDistribution,
      DistribuicaoTipoProcedimento: processInformation.CnjProcedureTypeDistribution,
      DistribuicaoAssunto: processInformation.CnjSubjectDistribution,
      DistribuicaoNivelTribunal: processInformation.CourtLevelDistribution,
      DistribuicaoNomeTribunal: processInformation.CourtNameDistribution,
      DistribuicaoTipoTribunal: processInformation.CourtTypeDistribution,
      DistribuicaoTipoParte: processInformation.PartyTypeDistribution,
      DistribuicaoEstado: processInformation.StateDistribution,
      DistribuicaoStatus: processInformation.StatusDistribution,
      TotalProcessos:processInformation.TotalLawsuits,
      DistribuicaoTipo: processInformation.TypeDistribution
    }
  }

    //* Methods for support PJ -->

    public filterBasicDataPJ(basicData:any) : Object{
      return {
        Documento: this.formaterDocument(basicData.TaxIdNumber),
        PaisIdFiscal: basicData.TaxIdCountry,
        RazaoSocial: basicData.OfficialName,
        RegimeDeCobranca: basicData.TaxRegime,
        TipoDeEmpresaNaReceitaFederal: basicData.CompanyType_ReceitaFederal,
        DataDeAbertura: this.formaterDate(basicData.FoundedDate),
        IdadeDaAberturaDoCNPJ: basicData.Age,
        StatusIdFiscal: basicData.TaxIdStatus,
        OrigemIdFiscal: basicData.TaxIdOrigin,
        CapitalSocial: basicData.AdditionalOutputData.Capital ?  basicData.AdditionalOutputData.Capital : '-',
        DataUltimaAtualizacao:  this.formaterDate(basicData.LastUpdateDate),
        TeveAlteracaoNoNomeFantasa:  basicData.HistoricalData ?  this.translateBooleanValue(basicData.HistoricalData.HasChangedTradeName) : '-',
        NaturezaJuridica: basicData.LegalNature.Activity + '-' + basicData.LegalNature.Code,
      }
    }


    public filterResumeInformationPJ(processInformation:any) : Object {
      return {
        DistribuicaoAssuntoAmplo:processInformation.CnjBroadSubjectDistribution,
        DistribuicaoTipoProcedimento: processInformation.CnjProcedureTypeDistribution,
        DistribuicaoAssunto: processInformation.CnjSubjectDistribution,
        DistribuicaoNivelTribunal: processInformation.CourtLevelDistribution,
        DistribuicaoNomeTribunal: processInformation.CourtNameDistribution,
        DistribuicaoTipoTribunal: processInformation.CourtTypeDistribution,
        DistribuicaoTipoParte: processInformation.PartyTypeDistribution,
        DistribuicaoEstado: processInformation.StateDistribution,
        DistribuicaoStatus: processInformation.StatusDistribution,
        TotalProcessos:processInformation.TotalLawsuits,
        DistribuicaoTipo: processInformation.TypeDistribution,

      }
    }



    //* Utils -> Functions to support all process

    protected translateBooleanValue(value:any) {
      return value == true ? 'Sim' : 'Não'
    }

    protected translateFinancialActivityLevel(value:any) {
     return value == 'VERY HIGH' || value == 'HIGH' ? 'Alto' : value == 'VERY LOW' ? "Baixíssimo" : value == 'LOW' ? 'Baixo' : value
    }

    protected translatePartyDistribution(values: any[]) {
      return values.map((value: any) => {
          switch (value) {
              case 'CLAIMED':
                  return 'Reivindicado';
              case 'AUTHOR':
                  return 'Autor';
              case 'DEFENDANT':
                  return 'Réu';
              case 'DEFENDENTE':
                  return 'Réu';
              case 'CLAIMANT':
                  return 'Reclamante';
              case 'LAWYER':
                  return 'Advogado';
              case 'REPORTER':
                  return 'Relator';
              case 'ATTORNEY':
                  return 'Procurador';
              case 'WITNESS':
                  return 'Testemunha';
              case 'VICTIM':
                  return 'Vítima';
              case 'JUDGE':
                  return 'Juiz';
              case 'INMATE':
                  return 'Detento';
              case 'OTHER':
                  return 'Outros';
              default:
                  return value;
          }
      });
    }


    protected formaterDate(date:string) {
       return new Intl.DateTimeFormat('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        timeZone: 'UTC'
      }).format(new Date(Date.parse(date)));

    }

    public formaterDocument(document: string): string {
      const cleanDoc = document.replace(/\D/g, '');

      if (cleanDoc.length === 11) {
        return cleanDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      } else if (cleanDoc.length === 14) {
        return cleanDoc.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
      }
      return document;
    }


}
