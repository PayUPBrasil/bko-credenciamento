import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { fadeInOut } from '../../animations/fadeInAnimation.component';
import { swipeAnimation } from '../../animations/swipeAnimation.component';
import { Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'app-layout-searchInput',
  imports: [NgIf],
  templateUrl: './searchInput.component.html',
  standalone: true,
  animations: [fadeInOut, swipeAnimation]
})


export class SearchInputComponent {
  public showSearchBar = false;
  @Output() InputValue = new EventEmitter<string>();
  @Input () placeholder = 'Pesquise por CNPJ, Nome...'

  public inputText(value: string) {
    this.InputValue.emit(value)
  }

}
