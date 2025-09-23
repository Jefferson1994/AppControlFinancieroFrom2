import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl', standalone: true })
export class SafeUrlPipe implements PipeTransform {


  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    if (!url) {
      return '';
    }
    // Le dice a Angular que esta URL es un recurso seguro y de confianza
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
