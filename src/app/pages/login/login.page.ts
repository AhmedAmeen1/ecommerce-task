import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { AuthStore } from "../../core/store/auth.store";
import { LoginFormMolecule } from "../../ui/molecules/login-form/login-form.molecule";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-login-page",
  imports: [CommonModule, LoginFormMolecule, RouterLink],
  template: `
    <div class="container">
      <ui-login-form (login)="onLogin($event)"></ui-login-form>
      <div style="text-align:center;margin-top:12px;">
        <a class="link" routerLink="/register">Create an account</a>
        <!-- 👈 link -->
      </div>
    </div>
  `,
})
export class LoginPage {
  private auth = inject(AuthService);
  private store = inject(AuthStore);
  private router = inject(Router);

  onLogin({ username, password }: { username: string; password: string }) {
    this.auth.login({ username, password }).subscribe({
      next: (res) => {
        this.store.setTokens(res);
        this.router.navigateByUrl("/products");
      },
      error: (err) => alert(err?.error?.message ?? "Login failed"),
    });
  }
}
