function LogError(constructor: any) {
  const originalConstructor = constructor;

  const newConstructor: any = function (...args: any[]) {
    console.log(`ERROR :`, args);
    return new originalConstructor(...args);
  };

  newConstructor.prototype = originalConstructor.prototype;

  return newConstructor;
}

@LogError
export class CustomError extends Error {
  constructor(public statusCode: number, public reasons: string[]) {
    super();
  }
}
