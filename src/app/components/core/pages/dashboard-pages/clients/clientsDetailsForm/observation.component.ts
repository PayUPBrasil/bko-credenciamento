import { DatePipe, NgFor, NgIf } from "@angular/common";
import { Component, inject, Input, OnInit } from "@angular/core";
import { NotesService } from "../services/notes.service";

@Component({
  selector: 'app-pages-client-detail-observation',
  templateUrl: './observation.component.html',
  imports: [NgIf, NgFor, DatePipe],
  standalone: true,

})

export class ObservationDetailsComponent implements OnInit {
  @Input() crId:any = []

  public listOfNotes : any = []
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
  }

}
