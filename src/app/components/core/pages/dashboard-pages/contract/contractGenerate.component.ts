import { Component, inject, OnInit } from "@angular/core";
import { ReactiveFormsModule, Validators, FormBuilder } from "@angular/forms";
import { ContractService } from "./contract.service";
import { ContractModalComponent } from "./contractModal.component";
import { TypeEnterpriseService } from "../../../../../services/utils/typeEnterprise.service";
import { NgIf, NgFor, NgClass } from "@angular/common";
import { NgxMaskDirective } from "ngx-mask";
import { CpfCnpjValidatorDirective } from "../../../../../directives/validators/cpfcnpj-validator.directive";
import { FormatCpfCnpjPipe } from "../../../../../pipes/format-cpf-cnpj.pipe";
import { SearchCepService } from "../../../../../services/utils/searchCep.service";
import { Cep } from "../../../../../types/searchCep.interface";
import { catchError, throwError, timeout } from "rxjs";
import { ConfirmModalComponent } from "../../../layout/confirmModal.component";
import { BreadcrumbComponent } from "../../../layout/breadcrumb.component";
import { SimpleTableComponent } from "../../../layout/simpleTable.component";
@Component({
  selector: 'app-pages-contractGenerate',
  templateUrl: './contractGenerate.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, ContractModalComponent, NgIf, NgFor, NgClass, NgxMaskDirective, CpfCnpjValidatorDirective, FormatCpfCnpjPipe, ConfirmModalComponent, BreadcrumbComponent, SimpleTableComponent]
})

export class ContractGenerateComponent implements OnInit{

  private formBuilder = inject(FormBuilder)
  private searchCepService = inject(SearchCepService)
  private contractService = inject(ContractService)
  public contractModal = false;
  private pendingBlob !: Blob;
  public clientResponsabilityList: any = []
  public alertMessage = ''

  public enterpriseTypes = inject(TypeEnterpriseService).getEnterpriseTypes()

  ngOnInit(): void {
      window.scrollTo(0, 0);
  }

  public newContractForm = this.formBuilder.group({
    clientDocument: ['', [Validators.required]],
    clientName: ['', [Validators.required]],
    enterpriseType: ['', [Validators.required]],
    clientPhone: ['', [Validators.required, Validators.minLength(10)]],
    clientEmail: ['', [Validators.required, Validators.email]],
    clientZipCode: ['', [Validators.required]],
    clientStreet: ['', [Validators.required]],
    clientNeighborhood: ['', [Validators.required]],
    clientCity: ['', [Validators.required]],
    clientState: ['', [Validators.required]],
    clientNumber: ['', [Validators.required]],
    clientComplement: [''],
    clientResponsabilityName: [''],
    clientResponsabilityDoc: [''],
  })

  public searchCep() {
    console.log('Buscando CEP...')
    const cep = this.newContractForm.get('clientZipCode')?.value?.replace(/\D/g, '')

    if (cep && cep.length == 8) {
      this.searchCepService.searchCep(cep)
        .pipe(
          timeout(5000),
          catchError(error => {
            if (error.name === 'TimeoutError') {
              console.error('A busca do CEP excedeu o tempo limite de 5 segundos.');
              // Você pode adicionar alguma lógica aqui para notificar o usuário
            }
            return throwError(() => error);
          }
          )
        )
        .subscribe(
          {
            next: (res) => { this.addressFormatter(res) },
            error: (error) => { console.error(error) }
          }
        )
    }
    return null
  }

  public addressFormatter(data: Cep) {
    return this.newContractForm.patchValue({
      clientZipCode: data.data.zipCode,
      clientStreet: data.data.street,
      clientNeighborhood: data.data.neighborhood,
      clientCity: data.data.city,
      clientState: data.data.uf,
      clientComplement: data.data.complement
    });
  }

  public newContract() {
    const formData = this.newContractForm.value;

    delete formData.clientResponsabilityName;
    delete formData.clientResponsabilityDoc;

    const contractData = {
      ...formData,
      partners: this.clientResponsabilityList
    };

    this.contractService.generateContract(contractData).subscribe({
      next: (response: Blob) => {
        this.contractModal = true;
        this.pendingBlob = response;
      },
      error: (error) => {
        console.log(error, 'verificando o erro');
      }
    });
  }

  public closeModal(event: any) {
    this.contractModal = false
  }

  public downloadContractFile() {

    const url = window.URL.createObjectURL(this.pendingBlob!);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contrato_${this.newContractForm.get('clientName')?.value}.docx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }


  public addClientResponsabilityList() {
    const name = this.newContractForm.get('clientResponsabilityName')?.value;
    const doc = this.newContractForm.get('clientResponsabilityDoc')?.value;

    if (name && doc) {
      const data = { clientResponsabilityName: name, clientResponsabilityDoc: doc };

      // Verifica se o valor já existe no array
      const exists = this.clientResponsabilityList.some((item: { clientResponsabilityName: string; clientResponsabilityDoc: string; }) =>
        item.clientResponsabilityName === name && item.clientResponsabilityDoc === doc
      );

      if (!exists) {
        this.clientResponsabilityList.push(data);
        console.log(this.clientResponsabilityList);
        this.alertMessage = '';
      } else {
        this.alertMessage = 'Você já adicionou esse responsável.'
        console.log('Responsabilidade já existe na lista.');
      }
    }
  }


  public removeClientResponsability(event: any) {
    const doc = event;
    this.clientResponsabilityList = this.clientResponsabilityList.filter((item: { clientResponsabilityName: string; clientResponsabilityDoc: string; }) =>
      item.clientResponsabilityDoc !== doc
    );
  }

}
