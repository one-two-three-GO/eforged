/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * Creates a new object of the provided class and will call the constructor with
 * any additional argument supplied.
 */
export function create(ctor: Function, ...args: any[]): any {
    const obj = Object.create(ctor.prototype);
    ctor.apply(obj, args);
    return obj;
}
