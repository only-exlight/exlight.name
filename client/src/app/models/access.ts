import { AccessNamespace } from '@share/access.namespace';

export class Access implements AccessNamespace.IAccess {
    public id: number = this.__data.id;
    public entity: string = this.__data.entity;
    public access: number = this.__data.access;

    constructor(private __data: AccessNamespace.IAccess) { }
}
