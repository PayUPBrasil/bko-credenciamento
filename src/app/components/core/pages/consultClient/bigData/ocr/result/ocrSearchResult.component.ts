import { Component, ElementRef,  EventEmitter,  inject, OnDestroy, OnInit,  Output,  ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormatCpfCnpjPipe } from "../../../../../../../pipes/format-cpf-cnpj.pipe";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DatePipe, KeyValuePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { OcrService } from "../ocr.service";
import { debounceTime, distinctUntilChanged,  Subject, takeUntil, tap } from "rxjs";
import { TableComponent } from "../../../../../layout/table.component";
import { Root } from "../types/bigData.interface";
import { ExportsFileService } from "../../../../../../../services/utils/exportsFile.service";
import { NotifyComponent } from "../../../../../layout/notifyAlert.component";
import { fadeInOut } from "../../../../../../animations/fadeInAnimation.component";
import { ComboboxModalComponent } from "../../../../../layout/comboboxModal.component";

@Component({
  selector: "app-pages-ocr-result",
  templateUrl: "./ocrSearchResult.component.html",
  standalone: true,
  imports: [FormatCpfCnpjPipe, NgxSkeletonLoaderModule, NgIf, NgFor, KeyValuePipe, TableComponent, DatePipe, NgClass, NotifyComponent, ComboboxModalComponent],
  animations: [fadeInOut]
})

export class ocrSearchResultComponent implements OnInit, OnDestroy {

  @Output() cleanQuery = new EventEmitter<void>()
  private activatedRoute = inject(ActivatedRoute)
  private ocrService = inject(OcrService)
  private exportsFileService = inject(ExportsFileService)


  public contentLoaded = false
  public showElementHidden= false
  public canClickTheButton = false
  public aiContentLoaded = true
  public totalProcess = false
  public linkQueryModal = false
  public notifyItemModal = false
  public notifyItem !: any;
  public isAKnowPerson = false
  public TotalSearchResults = 0
  public hasKYCInformation = false

  public QueryDate = ''

  private destroy$ = new Subject<void>();
  public subjectValues : any[]= []
  protected document !: string;
  protected datasets : any[] = []
  protected newsList: any[] = []
  public returnObje : any = {}
  public hasCriminalProcessToReport !: boolean

  public processInformationCnjProcedureTypeDistribution : any[]  = []
  public processInformationCnjSubjectDistribution : any[]  = []
  public processInformationCourtLevelDistribution : any[]  = []
  public processInformationCourtNameDistribution : any[]  = []
  public processInformationCourtTypeDistribution : any[]  = []
  public processInformationPartyTypeDistribution : any[]  = []
  public processInformationStateDistribution : any[]  = []
  public processInformationStatusDistribution : any[]  = []
  public processInformationTypeDistribution : any[]  = []

public modalFormConfiguration =
  {
    title: 'Pesquisar Cliente',
    description: 'Busque o cliente que você deseja vincular esta consulta.',
    type: 'text',
    required: true,
    disabled: true,
    value: '',
    form: {
      formName:'searchClient',
    }
  }


  public basicDataInformation : any [] = []
  public resumeInformation : any [] = []
  public kcyInformation : any[] = []
  public financialInterestsInformation : any [] = []
  public IndebtednessQuestionInformation : any [] = []
  public financialRiskInformation : any [] = []
  public kcyContent = ''
  public quantityNewsItems = ''
  public resultSearchTerm : any[]= []

  private searchTerms = new Subject<string>();
  private cache: { [key: string]: string } = {};
  private loadingTerms: Set<string> = new Set();

  private router = inject(Router)
  public tableContent = []
  public totalSocialNetworks: any;
  public socialNetworksName : any[] = [];
  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(!params['document']){
        this.router.navigate(['/dashboard/consultar-cliente']);
      }

      this.document = params['document'];

