import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumeric]'
})
export class NumericDirective {

  constructor(private control:NgControl) { }
  @HostListener('input', ['$event']) onKeyup(event: KeyboardEvent) {
    let val = (<HTMLInputElement>event.target).value.replace(/[^0-9+]/g, '');
    this.control.control.setValue(val);
  } 

}
