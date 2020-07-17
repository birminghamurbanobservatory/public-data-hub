import {transform, isObject} from 'lodash'
import * as check from 'check-types';


// example keysMap { oldKey1: newKey1, oldKey2: newKey2}
export function deeplyRenameKeys(obj: any, keysMap: any) {

  return transform(obj, function(result, value, key) { // transform to a new object

    const currentKey = keysMap[key] || key; // if the key is in keysMap use the replacement, if not use the original key

    result[currentKey] = isObject(value) ? deeplyRenameKeys(value, keysMap) : value; // if the key is an object run it through the inner function - replaceKeys
  });

}


/**
 * Comes in handy when you don't know if something has been populated or not, for example a timeseries or observation might have a madeBySensor property which could either be a string (the id), or an object in which case it will have a id or '@id' property.
 * @param thing may or may not be populated
 */
export function findId(thing: any): string {

  if (check.nonEmptyString(thing)) {
    return thing;
  } else if (check.nonEmptyObject(thing)) {
    return thing.id || thing['@id'];
  } else {
    return;
  }

}