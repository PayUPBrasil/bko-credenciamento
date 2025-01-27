import { Component, ElementRef, ViewChild } from "@angular/core";
import { ButtonPrimaryComponent } from "../../../../layout/buttons/button-primary.component";
import { ActionButtonComponent } from "../../../../layout/buttons/actionButton.component";

@Component({
  selector: "app-pages-document-upload",
  templateUrl: "./documentUpload.component.html",
  standalone: true,
  imports: [ButtonPrimaryComponent, ActionButtonComponent],
})

export class DocumentUploadComponent {

  @ViewChild('fileInput') fileInput!: ElementRef;

  openFileExplorer() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Aqui você pode adicionar lógica para lidar com o arquivo selecionado
      console.log('Arquivo selecionado:', file.name);
    }
  }

}
