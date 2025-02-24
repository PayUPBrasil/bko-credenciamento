import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { FormsModule } from "@angular/forms";
import { NgClass,  NgIf } from "@angular/common";
import { NotesService } from "../services/notes.service";
import { GetUserLoggedService } from "../../../../../../services/utils/getUserData.service";
 @Component({
  selector: "app-pages-note",
  templateUrl: "./note.component.html",
  standalone: true,
  animations: [fadeInOut],
  imports:[FormsModule, NgClass, NgIf]
})

export class noteComponent implements OnChanges, OnInit {


  @Output() closeNoteEditor = new EventEmitter<string>();
  @Input() crId!: string;
  @Input() noteId!: string;
  @Input() value!:any;
  private getUserLoggedService = inject(GetUserLoggedService)
  private noteService = inject(NotesService)
  public userLoggedData! : any;

  maxLength = 280;
  text = '';
  public errorMessage !: string;


  ngOnChanges(changes: SimpleChanges): void {
    this.text = this.value || '';
   }

   ngOnInit(): void {
    this.getUserLoggedService.tokenDecodedData()
    this.getUserInformation()
   }

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
      this.noteService.saveNote(text, this.crId, this.noteId ? this.noteId : '')
      .pipe()
      .subscribe({
        next: (response) => {
            if(response || response == null){
              window.location.reload();
            }
        },
        error: (error) => {
          console.error(error, 'Mostrando o erro ao salvar a anotação')
        }
    })
    }
  }


  //* Captura as informações do usuário logado.

  private getUserInformation(): any {
    console.log('capturando as informações do usuário logado...')
    return this.userLoggedData = {
      email: this.getUserLoggedService.userLoggedData.email,
      name:'string'
    }
  }


}