      if(!params['datasets']){
        this.router.navigate([`/dashboard/ocr/result/${this.document}/`]);
      } else if(params['datasets']) {
        const datasetsString = params['datasets'];
        this.datasets = datasetsString.split(',');
      }
    });
    this.searchInformationAboutDocument();
  }

  constructor() {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchTermWithAI(term);
    });
  }

  onMouseEnter(term: any): void {
    if (!this.cache[term] && !this.loadingTerms.has(term)) {
      this.loadingTerms.add(term);
      this.searchTerms.next(term);
    }
  }

  public newConsultingRedirect(){
    this.cleanQuery.emit();
    this.router.navigate(['/dashboard/consultar-cliente']);
  }

  //* Buscando informações do documento na BigData Corp
  public searchInformationAboutDocument(){

    if(this.document && this.datasets.length  > 0) {
       let consultingParams = {
        document:this.document,
        datasets: this.datasets || '',
      }

      this.ocrService.searchInformationAtBigDataCorp(consultingParams).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          console.log(response, 'verificando a resposta da bigdata no controller')
          if(response.Result[0].LawsuitsDistributionData.TotalLawsuits > 0){
            this.totalProcess = true
          }
          if(response) {

            this.QueryDate = response.QueryDate
            let type  = this.checkTypeByReturnBigData(response.Result[0].BasicData.TaxIdNumber)

           if( response.Result[0].BasicData && response.Result[0].BasicData.TaxIdStatus === "CNPJ DOES NOT EXIST IN RECEITA FEDERAL DATABASE"){
            this.canClickTheButton = false
              this.basicDataInformation = ['']
              this.processInformationCnjProcedureTypeDistribution = []
              this.processInformationCnjSubjectDistribution   = []
              this.processInformationCourtLevelDistribution   = []
              this.processInformationCourtNameDistribution   = []
              this.processInformationCourtTypeDistribution   = []
              this.processInformationPartyTypeDistribution   = []
              this.processInformationStateDistribution   = []
              this.processInformationStatusDistribution   = []
              this.processInformationTypeDistribution   = []

            } else if (type == 'pf'){
              this.createTabelWithDataByType('pf', response);
            } else if(type == 'pj'){
              this.createTabelWithDataByType('pj', response);
            }
            this.stopLoadingSkeleton()
            this.createKycResume(response);
            this.canClickTheButton= true
         } else {
          throw new Error('Falha ao buscar informações do documento');
         }
        },
        error: (error) => {
          console.error('Erro ao buscar informações do documento:', error);
        }
      })
    }
  }





  public createKycResume(response:any) {
    this.newsList =   response.Result[0].MediaProfileAndExposure.NewsItems.slice(0, 4);
    this.newsList.length > 0 ? this.isAKnowPerson = true  : false
    this.hasKYCInformation = true

    this.quantityNewsItems = response.Result[0].MediaProfileAndExposure.EntityStatistics.NewsByRangeDate.TotalNews;
    console.log('quntidade de materias atreladas ao cliente', response.Result[0].MediaProfileAndExposure.EntityStatistics.NewsByRangeDate.TotalNews)

    console.log(response.Result[0].AppsNetworksAndPlatforms, 'vendo o que aparece em AppsNetworksAndPlatforms')

    this.totalSocialNetworks = response.Result[0].AppsNetworksAndPlatforms.TotalSocialNetworks
    // this.socialNetworksName = [];
    this.addSocialNameToArrList(response.Result[0].AppsNetworksAndPlatforms)
    this.TotalSearchResults = response.Result[0].AppsNetworksAndPlatforms.TotalSearchResults

  }

  protected addSocialNameToArrList(socialNetworks: any) {
    const {
      HasFacebookProfile,
      HasGithubProfile,
      HasInstagramProfile,
      HasLinkedInProfile,
      HasMercadoLivrePresence,
      HasOLXPresence,
      HasPinterestProfile,
      HasTwitterProfile,
    } = socialNetworks;

    const objValues = {
      HasFacebookProfile,
      HasGithubProfile,
      HasInstagramProfile,
      HasLinkedInProfile,
      HasMercadoLivrePresence,
      HasOLXPresence,
      HasPinterestProfile,
      HasTwitterProfile,
    };

    if (Object.keys(objValues)) {
      this.socialNetworksName.push(
        Object.keys(objValues)
          .filter((item) => objValues[item as keyof typeof objValues] === true)
          .map((item) => this.getSocialNetworkName(item))
      );
    }
  }
public getSocialNetworkName(name:string) {
  switch(name){
    case 'HasFacebookProfile': return 'Facebook';
    case 'HasGithubProfile': return 'Github';
    case 'HasInstagramProfile': return 'Instagram';
    case 'HasLinkedInProfile': return 'LinkedIn';
    case 'HasMercadoLivrePresence': return 'Mercado Livre';
    case 'HasOLXPresence': return 'OLX';
    case 'HasPinterestProfile': return 'Pinterest';
    case 'HasTwitterProfile': return 'Twitter';
    default: return '';
  }
}

