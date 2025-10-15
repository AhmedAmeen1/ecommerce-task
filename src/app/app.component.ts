import { Component, inject } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { AuthStore } from "./core/store/auth.store";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="header">
      <a class="link" routerLink="/products"><strong>🛒 MiniShop</strong></a>
      <div>
        <a class="link" *ngIf="!isAuth()" routerLink="/login">Login</a>
        <button class="btn" *ngIf="isAuth()" (click)="logout()">Logout</button>
      </div>
    </header>

    <router-outlet></router-outlet>
  `,
})
export class AppComponent {
  private store = inject(AuthStore);
  isAuth = this.store.isAuthenticated; // call as isAuth() in template
  logout() {
    this.store.clear();
  }
}
