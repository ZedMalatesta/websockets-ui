import { IRoom } from '../models/Room.js';
import { IPlayer, IUser } from '../types/User.js';
import { IWSDatabase } from '../types/Database.js';
import { Player } from '../models/User.js';

export class WSDatabase implements IWSDatabase{
    users: Player[];
    rooms: IRoom[];

    constructor(){
        this.users = [];
        this.rooms = [];
    }

    getAll<T>(storage:Array<T>):Array<T>{
        return storage;
    }

    /*

    getByField<T>(value:string, field:string, storage:Array<T>):T | undefined{
        return storage.find((elem:T)=>{
            elem[field] === value;
        })
    }*/

    getUserByName(name:string):Player | undefined{
        const user = this.users.find((user: Player)=>{
            user.name === name;
        })
        return user;
    } 

    updatePlayer(name:string, password:string, connectionID:string):Player{
        const newUser = new Player(name, password, connectionID)
        this.users.push(newUser);
        return  newUser;
    }

    createPlayer(name:string, password:string, connectionID:string):Player{
        const newUser = new Player(name, password, connectionID)
        this.users.push(newUser);
        return  newUser;
    }
    /*
    getUsersList(name:string){
        return this.getByField(name, 'name', this.users);
    }*/


}