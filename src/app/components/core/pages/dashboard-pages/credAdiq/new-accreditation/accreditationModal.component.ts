import {  NgFor,  CommonModule } from "@angular/common";
import { Component, inject, Input, Output, EventEmitter } from "@angular/core";
import { TecnologyTableAdiq } from "../../../../../../services/utils/tecnologyTableAdiq.service";
@Component({
  selector: "app-pages-accreditationModal",
  templateUrl: "./accreditationModal.component.html",
  standalone: true,
  imports: [ NgFor,  CommonModule]
})

export class AccreditationModalComponent {

  @Input() produtosAdicionados!: any[]
  @Input() productIcon!: string;
  @Input() errorMessage!: string;
  @Output() newItemEvent = new EventEmitter<string>();

  private tecnologyTableAdiq = inject(TecnologyTableAdiq)

  public checkAndReturnProductName(productId: string) {

    let tecnologyName = ''
    let tecnologyList = this.tecnologyTableAdiq.getTecnologyTableAdiq().filter(tecnology => {

      if (tecnology.cod === productId) {
        tecnologyName = tecnology.tecnologia
        return tecnology.tecnologia
      }
      return tecnologyName
    })


    return tecnologyName
  }



  public continue() {
    window.location.reload() //* Atualizando a página para atualizar a lista de credenciamento
    this.newItemEvent.emit('ir para página de clientes')
  }

}
