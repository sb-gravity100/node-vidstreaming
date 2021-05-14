import axios from 'axios'
import { PropClass } from './prop_class'
import { MirrorLink } from '../interfaces'

export class MirrorType<T extends number> extends PropClass<MirrorLink<T>> {
   constructor(props: MirrorLink<T>) {
      super(props)
   }

   get code() {
      return this._props.code
   }
   get name() {
      return this._props.name
   }
   get links() {
      return this._props.links
   }
}
