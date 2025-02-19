import { Component, EventEmitter, inject, Output } from "@angular/core";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { NotesService } from "../services/notes.service";
 @Component({
  selector: "app-pages-note",
  templateUrl: "./note.component.html",
  standalone: true,
  animations: [fadeInOut],
  imports:[FormsModule, NgClass, NgIf]
})

export class noteComponent {

  @Output() closeNoteEditor = new EventEmitter<string>();
  private noteService = inject(NotesService)



  maxLength = 280;
  text = '';
  public errorMessage !: string;

  public closeModal(){
    this.closeNoteEditor.emit('close note editor');
  }
  public maxInputLength() {
    // Apenas uma verificação para garantir que o valor não ultrapasse o limite
    if (this.text.length > this.maxLength) {
      this.text = this.text.substring(0, this.maxLength);
    }
  }

  //*Calcula a quantidade de caracteres restantes para anotação

  get remainingCharacters(): number {
    return this.maxLength - this.text.length;
  }

  public saveNote(text:string) {
    if(text.trim() === ''){
      this.errorMessage = 'Informe uma anotação para salvar.'
    }
    else {
      const crId = ''
      this.noteService.saveNote(text, crId)
      .pipe()
      .subscribe({
        next: (response) => {
            console.log(response, 'resposta depois de salvar a nota')
        },
        error: (error) => {
          console.error(error, 'Mostrando o erro ao salvar a anotação')
        }
    })
    }
  }

}
