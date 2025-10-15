import { Component, Input } from "@angular/core";
@Component({
  selector: "ui-button",
  standalone: true,
  template: `<button [disabled]="disabled" class="btn"><ng-content></ng-content></button>`
})
export class ButtonAtom { @Input() disabled = false; }
