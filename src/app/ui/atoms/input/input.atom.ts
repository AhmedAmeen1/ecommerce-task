import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "ui-input",
  standalone: true,
  imports: [FormsModule],
  template: `
    <label>
      <div><small class="muted">{{label}}</small></div>
      <input [type]="type" [(ngModel)]="model" (ngModelChange)="modelChange.emit($event)" [placeholder]="placeholder">
    </label>
  `
})
export class InputAtom {
  @Input() label = "";
  @Input() type: "text" | "password" | "email" = "text";
  @Input() placeholder = "";
  @Input() model = "";
  @Output() modelChange = new EventEmitter<string>();
}
