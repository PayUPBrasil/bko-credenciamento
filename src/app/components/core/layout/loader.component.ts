import { Component, inject } from "@angular/core";
import { LoaderService } from "../../../services/utils/loader.service";
import { CommonModule } from "@angular/common";
@Component({
  selector: "app-layout-loader",
  templateUrl: "./loader.component.html",
  standalone: true,
  imports:[CommonModule]
})


export class LoaderComponent {
  private loaderService = inject(LoaderService)
  public routerIsntLogin = false
  public isLoading = this.loaderService.isLoading$;
}

