import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toRuby'
})
export class ToRubyPipe implements PipeTransform {

  transform(value: string): string {
    const element = document.createElement('div');
    element.innerHTML = value;
    value = element.innerText;
    return value.replace(/\[(.+?)\]\((.+?)\)/g, '<ruby>$1<rt>$2</rt></ruby>');
  }

}
