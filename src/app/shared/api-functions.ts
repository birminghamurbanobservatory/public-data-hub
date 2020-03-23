import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ApiFunctionsService {

  constructor() { }


  // E.g. converts the where object:
  // {resultTime: {lte: '2020-01-01'}}
  // to the query string:
  // '?resultTime__lte=2020-01-01'
  whereToQueryString(where?): string {

    if (!where) {
      // simply returning an empty string rather than throwing an error can save code in the services that use this.
      return '';
    }

    const elements = [];
    Object.keys(where).forEach((key) => {
      if (this.isObject(where[key])) {
        Object.keys(where[key]).forEach((modKey) => {
          if (modKey === 'in') {
            elements.push(`${key}__${modKey}=${where[key][modKey].join(',')}`);
          } else {
            elements.push(`${key}__${modKey}=${where[key][modKey]}`);
          }
        });
      } else {
        elements.push(`${key}=${where[key]}`);
      }
    });
    if (elements.length) {
      return `?${elements.join('&')}`;
    } else {
      return '';
    }

  }


  isObject(x): boolean {
    return x !== null && typeof x === 'object';
  }


}
