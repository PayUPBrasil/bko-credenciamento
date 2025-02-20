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
  private notesService = inject(NotesService)
  ngOnInit(): void {
    console.log(this.crId, 'crId')
      this.notesService.getNotes(this.crId)
      .pipe()
      .subscribe((notes: any) => {
         this.listOfNotes = notes;
      });
  }

  public showCompleteNote(noteId:string){
    console.log('showing complete note', noteId)
    this.showNote = true;
    this.listOfNotes.forEach((note:any) => {
      if(note.noteId === noteId){
        console.log(typeof(note),'note')
        this.noteById = note;
        console.log(note, 'note depois de validar se o id é igual')
      }
    });
  }

}
