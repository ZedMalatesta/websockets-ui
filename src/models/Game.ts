import { Room } from "./Room.js";

export class Game extends Room{
    secondPlayerID: string;

    constructor(index:number, firstPlayerID:string, secondPlayerID:string){
        super(index, firstPlayerID);
        this.secondPlayerID = secondPlayerID;
    }

    updateSecondPlayer(connectionID:string){
        this.secondPlayerID = connectionID;
    }
}