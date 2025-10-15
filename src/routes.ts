import { Routes } from "@angular/router";
import { canActivateAuth } from "./app/core/guards/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import("./app/pages/login/login.page").then((m) => m.LoginPage),
  },
  {
    path: "register",
    loadComponent: () =>
      import("./app/pages/register/register.page").then((m) => m.RegisterPage),
  }, // 👈 new
  {
    path: "products",
    canActivate: [canActivateAuth],
    loadComponent: () =>
      import("./app/pages/products/products.page").then((m) => m.ProductsPage),
  },
  { path: "", pathMatch: "full", redirectTo: "login" },
  { path: "**", redirectTo: "login" },
];
