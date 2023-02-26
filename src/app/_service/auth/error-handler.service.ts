import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  hasError = new Subject<boolean>();
  message: string;
  code: number;
  level: string;

  showError(message, code, level) {
    this.hasError.next(true);
    this.message = message;
    this.code    = code;
    this.level   = level;
  }

  hideError() {
    this.hasError.next(false);
    this.message = null;
    this.code    = null;
    this.level   = null;
  }
}
