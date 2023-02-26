import {Directive, Input, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[filter]',
})
export class MenuFilterDirective implements OnInit{
  @Input() filter: string;

  constructor(private eRef: ElementRef) {
  }

  ngOnInit(): void {
    this.checkFilter(this.filter);
  }

  checkFilter(filter) {
    const element = this.eRef.nativeElement;

    if (MenuFilterDirective.excludeToMenu(filter)
        ) {
      element.classList.add('hide');
    } else {
      element.classList.add('show');
    }

    this.checkShowMenu(element);

  }

  private static excludeToMenu(permission) {
    let arr = permission.split(':');
    if (arr && arr.length != 0) {
      let index = arr.length - 1;
      let last = arr[index];

      if (last == 'delete' || last == 'edit' || last == 'get-one' || last == 'champs') {
        return true;
      }
    }

    return false;
  }

  public checkShowMenu(element) {
    let childMenu = $(element).parent();
    let li = childMenu.find('li.show');

    if (li.length == 0) {
      $(childMenu).parent().addClass('hide');
      $(childMenu).parent().removeClass('show');
    } else {
      $(childMenu).parent().addClass('show');
      $(childMenu).parent().removeClass('hide');
    }

  }
}
