/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { _typeof } from './_typeof';

/**
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 *
 * @returns whether the provided parameter is a JavaScript Number or not.
 */
export function isNumber(obj: any): obj is number {
    if ((typeof (obj) === _typeof.number || obj instanceof Number) && !isNaN(obj)) {
        return true;
    }
    return false;
}
