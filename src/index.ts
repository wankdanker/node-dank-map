/* author - Daniel VerWeire <dverweire@gmail.com>
 *
 * map - execute function fn for each key in obj. Values returned from fn are appended to an array
 * 	which is returned by the map function
 *
 * @param {Object} obj
 * @param {Function} fn
 * @param {Boolean} squash
 *
 * obj can be an Array or an object.
 * fn is a callback function which should be used as described below
 * squash determines whether or not to keep falsy returns from fn
 *
 * When fn is called it is passed the following arguments:
 *
 * @arg {String} key
 * @arg {Object} value
 * @arg {Function} emit
 * @arg {Function} end
 *
 * Example:
 *
 * a = [40,50,2,1];
 *
 * b = map(a, function (key, val, emit, end) {
 *	//key is the index in the array
 *
 * 	if (val > 10) {
 *		return val;
 * 	}
 * });
 *
 * // b = [40, 50, null, null];
 *
 * //this time we will sqash falsy values
 * c = map(a, function (key, val, emit, end) {
 *	//key is the index in the array
 *
 * 	if (val > 10) {
 *		return val;
 * 	}
 * }, true); //turn on squash
 *
 * // b = [40, 50];
 *
 */

export type EmitFn<R> = (value: R) => number | undefined
export type EndFn = () => void
export type MapCallback<K extends PropertyKey, V, R> = (
	key: K,
	value: V,
	emit: EmitFn<R>,
	end: EndFn
) => R | void

export function map<T, R = T>(
	obj: T[],
	fn: MapCallback<number, T, R>,
	squash?: boolean
): R[]
export function map<T, R = T>(
	obj: Record<string, T>,
	fn: MapCallback<string, T, R>,
	squash?: boolean
): R[]
export function map<R = string>(
	obj: string,
	fn: MapCallback<string, string, R>,
	squash?: boolean
): R[]
export function map(
	obj: unknown,
	fn: (...args: any[]) => any,
	squash?: boolean
): unknown[] {
	const a: unknown[] = []
	let doBreak = false

	if (Array.isArray(obj)) {
		for (let key = 0; key < obj.length; key++) {
			doCall(key, obj)

			if (doBreak) {
				break
			}
		}
	} else if (obj !== null && typeof obj === 'object') {
		const keys = Object.keys(obj)

		for (let x = 0; x < keys.length; x++) {
			doCall(keys[x], obj)

			if (doBreak) {
				break
			}
		}
	} else if (typeof obj === 'string') {
		for (const key in obj as unknown as string[]) {
			doCall(key, obj)

			if (doBreak) {
				break
			}
		}
	} else {
		return []
	}

	return a

	function doCall(key: string | number, target: any) {
		const t = fn.call(target[key], key, target[key], emit, end)

		if ((t !== undefined && t !== null && squash) || !squash) {
			a.push(t)
		}
	}

	function emit(t: unknown) {
		if ((t !== undefined && t !== null && squash) || !squash) {
			return a.push(t)
		}
	}

	function end() {
		doBreak = true
	}
}
