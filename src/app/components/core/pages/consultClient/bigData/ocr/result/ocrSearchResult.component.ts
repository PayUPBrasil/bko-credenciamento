import { Component, ElementRef,  inject, OnDestroy, OnInit,  ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormatCpfCnpjPipe } from "../../../../../../../pipes/format-cpf-cnpj.pipe";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { DatePipe, KeyValuePipe, NgClass, NgFor, NgIf } from "@angular/common";
import { OcrService } from "../ocr.service";
import { debounceTime, distinctUntilChanged,  Subject, takeUntil } from "rxjs";
import { TableComponent } from "../../../../../layout/table.component";
import { Root } from "../types/bigData.interface";
import { ExportsFileService } from "../../../../../../../services/utils/exportsFile.service";
import { NotifyComponent } from "../../../../../layout/notifyAlert.component";

@Component({
  selector: "app-pages-ocr-result",
  templateUrl: "./ocrSearchResult.component.html",
  standalone: true,
  imports: [FormatCpfCnpjPipe, NgxSkeletonLoaderModule, NgIf, NgFor, KeyValuePipe, TableComponent, DatePipe, NgClass, NotifyComponent]
})

export class ocrSearchResultComponent implements OnInit, OnDestroy {

  private activatedRoute = inject(ActivatedRoute)
  private ocrService = inject(OcrService)
  private exportsFileService = inject(ExportsFileService)

  protected document !: string;
  public contentLoaded = false
  public showElementHidden= false
  public canClickTheButton = false
  public aiContentLoaded = true
  private destroy$ = new Subject<void>();
  public subjectValues : any[]= []
  public QueryDate = ''


  public returnObje : any = {}
  public notifyItemModal = false
  public hasCriminalProcessToReport !: boolean

  public notifyItem !: any;
  public processInformationCnjProcedureTypeDistribution : any[]  = []
  public processInformationCnjSubjectDistribution : any[]  = []
  public processInformationCourtLevelDistribution : any[]  = []
  public processInformationCourtNameDistribution : any[]  = []
  public processInformationCourtTypeDistribution : any[]  = []
  public processInformationPartyTypeDistribution : any[]  = []
  public processInformationStateDistribution : any[]  = []
  public processInformationStatusDistribution : any[]  = []
  public processInformationTypeDistribution : any[]  = []

  public basicDataInformation : any [] = []
  public resumeInformation : any [] = []
  public financialInterestsInformation : any [] = []
  public IndebtednessQuestionInformation : any [] = []
  public financialRiskInformation : any [] = []

  public resultSearchTerm : any[]= []

  private searchTerms = new Subject<string>();
  private cache: { [key: string]: string } = {};
  private loadingTerms: Set<string> = new Set();

  private router = inject(Router)
  public tableContent = []

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if(!params['document']){
        this.router.navigate(['/dashboard/consultar-cliente']);
      }
      this.document = params['document'];
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
    this.router.navigate(['/dashboard/consultar-cliente']);
  }

  //* Buscando informações do documento na BigData Corp
  public searchInformationAboutDocument(){
    if(this.document) {
      this.ocrService.searchInformationAtBigDataCorp(this.document).pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if(response) {
            this.QueryDate = response.QueryDate //* Data em que a consulta foi realizada
            let type  = this.checkTypeByReturnBigData(response.Result[0].BasicData.TaxIdNumber)

            if(type == 'pf'){
              this.createTabelWithDataByType('pf', response);
            } else if(type == 'pj'){
              this.createTabelWithDataByType('pj', response);
            }
          this.stopLoadingSkeleton()
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
        console.log(result, 'verificano o resultado retornado pela IA')
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
    this.canClickTheButton= true
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  trackByFn(index: number, item: any) {
    return item.id;
  }







  @ViewChild('contentToExport') contentToExport!: ElementRef;


  exportToPdf() {

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

}
