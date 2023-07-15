
import { createHash } from 'crypto';
import { IPlayer } from '../types/User.js';

export class Player implements IPlayer{
    readonly name: string;
    readonly password: string;
    connectionID: string;
    isActive: boolean;
    inGame: boolean;
    wins: number;

    constructor(name:string, password:string){
        this.name = name;
        this.password = createHash('sha256').update(password).digest('hex');
        this.connectionID = '';
        this.isActive = true;
        this.inGame = false;
        this.wins = 0;
    }

    updateConnectionID(id: string):void{
        this.connectionID = id;
    }

    updateWins():void{
        this.wins++;
    }

    verifyPassword(ver_pass:string):boolean{
        let new_hash = createHash('sha256').update(ver_pass).digest('hex');
        return new_hash===this.password ? true : false;
    }
}