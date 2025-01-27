import { NgClass, NgFor } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-layout-pagination',
  templateUrl: './pagination.component.html',
  imports: [NgFor, NgClass],
  standalone: true
})

export class PaginationComponent implements OnInit {
  @Input() totalPages: number[] = [];
  @Input() currentRoute = '';
  public router = inject(Router)
  public route = inject(ActivatedRoute)
  public page = 1
  public pageActive = false

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = +params['page'] || 1;
    });
  }

  public pageNavigation(page: number) {
    this.router.navigate([this.currentRoute, page]);
  }

  nextPage() {
    let paginaAtual = this.page
    console.log(paginaAtual, 'paginaAtual')


    if (isNaN(paginaAtual) || paginaAtual < 1) {
      paginaAtual = 1
    }

    let paginaProxima = paginaAtual + 1

    if (paginaProxima > this.totalPages.length) {
      paginaProxima = paginaAtual
    }

    this.router.navigate([this.currentRoute, paginaProxima]);

  }

  prevPage() {
    let paginaAtual = this.page

    if (isNaN(paginaAtual) || paginaAtual < 1) {
      paginaAtual = 1
    }
    let paginaAnterior = paginaAtual - 1

    if (paginaAnterior < 1) {
      paginaAnterior = paginaAtual
    }

    this.router.navigate([this.currentRoute, paginaAnterior]);
  }


}
