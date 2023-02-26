import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'montantright'
})
export class MontantrightPipe implements PipeTransform {

  transform(value: any, args: any): any {
    let okval = value;

    // tslint:disable-next-line:triple-equals
    if(args == 'DECAISSEMENT') {
      okval = '<span style="color:red;font-size:16px;"> - '+value+'</span>';
    } else {
      okval = '<span style="color:#3dbc4c;font-size:16px;"> + '+value+'</span>';
    }

    return okval;
  }

}
