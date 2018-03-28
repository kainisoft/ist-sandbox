import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslateDefaultParser } from '@ngx-translate/core/src/translate.parser';

import { Observable } from 'rxjs/Observable';

@Injectable()
export class LocalizeService extends TranslateService {
  readonly defaultLanguage = 'en';
  protected validLanguages = ['en', 'ru'];

  use(lang: string): Observable<any> {
    if (this.validLanguages.indexOf(lang) === -1) {
      lang = this.defaultLanguage;
    }

    return super.use(lang);
  }

  getText(key: string | Array<string>, interpolateParams?: Object): Promise<string> | any {
    return super.get(key, interpolateParams).take(1).toPromise();
  }

  getListText(keys: string[]): Promise<string[]> {
    return Promise.all(keys.map(key => this.getText(key)));
  }

}

export class LocalizeTranslateParser extends TranslateDefaultParser {
  protected varPattern = /{\$([^}]+)}/g;
  protected varReplace = '{$var}';

  getValue(target: {[key: string]: string}, key: string): any {// TODO refactor
    if (this.varPattern.test(key)) {
      const match = this.getMatches(key);
      const search = key.replace(this.varPattern, this.varReplace);
      const str = target[search] || key;

      return str.replace(this.varPattern, (find, str, index) => {
        return match[index];
      });
    }

    return super.getValue(target, key);
  }

  protected getMatches(str: string): string[] {
    const result = [];
    let exec;

    this.varPattern.lastIndex = 0;

    while (exec = this.varPattern.exec(str)) {
      result.push(exec[1]);
    }

    return result;
  }

}
