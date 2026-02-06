import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import en from './languages/en';
import vi from './languages/vi';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private langSubject = new BehaviorSubject<'vi' | 'en'>('vi');
  lang$ = this.langSubject.asObservable();

  private translations: Record<string, any> = {
    vi,
    en,
  };

  constructor() {
    const savedLang = localStorage.getItem('lang') as 'vi' | 'en' | null;
    if (savedLang && this.translations[savedLang]) {
      this.langSubject.next(savedLang);
    }
  }

  setLanguage(lang: 'vi' | 'en') {
    this.langSubject.next(lang);
    localStorage.setItem('lang', lang);
  }

  getLanguage() {
    return this.langSubject.getValue();
  }

  getValueByPath(obj: any, path: string): string {
    return path.split('.').reduce((o, key) => (o ? o[key] : null), obj);
  }

  translate(key: string): string {
    const lang = this.getLanguage();
    const translation = this.translations[lang];
    const value = this.getValueByPath(translation, key);
    return value || key;
  }
  /** 🧠 Hàm helper để dịch nhiều key 1 lúc (cho PrimeNG, form, etc.) */
  getTranslationSection(section: string): any {
    const lang = this.getLanguage();
    return this.translations[lang]?.[section] || {};
  }

}


