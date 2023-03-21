/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { _typeof } from './_typeof';

/**
 * @returns whether the provided parameter is a JavaScript Function or not.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(obj: any): obj is Function {
    return typeof obj === _typeof.function;
}
