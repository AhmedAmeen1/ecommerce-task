import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RegisterFormMolecule } from '../../ui/molecules/register-form/register-form.molecule';

@Component({
  standalone: true,
  selector: 'app-register-page',
  imports: [CommonModule, RegisterFormMolecule],
  template: `
    <div class="container">
      <ui-register-form (register)="onRegister($event)"></ui-register-form>
    </div>
  `
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  onRegister({ username, email, password }: { username: string; email: string; password: string }) {
    this.auth.register({ username, email, password }).subscribe({
      next: () => {
        alert('Account created! You can log in now.');
        this.router.navigateByUrl('/login');
      },
      error: (err) => alert(err?.error?.message ?? 'Registration failed')
    });
  }
}
