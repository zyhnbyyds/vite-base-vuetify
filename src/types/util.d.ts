declare namespace TypeUtil {
  type NullToUndefined<T> = T extends object
    ? { [P in keyof T]: T[P] extends null ? undefined : (Exclude<T[P], null>) }
    : T
}
