/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isFunction } from './isFunction';

/**
 * @returns whether the provided parameters is are JavaScript Function or not.
 */
export function areFunctions(...objects: any[]): boolean {
    return objects && objects.length > 0 && objects.every(isFunction);
}
