import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthStore } from "../store/auth.store";
import { AuthService } from "../services/auth.service";
import { catchError, filter, finalize, first, switchMap, throwError, BehaviorSubject } from "rxjs";

const isRefreshing$ = new BehaviorSubject<boolean>(false);
const refreshed$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const store = inject(AuthStore);
  const auth = inject(AuthService);
  const token = store.accessToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && store.refreshToken()) {
        if (!isRefreshing$.value) {
          isRefreshing$.next(true);
          return auth.refresh(store.refreshToken()!).pipe(
            switchMap(res => {
              store.setTokens(res);
              refreshed$.next(res.accessToken);
              return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.accessToken}` } }));
            }),
            catchError(err => {
              store.clear();
              return throwError(() => err);
            }),
            finalize(() => isRefreshing$.next(false))
          );
        } else {
          return refreshed$.pipe(
            filter(v => !!v),
            first(),
            switchMap(newToken => next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } })))
          );
        }
      }
      return throwError(() => error);
    })
  );
};
