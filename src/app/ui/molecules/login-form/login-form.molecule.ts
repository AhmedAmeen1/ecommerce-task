import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { InputAtom } from "../../atoms/input/input.atom";
import { ButtonAtom } from "../../atoms/button/button.atom";
import { FormsModule } from '@angular/forms';           // ← add this


@Component({
  selector: "ui-login-form",
  standalone: true,
  imports: [CommonModule, InputAtom, ButtonAtom, FormsModule],
  template: `
    <div class="card" style="max-width:420px;margin:40px auto;">
      <h2>Welcome back</h2>
      <form (ngSubmit)="submit()" #f="ngForm">
        <ui-input label="Username" [(model)]="username" placeholder="e.g. alice"></ui-input>
        <div style="height:8px"></div>
        <ui-input label="Password" type="password" [(model)]="password" placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"></ui-input>
        <div style="height:16px"></div>
        <ui-button><span (click)="submit()">Login</span></ui-button>
      </form>
      <p *ngIf="error" style="color:#b00020;">{{error}}</p>
    </div>
  `
})
export class LoginFormMolecule {
  username = "";
  password = "";
  error: string | null = null;
  @Output() login = new EventEmitter<{username:string; password:string}>();
  submit() {
    if (!this.username || !this.password) { this.error = "Please enter username and password."; return; }
    this.error = null;
    this.login.emit({ username: this.username, password: this.password });
  }
}
