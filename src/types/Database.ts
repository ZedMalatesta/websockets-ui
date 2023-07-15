import { IRoom } from "../models/Room";
import { IUser } from "../types/User";

export interface IDatabase {
    /*getByField<T>(value:any, field:string, storage:Array<T>):T | undefined;*/
    getAll<T>(storage:Array<T>):Array<T>;
}

export interface IWSDatabase extends IDatabase {
    users: Array<IUser>;
    rooms: Array<IRoom>;
}
