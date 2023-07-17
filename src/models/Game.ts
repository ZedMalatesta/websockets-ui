import { Room } from "./Room.js";
import { generateStringMatrix } from '../utils/utils.js';
import { ships } from '../types/ships.js'

export class Game extends Room{
    secondPlayerID: string;
    playersTurn: 0 | 1;
    firstPlayerBG: Array<string>;
    secondPlayerBG: Array<string>;
    firstPlayerShips: Array<Array<string>>;
    secondPlayerShips: Array<Array<string>>;
    firstPlayerShipsMessage: ships;
    secondPlayerShipsMessage: ships;

    constructor(
        index:number, 
        firstPlayerID:string, 
        secondPlayerID:string, 
        defaultBattleground:Array<string> = generateStringMatrix(0, 9) /* More like battleSEA :D */
        ){
        super(index, firstPlayerID);
        console.log("default", defaultBattleground)
        this.secondPlayerID = secondPlayerID;
        this.playersTurn = Math.floor(Math.random() * 1) as 0 | 1
        this.firstPlayerBG = defaultBattleground;
        this.secondPlayerBG = defaultBattleground;
        this.firstPlayerShips = [];
        this.secondPlayerShips = [];
        this.firstPlayerShipsMessage = [];
        this.secondPlayerShipsMessage = [];
    }

    fillShips(ships:ships, playerIndex:number):Game | void{
        console.log(ships, "ships")
        console.log(playerIndex, "index")
        let parsedShips: Array<Array<string>> = [];
        for(let ship of ships){
            let cells = [];
            if(ship.direction){
                for(let i=ship.position.y; i<(ship.position.y+ship.length); i++){
                    cells.push(`${ship.position.x}${i}`)
                }
            }
            else{
                for(let i=ship.position.x; i<(ship.position.x+ship.length); i++){
                    cells.push(`${i}${ship.position.y}`)
                }
            }
            parsedShips.push(cells)
        }
        console.log(parsedShips, 'parsedShips')
        if(playerIndex===0){
            this.firstPlayerShips=parsedShips;
            this.firstPlayerShipsMessage=ships;
        }
        else{
            this.secondPlayerShips=parsedShips;
            this.secondPlayerShipsMessage=ships;
        }
        if(this.firstPlayerShipsMessage.length>0
        &&this.secondPlayerShipsMessage.length>0){
            return this
        }
    }
}