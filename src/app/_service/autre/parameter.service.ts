import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable()
export class ParameterService {
    private _screenWidth = new Subject<any>();
    private _screenHeight = new Subject<any>();

    get screenWidth(): Subject<any> {
        return this._screenWidth;
    }

    set screenWidth(value: Subject<any>) {
        this._screenWidth.next(value);
    }

    get screenHeight(): Subject<any> {
        return this._screenHeight;
    }

    set screenHeight(value: Subject<any>) {
        this._screenHeight.next(value);
    }
}
