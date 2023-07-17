
import { createHash } from 'crypto';
import { IPlayer } from '../types/User.js';

export class Player implements IPlayer{
    readonly name: string;
    readonly password: string;
    readonly index: number;
    connectionID: string;
    isActive: boolean;
    inGame: boolean;
    wins: number;

    constructor(name:string, password:string, index:number, connectionID:string){
        this.name = name;
        this.password = createHash('sha256').update(password).digest('hex');
        this.index = index;        
        this.connectionID = connectionID;
        this.isActive = true;
        this.inGame = false;
        this.wins = 0;
    }

    updateConnectionID(id: string):void{
        if(id){
            this.connectionID = id;
            this.isActive = true;
        }
        else{
            this.connectionID = '';
            this.isActive = false;
        }
    }

    updateWins():void{
        this.wins++;
    }

    verifyPassword(ver_pass:string):boolean{
        let new_hash = createHash('sha256').update(ver_pass).digest('hex');
        return new_hash===this.password ? true : false;
    }

    /*

    static validateName(name:string):boolean{
        let usernameRegex: RegExp = /^[a-zA-Z0-9]+$/;
        return usernameRegex.test(name);
    }

    static validatePassword(pass:string):boolean{
        let passwordRegex: RegExp = /^[a-zA-Z0-9]+$/;
        return passwordRegex.test(pass);
    }*/
}