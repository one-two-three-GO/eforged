/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Converts undefined to null, passes all other values through.
 */
export function withUndefinedAsNull<T>(x: T | undefined): T | null {
    return typeof x === 'undefined' ? null : x;
}
