import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { OcrFormInputs } from "../types/ocr.interface";
import { NgClass, NgFor, NgIf } from "@angular/common";
import { NgxMaskDirective, provideNgxMask } from "ngx-mask";
import { CpfCnpjValidatorDirective } from "../../../../../../../directives/validators/cpfcnpj-validator.directive";
import { fadeInOut } from "../../../../../../animations/fadeInAnimation.component";
import { DataSetListService } from "../../../../../../../services/utils/datasetsList.service";
import { CheckBoxService } from "../../../../../layout/interface-helpers/checkbox.service";

@Component({
  selector: "app-pages-onboarding-form",
  templateUrl: "./onboardingForm.component.html",
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, CpfCnpjValidatorDirective,  NgxMaskDirective, NgIf, NgClass],
  providers: [provideNgxMask()],
  animations:[fadeInOut]

})

export class onboardingFormComponent implements OnInit{
[x: string]: any;

  private activateRoute = inject(ActivatedRoute)
  protected type !: string;
  private fb = inject(FormBuilder)
  private checkboxService = inject(CheckBoxService)
  private route = inject(Router)
  public ocrForm !: FormGroup;
  public inputsList : OcrFormInputs[] = [];
  public datasetModal = false;
  public listDatasetByType !: object[]

  public datasets : string[] = []
  public dataSetListService = inject(DataSetListService)

  public buttonContinueData = {
    title: 'Continuar Consulta',
    color: 'text-white',
    bg_color: 'bg-red-500',
    aria_label: 'Botão de Buscar Informações do Cliente',
    disabled: true,
    loadingStatus: 'hidden',
  }


ngOnInit(): void {
      this.activateRoute.params.subscribe({
        next: (params) => {
          this.type = params['type'];
          if(params['type'] == 'pf'){
            this.inputsList = this.createPfInputsToEdit()
            this.listDatasetByType = this.dataSetListService.getPFDatasetList()
          } else {
            this.inputsList =  this.createPjInputsToEdit()
            this.listDatasetByType = this.dataSetListService.getPJDatasetList()
          }
        }
      })
      console.log(this.datasets,'verificando os datasets ao iniciar o componente')
      this.createForm();
      return
}

public createForm(): void {
  const formGroup: { [key: string]: any } = {};
  this.inputsList.forEach((input: OcrFormInputs) => {
    let validators = [Validators.required];

    if (input.id === 'cpf') {
      validators.push(Validators.minLength(11));
      validators.push(Validators.maxLength(14));
      validators.push(CpfCnpjValidatorDirective.validateCpf());
    } else if (input.id === 'cnpj') {
      validators.push(Validators.minLength(14));
      validators.push(Validators.maxLength(18));
      validators.push(CpfCnpjValidatorDirective.validateCnpj());
    }

    formGroup[input.id] = ['', validators];
  });
  this.ocrForm = this.fb.group(formGroup);
}

public checkIfFormHasErrors(): void{
  const controls = Object.keys(this.ocrForm.controls)
  const inputL = this.ocrForm.get(controls[0])
  if(this.ocrForm.invalid || inputL?.value.length < 11) {
    this.buttonContinueData.disabled = true;
  } else {
   this.buttonContinueData.disabled = false;
  }

}

  public createPjInputsToEdit() {
    return [
      {
        id: 'cnpj',
        label: 'Documento',
        type: 'text',
        mask: '00.000.000/0000-00',
        required: true,
        dependsOn: 'pj',
        placeholder: '00.000.000/0000-00'
      },
  ]
  }

  public createPfInputsToEdit() {
    return [
      {
        id: 'cpf',
        label: 'Documento',
        type: 'text',
        mask: '000.000.000-00',
        required: true,
        dependsOn: 'pf',
        placeholder: '000.000.000-00'
      },
    ]
  }

  public searchOcrInformation() : void {
    const formValues =  {... this.ocrForm.value}
    if(this.datasets && formValues.cnpj || formValues.cpf) {
      let datasetinformation = this.datasets.join(',') || ''
      this.route.navigate(['/dashboard/ocr/result', formValues.cnpj || formValues.cpf, datasetinformation
      ])
    }

    //Disbled button when button is clicked
    this.disableButton();
  }

  public disableButton(): void {
    this.buttonContinueData.disabled = true
    this.buttonContinueData.loadingStatus = "visible"
  }

  public changeConsultingType(){
    this.clearDatasets()
    this.route.navigate(['/dashboard/consultar-cliente'])

  }

  public closeDataSetModal(){
    this.datasetModal = !this.datasetModal
  }

  public clickedItemOnCheckbox(event:any)
  {
    this.datasets = event
  }

  public clearDatasets() : void {
    this.checkboxService.valueSelected = []
  }
}
