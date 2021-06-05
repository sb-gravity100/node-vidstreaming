import axios, { AxiosError } from 'axios';
import * as path from 'path';
import { PropClass } from './prop_class';
import { MirrorLink, FCDNLinks } from '../interfaces';

export class MirrorType<T extends number | null, LT> extends PropClass<
   MirrorLink<T, LT>
> {
   constructor(props: MirrorLink<T, LT>) {
      super(props);
   }

   get code() {
      return this._props.code;
   }
   get name() {
      return this._props.name;
   }
   get links() {
      return this._props.links;
   }
}

export class FCDN extends MirrorType<1, string> {
   constructor(props: MirrorLink<1, string>) {
      super(props);
   }

   async getSources(): Promise<MirrorLink<1, FCDNLinks[]>> {
      try {
         const url = path.basename(new URL(this.links).pathname);
         const link = 'https://fcdn.stream/api/source/' + url;
         const { data } = await axios({
            data: null,
            method: 'POST',
            url: link,
         }).catch((e: AxiosError) => {
            throw e.toJSON();
         });
         const mapped: FCDNLinks[] = data.data.map((e: any) => ({
            file: e.file,
            label: e.label,
         }));
         return {
            ...this._props,
            links: mapped,
         };
      } catch (e) {
         throw e;
      }
   }
}
