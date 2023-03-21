/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { _typeof } from './_typeof';

/**
 * @returns whether the provided parameter is a JavaScript String or not.
 */
export function isString(str: any): str is string {
    if (typeof (str) === _typeof.string || str instanceof String) {
        return true;
    }
    return false;
}
