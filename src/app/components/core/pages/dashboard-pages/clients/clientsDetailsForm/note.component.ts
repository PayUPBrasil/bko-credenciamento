import { Component, EventEmitter, Output } from "@angular/core";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";

@Component({
  selector: "app-pages-note",
  templateUrl: "./note.component.html",
  standalone: true,
  animations: [fadeInOut]
})

export class noteComponent {

  @Output() closeNoteEditor = new EventEmitter<string>();

  public closeModal(){
    this.closeNoteEditor.emit('close note editor');
  }
}
