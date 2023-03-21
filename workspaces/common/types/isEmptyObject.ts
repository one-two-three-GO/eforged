/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isObject } from './isObject';

const _hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * @returns whether the provided parameter is an empty JavaScript Object or not.
 */
export function isEmptyObject(obj: any): obj is any {
    if (!isObject(obj)) {
        return false;
    }
    for (const key in obj) {
        if (_hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}
