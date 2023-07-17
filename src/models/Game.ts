import { Room } from "./Room.js";
import { generateStringMatrix } from '../utils/utils.js';
import { ships } from '../types/ships.js'
import { attackFeedback } from '../types/attackFeedback.js'

export class Game extends Room{
    secondPlayerID: string;
    playersTurn: 0 | 1;
    firstPlayerBG: Array<string>;
    secondPlayerBG: Array<string>;
    firstPlayerShips: Array<Array<string|number>>;
    secondPlayerShips: Array<Array<string|number>>;
    firstPlayerShipsMessage: ships;
    secondPlayerShipsMessage: ships;
    isWin: boolean;

    constructor(
        index:number, 
        firstPlayerID:string, 
        secondPlayerID:string 
        ){
        super(index, firstPlayerID);
        this.secondPlayerID = secondPlayerID;
        this.playersTurn = Math.floor(Math.random() * 1) as 0 | 1
        this.firstPlayerBG = generateStringMatrix(0, 9);
        this.secondPlayerBG = generateStringMatrix(0, 9);
        this.firstPlayerShips = [];
        this.secondPlayerShips = [];
        this.firstPlayerShipsMessage = [];
        this.secondPlayerShipsMessage = [];
        this.isWin = false;
    }

    fillShips(
        ships:ships, 
        shipsStorage:'firstPlayerShips' | 'secondPlayerShips', 
        shipsMessageStorage:'firstPlayerShipsMessage' | 'secondPlayerShipsMessage'
        ):Game | void{
        let parsedShips: Array<Array<string|number>> = [];
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
            cells.push(0);
            parsedShips.push(cells)
        }
        this[shipsStorage] = parsedShips;
        this[shipsMessageStorage] = ships;
        if(this.firstPlayerShipsMessage.length>0
        &&this.secondPlayerShipsMessage.length>0){
            return this
        }
    }

    handleFillShips(ships:ships, playerIndex:number):Game | void{
        return playerIndex===0
        ? this.fillShips(ships, 'firstPlayerShips', 'firstPlayerShipsMessage')
        : this.fillShips(ships, 'secondPlayerShips', 'secondPlayerShipsMessage')
    }

    shoot(
        x:string,
        y:string,
        shipsStorage:'firstPlayerShips' | 'secondPlayerShips', 
        battleGround:'firstPlayerBG' | 'secondPlayerBG',  /* More like battleSEA :D */
        ):attackFeedback | void{
        const elem_index = this[battleGround].findIndex((field: string)=>{
            return field==`${x}${y}` ? true : false
        })
        if(elem_index>-1){
            console.log(this[battleGround], 'battleground prev')
            let responces:{status:"miss"|"killed"|"shot", position:string}[] = [];
            let status = 'miss';
            for(let i=0; i<this[shipsStorage].length; i++){
                for(let j=0; j<this[shipsStorage][i].length-1; j++){
                    if(this[shipsStorage][i][j]===`${x}${y}`){
                        this[shipsStorage][i][this[shipsStorage][i].length-1]=Number(this[shipsStorage][i][this[shipsStorage][i].length-1])+1;
                        status='shot';
                        break;
                    }
                }
                if(status=='shot'){
                    if(this[shipsStorage][i][this[shipsStorage][i].length-1]==(this[shipsStorage][i].length-1)) status="killed";
                    if(status=='killed'){
                        for(let cell of this[shipsStorage][i]){
                            if(typeof cell == 'string'){
                                let potentialMisses = [
                                    `${Number(cell.split('')[0])-1}${Number(cell.split('')[1])-1}`, `${Number(cell.split('')[0])}${Number(cell.split('')[1])-1}`, `${Number(cell.split('')[0])+1}${Number(cell.split('')[1])-1}`,
                                    `${Number(cell.split('')[0])-1}${Number(cell.split('')[1])}`, `${Number(cell.split('')[0])+1}${Number(cell.split('')[1])}`,
                                    `${Number(cell.split('')[0])-1}${Number(cell.split('')[1])+1}`, `${Number(cell.split('')[0])}${Number(cell.split('')[1])+1}`, `${Number(cell.split('')[0])+1}${Number(cell.split('')[1])+1}`,
                                ]
                                console.log(potentialMisses, "потенциальное");
                                for(let miss of potentialMisses){
                                    if(this[battleGround].includes(miss)&&
                                    !this[shipsStorage][i].includes(miss)){
                                        responces.push({
                                            status:'miss',
                                            position:miss
                                        })
                                        const miss_index = this[battleGround].findIndex((field: string)=>{
                                            return field==miss ? true : false
                                        })
                                        this[battleGround].splice(miss_index, 1);
                                    }
                                }
                                responces.push({
                                    status:'killed',
                                    position:cell
                                })
                            }
                        }
                        this[shipsStorage].splice(i, 1);
                        if(this[shipsStorage].length<1) this.isWin = true;
                    }
                    else{
                        responces.push({
                            status:'shot',
                            position:`${x}${y}`
                        })
                    }
                    break;
                }
            }
            if(status=='miss'){
                responces.push({
                    status:'miss',
                    position:`${x}${y}`
                })
                this.playersTurn = this.playersTurn ? 0 : 1;
            }
            const new_index = this[battleGround].findIndex((field: string)=>{
                return field==`${x}${y}` ? true : false
            })
            this[battleGround].splice(new_index, 1);
            console.log(this[battleGround], 'battleground after')
            return {
                game:this,
                responces:responces
            }
        }

    }

    handleShoot(x:number, y:number, playerIndex:number):attackFeedback | void{
        console.log(playerIndex, "playerIndex")
        console.log(this.playersTurn, 'players turn')
        if(playerIndex===this.playersTurn){
            return playerIndex===1
            ? this.shoot(`${x}`, `${y}`, 'firstPlayerShips', 'firstPlayerBG')
            : this.shoot(`${x}`, `${y}`, 'secondPlayerShips', 'secondPlayerBG')
        }
    }

    randomAttack(playerIndex:number):attackFeedback | void{
        let storage:'firstPlayerBG' | 'secondPlayerBG' = playerIndex===1 ? 'firstPlayerBG' : 'firstPlayerBG';
        let random_item = this[storage][Math.floor(Math.random()*this[storage].length)];
        if(playerIndex===this.playersTurn){
            return playerIndex===1
            ? this.shoot(`${random_item.split('')[0]}`, `${random_item.split('')[1]}`, 'firstPlayerShips', 'firstPlayerBG')
            : this.shoot(`${random_item.split('')[0]}`, `${random_item.split('')[1]}`, 'secondPlayerShips', 'secondPlayerBG')
        }
    }
    /*
    handleAttack(x:number, y:number, playerIndex:number) {
        
    }*/
}