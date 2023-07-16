import { Room } from "./Room.js";

export class Game extends Room{
    secondPlayerID: string;
    playersTurn: 0 | 1;

    constructor(index:number, firstPlayerID:string, secondPlayerID:string){
        super(index, firstPlayerID);
        this.secondPlayerID = secondPlayerID;
        this.playersTurn = Math.floor(Math.random() * 1) as 0 | 1
    }
}