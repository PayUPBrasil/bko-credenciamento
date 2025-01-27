import { NgFor } from "@angular/common";
import { Component, inject, Input, Output, EventEmitter } from "@angular/core";
import { TecnologyTableAdiq } from "../../../../../../services/utils/tecnologyTableAdiq.service";

@Component({
  selector: 'app-pages-productListConfiguration',
  templateUrl: './productListConfiguration.component.html',
  standalone: true,
  imports: [NgFor]
})

export class ProductListConfigurationComponent {
  @Input() produtosAdicionados!: any[]

  @Output() newRemoveEvent = new EventEmitter<string>();

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

  public removeProduct(productId: string) {
    this.newRemoveEvent.emit(productId)
  }
}
