export function extension(ctr: any) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    let originalFunction: Function;
    return function (_: any, propertyKey: string, descriptor: PropertyDescriptor) {
        originalFunction = descriptor.value;

        ctr.prototype[propertyKey] = function (...arguments_) {
            return originalFunction(this, ...arguments_);
        }
    }
}
