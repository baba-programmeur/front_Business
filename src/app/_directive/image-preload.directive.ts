import {Directive, Input, HostBinding, ElementRef, HostListener} from '@angular/core';

@Directive({
  selector: 'img[appDefault]',
})
export class ImagePreloadDirective {
  @Input() appDefault: string;

  constructor(private eRef: ElementRef) {
  }

  @HostListener('error')
  loadDefault() {
    const element: HTMLImageElement = this.eRef.nativeElement;
    element.src = this.appDefault;
  }

  @HostListener('load')
  load() {
    const element: HTMLImageElement = this.eRef.nativeElement;

    element.className = element.className + ' image-loaded';
  }
}
