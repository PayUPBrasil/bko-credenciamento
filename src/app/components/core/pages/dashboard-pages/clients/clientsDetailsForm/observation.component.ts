import { DatePipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { NotesService } from "../services/notes.service";
import { GetUserLoggedService } from "../../../../../../services/utils/getUserData.service";

@Component({
  selector: 'app-pages-client-detail-observation',
  templateUrl: './observation.component.html',
  imports: [NgIf, NgFor, DatePipe, NgStyle],
  standalone: true,

})

export class ObservationDetailsComponent implements OnInit {
  @Input() crId:any = []

  public listOfNotes : any = []
  public noteById: any;
  protected showNote = false;
  private notesService = inject(NotesService)
  private getUserLoggedService = inject(GetUserLoggedService)
  ngOnInit(): void {
      this.getAllNotesFromClient()
      this.getUserLoggedService.tokenDecodedData()
      this.getUserAuthenticatedEmail()
  }

  public showCompleteNote(noteId:string){
    this.showNote = true;
    this.listOfNotes.forEach((note:any) => {
      if(note.noteId === noteId){
        this.noteById = note;
      } else if(note.user.email == this.getUserAuthenticatedEmail()){
        console.log('Esse comentário é do usuário logado')
      }
    });
  }

  public deleteNote(noteId:string){
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

  private getUserAuthenticatedEmail(): any {
    return this.getUserLoggedService.userLoggedData.email
    }

    private getAllNotesFromClient(){
      this.notesService.getNotes(this.crId)
      .pipe()
      .subscribe((notes: any) => {
        this.listOfNotes = notes.map((note: any) => {
          return {
            ...note,
            isFromLoggedUser: note.user.email === this.getUserAuthenticatedEmail()
          };
        });
      });

    }

}
