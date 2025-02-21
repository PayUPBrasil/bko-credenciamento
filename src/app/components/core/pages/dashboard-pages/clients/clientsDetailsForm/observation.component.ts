import { DatePipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { NotesService } from "../services/notes.service";
import { GetUserLoggedService } from "../../../../../../services/utils/getUserData.service";
import { noteComponent } from "./note.component";

@Component({
  selector: 'app-pages-client-detail-observation',
  templateUrl: './observation.component.html',
  imports: [NgIf, NgFor, DatePipe, NgStyle, noteComponent],
  standalone: true,

})

export class ObservationDetailsComponent implements OnInit {
  @Input() crId:any = []

  public listOfNotes : any = []
  public noteById: any;
  protected showNoteModal = false;
  protected showNote = false;
  protected editingNote = false;
  protected editingNoteModal = false;
  private notesService = inject(NotesService)
  private getUserLoggedService = inject(GetUserLoggedService)
  ngOnInit(): void {
      this.getAllNotesFromClient()
      this.getUserLoggedService.tokenDecodedData()

  }

  public showCompleteNote(noteId:string) : void{
   this.changeNoteModalVisibility()
    this.addNoteToListOfNotes(noteId);
  }

  protected changeNoteModalVisibility() :void {
    this.showNoteModal = !this.showNoteModal;
    this.showNote = !this.showNote;
  }
  private editNoteModalVisibility() :void {
    this.editingNoteModal = !this.editingNoteModal;
  }

  public deleteNote(noteId:string) : void{
    this.notesService.deleteNote(noteId, this.crId)
    .pipe()
    .subscribe({
      next: (response: any) => {
        console.log(response, 'response')
        console.log('Nota deletada com sucesso')
        this.getAllNotesFromClient()
      },
      error: (error: any) => {
        console.error('Erro ao deletar a nota:', error);
      }
    })
  }

  private getUserAuthenticatedEmail(): string {
    return this.getUserLoggedService.userLoggedData.email
  }

 private getAllNotesFromClient() : any{
      this.notesService.getNotes(this.crId)
      .pipe(
      )
      .subscribe((notes: any) => {
        this.getUserAuthenticatedEmail()
        this.listOfNotes = notes.map((note: any) => {
          return {
            ...note,
            isFromLoggedUser: note.user.email === this.getUserAuthenticatedEmail()
          };
        });
      });
    }

   public  editNote(noteId:string){
    this.addNoteToListOfNotes(noteId)
    this.editNoteModalVisibility()
    }

    private addNoteToListOfNotes(noteId:any){
      this.listOfNotes.forEach((note:any) => {
        if(note.noteId === noteId){
          this.noteById = note;
        } else if(note.user.email == this.getUserAuthenticatedEmail()){
          console.log('Esse comentário é do usuário logado')
        }
      });
    }
}
