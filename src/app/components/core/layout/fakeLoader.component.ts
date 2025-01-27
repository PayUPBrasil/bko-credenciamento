import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-layout-fakeLoader',
  templateUrl: './fakeLoader.component.html',
  standalone: true,
  imports: []
})

export class FakeLoaderComponent implements OnInit {

  public loading = true

  ngOnInit(): void {

    setTimeout(() => {
      this.loading = false;
    }, 3000);

  }
}
