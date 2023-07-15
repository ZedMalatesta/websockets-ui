
import { createHash } from 'crypto';
import { IPlayer } from './User.js'
import { Player } from './User';
 
export interface IRoom {
    FirstPlayer: IPlayer;
    SecondPlayer: IPlayer;
}

export class Room implements IRoom{
    FirstPlayer: IPlayer;
    SecondPlayer: IPlayer;

    constructor(FirstPlayer:IPlayer){
        this.FirstPlayer = FirstPlayer;
    }
}