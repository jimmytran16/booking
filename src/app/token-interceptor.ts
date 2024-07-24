import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { ConfirmationApiService } from "./confirmation-api.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private injector: Injector, private router: Router, private confirmationApi: ConfirmationApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
    const authReq = req.clone({
        headers: req.headers.set('Access-Control-Allow-Origin', '*')
    }); 
    
    if (req.url.includes('getToken')) {
        return next.handle(authReq);
    }
    
    return this.confirmationApi.getToken().pipe(switchMap(token => {
        const authReqSubmission = req.clone({
            headers: req.headers.set('Access-Control-Allow-Origin', '*')
                .append('Authorization','Bearer ' + token)
        }); 
        return next.handle(authReqSubmission);
    }))
  }
}