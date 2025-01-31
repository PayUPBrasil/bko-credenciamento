import { Component, inject, Input } from "@angular/core";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-layout-form-modal",
  templateUrl: "./comboboxModal.component.html",
  standalone: true,
  imports: [ReactiveFormsModule]
})

export class ComboboxModalComponent {

  @Input() modalValues !: any;
  private fb = inject(FormBuilder)

  ngOnInit(): void {
     this.modalValues.form.formName = this.fb.group({

     })
  }

}
