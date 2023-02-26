import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  isConnected = new Subject<boolean>();
  isAvailable = new Subject<boolean>();

  available() {
    this.isAvailable.next(true);
  }

  unAvailable() {
    this.isAvailable.next(false);
  }

  online() {
    this.isConnected.next(true);
  }

  offline() {
    this.isConnected.next(false);
  }
}
