import { DatePipe, NgFor, NgIf, NgStyle } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { NotesService } from "../services/notes.service";

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
  protected thisNoteIsFromThisUserLogged = false;
  private notesService = inject(NotesService)
  ngOnInit(): void {
      this.notesService.getNotes(this.crId)
      .pipe()
      .subscribe((notes: any) => {
         this.listOfNotes = notes;
      });
  }

  public showCompleteNote(noteId:string){
    this.showNote = true;
    this.listOfNotes.forEach((note:any) => {
      if(note.noteId === noteId){
        this.noteById = note;
      }
    });
  }

  public deleteNote(noteId:string){
    console.log(noteId, 'noteId que desejo deletar')
  }

}