public checkTypeByReturnBigData(document:string) : string{
    let cleanDocument = document.replace(/\D/g, '');
    const TYPE_PF = 'pf';
    const TYPE_PJ = 'pj';

    return cleanDocument.length === 14 ? TYPE_PJ : TYPE_PF;
}

  public createTabelWithDataByType(type:string, response:Root) {
     if(type == 'pf'){
      this.basicDataInformation = [this.ocrService.filterBasicDataPF(response.Result[0].BasicData)];
      this.financialInterestsInformation = [this.ocrService.filterFinancialInterestsInformationPF(response.Result[0].FinancialInterests)]
      this.financialRiskInformation = [this.ocrService.filterFinancialRiskPF(response.Result[0].FinancialRisk)]

      response.Result[0].LawsuitsDistributionData.CnjSubjectDistribution ? this.processInformationCnjSubjectDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CnjSubjectDistribution)] : this.processInformationCnjSubjectDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CnjProcedureTypeDistribution ? this.processInformationCnjProcedureTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CnjProcedureTypeDistribution)] : this.processInformationCnjProcedureTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtLevelDistribution ? this.processInformationCourtLevelDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtLevelDistribution)] : this.processInformationCourtLevelDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtNameDistribution ? this.processInformationCourtNameDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtNameDistribution)] : this.processInformationCourtNameDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtTypeDistribution ? this.processInformationCourtTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtTypeDistribution)] : this.processInformationCourtTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.PartyTypeDistribution ? this.processInformationPartyTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.PartyTypeDistribution)] : this.processInformationPartyTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.StateDistribution ? this.processInformationStateDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.StateDistribution)] : this.processInformationStateDistribution = ['']
      response.Result[0].LawsuitsDistributionData.StatusDistribution ? this.processInformationStatusDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.StatusDistribution)] : this.processInformationStatusDistribution = ['']
      response.Result[0].LawsuitsDistributionData.TypeDistribution ? this.processInformationTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.TypeDistribution)] : this.processInformationTypeDistribution = ['']

      //* Se esse item não existir, a tabela não é criada
      response.Result[0].LawsuitsDistributionData ? this.resumeInformation =  [this.ocrService.filterResumeInformationPJ(response.Result[0].LawsuitsDistributionData)] :  this.resumeInformation = ['']

    } else if(type == 'pj'){

      response.Result[0].BasicData ? this.basicDataInformation = [this.ocrService.filterBasicDataPJ(response.Result[0].BasicData)] : [];


      //*Tratando os processos judiciais separadamente por assunto retornado via bigData.
      response.Result[0].LawsuitsDistributionData.CnjSubjectDistribution ? this.processInformationCnjSubjectDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CnjSubjectDistribution)] : this.processInformationCnjSubjectDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CnjProcedureTypeDistribution ? this.processInformationCnjProcedureTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CnjProcedureTypeDistribution)] : this.processInformationCnjProcedureTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtLevelDistribution ? this.processInformationCourtLevelDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtLevelDistribution)] : this.processInformationCourtLevelDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtNameDistribution ? this.processInformationCourtNameDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtNameDistribution)] : this.processInformationCourtNameDistribution = ['']
      response.Result[0].LawsuitsDistributionData.CourtTypeDistribution ? this.processInformationCourtTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.CourtTypeDistribution)] : this.processInformationCourtTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.PartyTypeDistribution ? this.processInformationPartyTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.PartyTypeDistribution)] : this.processInformationPartyTypeDistribution = ['']
      response.Result[0].LawsuitsDistributionData.StateDistribution ? this.processInformationStateDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.StateDistribution)] : this.processInformationStateDistribution = ['']
      response.Result[0].LawsuitsDistributionData.StatusDistribution ? this.processInformationStatusDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.StatusDistribution)] : this.processInformationStatusDistribution = ['']
      response.Result[0].LawsuitsDistributionData.TypeDistribution ? this.processInformationTypeDistribution = [this.ocrService.filterPocessInformation(response.Result[0].LawsuitsDistributionData.TypeDistribution)] : this.processInformationTypeDistribution = ['']

      //* Maneira que os dados devem ser estruturados para que seja possível montar um texto corrido de resumo com os valores dos processos judiciais
      //* Se esse item não existir, a tabela não é criada
      response.Result[0].LawsuitsDistributionData ? this.resumeInformation =  [this.ocrService.filterResumeInformationPJ(response.Result[0].LawsuitsDistributionData)] :  this.resumeInformation = []
    }

    this.hasSomeProcessCriminalToReport()
  }

  public hasSomeProcessCriminalToReport(): boolean {
    // Mapear todos os arrays, verificar se existe a palavra 'Criminal" em qualquer um deles, se sim, retornar true

    const arrayConcat = this.processInformationCnjSubjectDistribution.concat(this.processInformationCnjProcedureTypeDistribution, this.processInformationCourtLevelDistribution,
       this.processInformationCourtNameDistribution, this.processInformationCourtTypeDistribution, this.processInformationPartyTypeDistribution, this.processInformationStateDistribution,
       this.processInformationStatusDistribution, this.processInformationTypeDistribution)

       let possibleCriminalNames = ['CRIMINAL', 'Criminal']
      arrayConcat.some((values) => {
        return Object.keys(values).some((key) => {
          if (possibleCriminalNames.some(criminalName => key.includes(criminalName))) {
            this.hasCriminalProcessToReport = true;
            return true;
          }
          return false;
        });
      });

    return  this.hasCriminalProcessToReport
  }

  public forceRefresh() {
    if(this.document)
    this.ocrService.forceNewSearchAtBigDataCorp(this.document).pipe(
  tap(res => {console.log(res, 'vericicando  a response no tap')})).subscribe(
      {
        next: (response) => {
           if(response.status == 204) window.location.reload();
        },
        error: (error) => {
          // Handle error
          console.error(error, 'verificando o erro')
        }
      }
    )
  }

  //* Buscando termo juridico com AI

  private searchTermWithAI(term: any,): void {
    if (this.cache[term]) {
      this.loadingTerms.delete(term);
      return;
    }

    this.ocrService.searchTermWithAI(term).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (result) => {
        this.cache[term] = result.data.result;
        this.loadingTerms.delete(term);
      },
      error: () => {
        this.loadingTerms.delete(term);
      }
    });
  }

  public getSearchResult(term:any){
    return this.cache[term];
  }

  public isLoading(term: any): boolean {
    return this.loadingTerms.has(term);
  }

  public stopLoadingSkeleton() : void {
    this.contentLoaded = true
    // this.canClickTheButton= true
  }





  trackByFn(index: number, item: any) {
    return item.id;
  }


  public linkQueryState(){
    this.linkQueryModal = !this.linkQueryModal
  }


  @ViewChild('contentToExport') contentToExport!: ElementRef;


  public exportToPdf() {
    this.canClickTheButton = false
    //colocar o loading para rodar ->
    const htmlContent = this.contentToExport.nativeElement.innerHTML;
    const fileName = `Consulting_Result_${this.document}_${new Date().toISOString().slice(0,10)}.pdf`;
    this.exportsFileService.exportToPdf(htmlContent)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob: Blob) => {
        if (blob.type === 'application/pdf' && blob.size > 0) {
          const url = window.URL.createObjectURL(blob);

          // Tenta abrir o PDF em uma nova aba
          // window.open(url, '_blank');

          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          this.canClickTheButton = true
          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } else {
          console.error('O blob recebido não é um PDF válido ou está vazio');
          this.canClickTheButton = true
          alert('Erro ao gerar o PDF. Por favor, tente novamente.');7
          this.notifyItemModal = true;
          this.notifyItem = [
            {
              notifyText: "Não foi possível gerar o PDF corretamente. Tente novamente mais tarde ou contate o administrador do sistema.",
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
        }
      },
      error: (error) => {
        if(error){
          this.canClickTheButton = true
          this.notifyItemModal = true
          this.notifyItem = [
            {
              notifyText: "Erro ao gerar o PDF. Por favor, tente novamente.",
              notifyStatus: true,
              icon: "assets/icons/alertIcon.svg",
              alt: 'Icone de alerta'
            }
          ]
        }
        }
    });

}

ngOnDestroy(): void {
  this.destroy$.next();
  this.destroy$.complete();
}




}
