/* author - Daniel VerWeire <dverweire@gmail.com>
 *
 * map - execute function fn for each key in obj. Values returned from fn are appended to an array
 * 	which is returned by the map function
 *
 * @param obj - Can be an Array, Object, String, Number, etc.
 * @param fn - Callback function which is called for each key/index
 * @param squash - Determines whether or not to keep null/undefined returns from fn
 *
 * When fn is called it is passed the following arguments:
 *
 * @arg key - The key, index, or attribute name from the object
 * @arg value - The value of the current key, index or attribute
 * @arg emit - Function to explicitly push a new value onto the final array
 * @arg end - Function to stop iterating over obj
 *
 * Example:
 *
 * const a = [40, 50, 2, 1];
 *
 * const b = map(a, function (key, val, emit, end) {
 *   // key is the index in the array
 *
 *   if (val > 10) {
 *     return val;
 *   }
 * });
 *
 * // b = [40, 50, undefined, undefined];
 *
 * // this time we will squash falsy values
 * const c = map(a, function (key, val, emit, end) {
 *   // key is the index in the array
 *
 *   if (val > 10) {
 *     return val;
 *   }
 * }, true); // turn on squash
 *
 * // c = [40, 50];
 */

/**
 * Function to emit a value to the result array
 */
export type EmitFunction<T> = (value: T) => number | undefined;

/**
 * Function to stop iteration
 */
export type EndFunction = () => void;

/**
 * Callback function type for the map function
 * @param key - The key or index from the object
 * @param value - The value at the current key/index
 * @param emit - Function to emit additional values
 * @param end - Function to end iteration early
 * @returns The value to add to the result array
 */
export type MapCallback<T, R> = (
  key: string | number,
  value: T,
  emit: EmitFunction<R>,
  end: EndFunction
) => R;

/**
 * Maps over an object, array, or string, calling a function for each element
 * @param obj - The object to map over (Array, Object, String, etc.)
 * @param fn - The callback function to call for each element
 * @param squash - If true, filters out null and undefined values from results
 * @returns Array of values returned from the callback function
 */
export default function map<T = any, R = any>(
  obj: any,
  fn: MapCallback<T, R>,
  squash?: boolean
): R[] {
  const a: R[] = [];
  let doBreak = false;

  function doCall(key: string | number, obj: any): void {
    const t = fn.call(
      obj[key],
      key,
      obj[key],
      emit,
      end
    );

    if ((t !== undefined && t !== null && squash) || !squash) {
      a.push(t);
    }
  }

  function emit(t: R): number | undefined {
    if ((t !== undefined && t !== null && squash) || !squash) {
      return a.push(t);
    }
  }

  function end(): void {
    doBreak = true;
  }

  if (Array.isArray(obj)) {
    for (let key = 0; key < obj.length; key++) {
      doCall(key, obj);

      if (doBreak) {
        break;
      }
    }
  } else if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj);

    for (let x = 0; x < keys.length; x++) {
      doCall(keys[x], obj);

      if (doBreak) {
        break;
      }
    }
  } else if (typeof obj === 'string') {
    const strObj = obj as any;
    for (const key in strObj) {
      doCall(key, obj);

      if (doBreak) {
        break;
      }
    }
  } else {
    return [];
  }

  return a;
}

// CommonJS export for backward compatibility
module.exports = map;
module.exports.default = map;
