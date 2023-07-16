
import { createHash } from 'crypto';
import { Player } from './User.js';
 
export interface IRoom {
    firstPlayerID: string;
    secondPlayerID: string;
}

/*
export class Room implements IRoom{
    firstPlayerID: string;
    SecondPlayer: IPlayer;

    constructor(FirstPlayer:IPlayer){
        this.FirstPlayer = FirstPlayer;
    }
}
*/