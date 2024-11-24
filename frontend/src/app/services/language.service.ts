import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private language = new BehaviorSubject<string>(
    navigator.language === 'fr-FR' ? 'fr-FR' : 'en-EN'
  );

  public setLanguage(lang: string): void {
    this.language.next(lang);
  }

  public getLanguage(): Observable<string> {
    return this.language.asObservable();
  }

  public getCurrentLang(): string {
    return this.language.value;
  }
}
