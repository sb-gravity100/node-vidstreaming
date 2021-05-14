export class PropClass<T> {
   protected _props: T
   constructor(props: T) {
      this._props = props
   }

   get(): T {
      return this._props
   }
}
