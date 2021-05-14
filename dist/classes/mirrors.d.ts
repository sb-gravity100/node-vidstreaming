import { PropClass } from './prop_class';
import { MirrorLink } from '../interfaces';
export declare class MirrorType<T extends number> extends PropClass<MirrorLink<T>> {
    constructor(props: MirrorLink<T>);
    get code(): T;
    get name(): string;
    get links(): string | string[];
}
