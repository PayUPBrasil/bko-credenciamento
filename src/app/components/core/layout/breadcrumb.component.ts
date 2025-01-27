import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { Breadcrumb } from './types/breadcrumb.interface';

@Component({
  standalone: true,
  selector: 'app-layout-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  imports: [NgFor]
})

export class BreadcrumbComponent {

  @Input() path !: Breadcrumb[]


}
