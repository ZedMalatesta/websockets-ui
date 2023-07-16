export interface IRoom {
    index:number;
    firstPlayerID: string;
}

export class Room implements IRoom{
    index: number;
    firstPlayerID: string;

    constructor(index:number, firstPlayerID:string){
        this.index = index;
        this.firstPlayerID = firstPlayerID;
    }
}



