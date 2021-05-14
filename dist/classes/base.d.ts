/// <reference types="node" />
import { EventEmitter } from 'events';
/** Base class */
export declare class Base extends EventEmitter {
    constructor();
    protected episodes(): void;
    protected episode(link: string): Promise<void>;
    protected getPossibleDownloads(id: string): Promise<void>;
}
