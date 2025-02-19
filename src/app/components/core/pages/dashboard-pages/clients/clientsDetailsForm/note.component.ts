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

  public closeModal(){
    this.closeNoteEditor.emit('close note editor');
  }

  maxLength = 280;
  text = '';
  public errorMessage !: string;

  maxInputLength() {
    // Apenas uma verificação para garantir que o valor não ultrapasse o limite
    if (this.text.length > this.maxLength) {
      this.text = this.text.substring(0, this.maxLength);
    }
  }

  get remainingCharacters(): number {
    return this.maxLength - this.text.length;
  }

  public saveNote(text:string) {
    if(text.trim() === ''){
      this.errorMessage = 'Informe uma anotação para salvar.'
    }
    else {
      this.noteService.saveNote(text)
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
