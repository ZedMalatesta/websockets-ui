
import { createHash } from 'crypto';

interface IUser {
    readonly name: string;
    readonly password: string;
}

interface IPlayer extends IUser{
    isActive: boolean;
    inGame: boolean;
    wins: number;
}

export class Player implements IPlayer{
    readonly name: string;
    readonly password: string;
    isActive: boolean;
    inGame: boolean;
    wins: number;

    constructor(name:string, password:string){
        this.name = name;
        this.password = createHash('sha256').update(password).digest('hex');
        this.isActive = true;
        this.inGame = false;
        this.wins = 0;
    }

    verifyPassword(ver_pass:string):boolean{
        let new_hash = createHash('sha256').update(ver_pass).digest('hex');
        return new_hash===this.password ? true : false;
    }
}