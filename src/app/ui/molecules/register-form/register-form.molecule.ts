import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';       
import { InputAtom } from '../../atoms/input/input.atom';
import { ButtonAtom } from '../../atoms/button/button.atom';

@Component({
  selector: 'ui-register-form',
  standalone: true,
  imports: [CommonModule, FormsModule, InputAtom, ButtonAtom, RouterLink],
  template: `
    <div class="card" style="max-width:520px;margin:40px auto;">
      <h2>Create your account</h2>

      <form (ngSubmit)="submit()">
        <ui-input label="Username" [(model)]="username" placeholder="e.g. alice"></ui-input>
        <div style="height:8px"></div>

        <ui-input label="Email" type="email" [(model)]="email" placeholder="you@example.com"></ui-input>
        <div style="height:8px"></div>

        <ui-input label="Password" type="password" [(model)]="password" placeholder="••••••••"></ui-input>
        <div style="height:16px"></div>

        <ui-button><span (click)="submit()">Create account</span></ui-button>
      </form>

      <p *ngIf="error" style="color:#b00020;margin-top:10px">{{error}}</p>
      <p *ngIf="hint" class="muted" style="margin-top:6px">{{hint}}</p>

      <p style="margin-top:16px">
        <a class="link" routerLink="/login">Already have an account? Login</a>
      </p>
    </div>
  `
})
export class RegisterFormMolecule {
  username = '';
  email = '';
  password = '';
  error: string | null = null;
  hint: string | null = null;

  @Output() register = new EventEmitter<{username:string; email:string; password:string}>();

  private validEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  submit() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Please fill all fields.';
      this.hint = null;
      return;
    }
    if (!this.validEmail(this.email)) {
      this.error = 'Please enter a valid email.';
      this.hint = null;
      return;
    }
    if (this.password.length < 6) {
      this.error = 'Password should be at least 6 characters.';
      this.hint = null;
      return;
    }
    this.error = null;
    this.hint = 'Submitting...';
    this.register.emit({ username: this.username.trim(), email: this.email.trim(), password: this.password });
  }
}
