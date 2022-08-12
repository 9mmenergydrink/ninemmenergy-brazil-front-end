import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appAlphaSpace]'
})
export class AlphaSpaceDirective {

  constructor(private control:NgControl) { }
  @HostListener('input', ['$event']) onKeyup(event: KeyboardEvent) {
    let val = (<HTMLInputElement>event.target).value.replace(/[^a-zA-Z ]/g, '');
    this.control.control.setValue(val);
  } 
}
