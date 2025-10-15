import { Injectable, computed, signal } from "@angular/core";
import { LoginResponse } from "../models/auth.model";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

@Injectable({ providedIn: "root" })
export class AuthStore {
  private _access = signal<string | null>(localStorage.getItem(ACCESS_KEY));
  private _refresh = signal<string | null>(localStorage.getItem(REFRESH_KEY));
  isAuthenticated = computed(() => !!this._access());

  accessToken() { return this._access(); }
  refreshToken() { return this._refresh(); }

  setTokens(res: LoginResponse) {
    this._access.set(res.accessToken);
    this._refresh.set(res.refreshToken);
    localStorage.setItem(ACCESS_KEY, res.accessToken);
    localStorage.setItem(REFRESH_KEY, res.refreshToken);
  }

  clear() {
    this._access.set(null);
    this._refresh.set(null);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
}
