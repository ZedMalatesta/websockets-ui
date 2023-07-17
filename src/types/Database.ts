import { IRoom } from "../models/Room.js";
import { IPlayer } from "../types/User.js";

export interface IDatabase {
    /*getByField<T>(value:any, field:string, storage:Array<T>):T | undefined;*/
    getAll<T>(storage:Array<T>):Array<T>;
}

export interface IWSDatabase extends IDatabase {
    users: Array<IPlayer>;
    rooms: Array<IRoom>;
}
