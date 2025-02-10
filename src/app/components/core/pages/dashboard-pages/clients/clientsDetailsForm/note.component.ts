import { Component, EventEmitter, Output } from "@angular/core";
import { fadeInOut } from "../../../../../animations/fadeInAnimation.component";
import { FormsModule } from "@angular/forms";
import { NgClass } from "@angular/common";
 @Component({
  selector: "app-pages-note",
  templateUrl: "./note.component.html",
  standalone: true,
  animations: [fadeInOut],
  imports:[FormsModule, NgClass]
})

export class noteComponent {

  @Output() closeNoteEditor = new EventEmitter<string>();

  public closeModal(){
    this.closeNoteEditor.emit('close note editor');
  }

  maxLength = 280;
  text = '';

  maxInputLength() {
    // Apenas uma verificação para garantir que o valor não ultrapasse o limite
    if (this.text.length > this.maxLength) {
      this.text = this.text.substring(0, this.maxLength);
    }
  }

  get remainingCharacters(): number {
    return this.maxLength - this.text.length;
  }

}
