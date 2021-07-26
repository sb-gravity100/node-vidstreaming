export class PropClass<T extends { [key: string]: any }> {
   protected _props: T;
   constructor(props: T) {
      this._props = props;
   }

   get(key?: keyof T): T {
      let val;
      if (key) {
         val = this._props[key];
         return val;
      }
      val = { ...this._props };
      return val;
   }
}
