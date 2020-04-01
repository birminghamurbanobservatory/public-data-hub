import { Injectable } from '@angular/core';
import {isObject, isArray} from 'lodash';


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
      if (isObject(where[key]) && !isArray(where[key])) {
        Object.keys(where[key]).forEach((modKey) => {
          if (modKey === 'in') {
            elements.push(`${key}__${modKey}=${where[key][modKey].join(',')}`);
          } else {
            elements.push(`${key}__${modKey}=${where[key][modKey]}`);
          }
        });
      } else if (isArray(where[key])) {
        // Make it a dot separated string, e.g. for ancestorPlatforms
        elements.push(`${key}=${where[key].join('.')}`);
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



}
