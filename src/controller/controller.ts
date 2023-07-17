import { WSDatabase } from '../db/db.js'
import { WSServerResponceHandler, WSServerResponce } from '../types/WSServerResponce.js';
import { MAIN_ID } from '../types/contants.js'
import { Player } from '../models/User.js';
import { Game } from '../models/Game.js'
import { ships } from '../types/ships.js'
import { attackFeedback } from '../types/attackFeedback.js'

interface IServerController {
    bdManager: WSDatabase;
}

type reg_res = { name:string, index:number, error:string, errorMessage:string};
type update_room_res = Array<{ roomId: number, roomUsers: Array<{ name:string, index:number }> }>;
type create_game_res = { idGame: number, idPlayer: number };
type start_game_res = { ships:ships, currentPlayerIndex:number };
type turn_res = { currentPlayer:number };
type attack_res = { position:{x:number,y:number}, currentPlayer:number, status:"miss"|"killed"|"shot" };
type win_res={ winPlayer: number };

export class ServerController implements IServerController{
    bdManager: WSDatabase;

    constructor(db:WSDatabase){
        this.bdManager = db;
    }

    /*Update room list*/
    updateRoomsList = async (): Promise<WSServerResponceHandler> => {
        const room_list:update_room_res = await this.bdManager.getRooms();
        const wrapper_rooms:WSServerResponce = {
            type:"update_room",
            data:JSON.stringify(room_list),
            id:MAIN_ID
        }
        return { type:'all', data: wrapper_rooms, connectionID:'' };
    }

    /*Update winners list*/
    updateWinnersList = async (): Promise<WSServerResponceHandler> => {
        const winners:Array<{
            name:string,
            wins:number
        }> = await this.bdManager.getWinners()
        winners.sort((a,b) => (a.wins > b.wins) ? 1 : ((b.wins > a.wins) ? -1 : 0));
        const wrapper_winners:WSServerResponce = {
            type:"update_winners",
            data:JSON.stringify(winners),
            id:MAIN_ID
        }
        return { type:'all', data: wrapper_winners, connectionID:'' };
    }

    /*Registrate User*/
    registrateUser = async (data:{name:string, password:string}, connectionID:string): Promise<Array<WSServerResponceHandler>> =>{
        let responces:Array<WSServerResponceHandler> = [ ];
        let res_data:reg_res | {} = {};
        let error_status = false;
        try{
            /*
            if(!Player.validateName(data.name)){
                res_data = {
                    'name':'',
                    'index':0,
                    'error':true,
                    'errorMessage':'Incorrect name'
                }
            }
            else if(!Player.validatePassword(data.password)){
                res_data = {
                    'name':'',
                    'index':0,
                    'error':true,
                    'errorMessage':'Password must contain eight characters, at least one letter and one number:'
                }
            }*/
            const player:Player | undefined = await this.bdManager.getUserByName(data.name as string);
            if(player){ 
                if(player.verifyPassword(data.password)){
                    this.bdManager.updatePlayersState(player.name, connectionID);
                    res_data = {
                        'name':player.name,
                        'index':player.index,
                        'error':false,
                        'errorMessage':''
                    }
                }
                else{
                    res_data = {
                        'name':'',
                        'index':0,
                        'error':true,
                        'errorMessage':'IncorrectPassword'
                    }
                    error_status = true;
                }
            }
            else {
                const new_player = await this.bdManager.createPlayer(data.name as string, data.password as string, connectionID);
                res_data = {
                    'name':new_player.name,
                    'index':new_player.index,
                    'error':false,
                    'errorMessage':''
                }
            }
        }
        catch(e){
            console.log(e)
            res_data = {
                'name':'',
                'index':0,
                'error':true,
                'errorMessage':'UnknownError'
            }
            error_status = true;
        }
        const wrapper_reg:WSServerResponce = {
            type:"reg",
            data:JSON.stringify(res_data),
            id:MAIN_ID
        }
        responces.push({ type:'single', data: wrapper_reg, connectionID });
        if(!error_status){
            const winner_responce = await this.updateWinnersList();
            responces.push(winner_responce);
            const update_rooms_responce = await this.updateRoomsList();
            responces.push(update_rooms_responce);
        }
        return responces;
    }

    /*Create Room*/
    createRoom = async (connectionID:string): Promise<Array<WSServerResponceHandler>> =>{
        let responces:Array<WSServerResponceHandler> = [];
        try{
            let check_room = await this.bdManager.checkRoomByConnectionID(connectionID);
            if(!check_room){
                await this.bdManager.createRoom(connectionID);
                const update_rooms_responce = await this.updateRoomsList();
                responces.push(update_rooms_responce);
            }
        }
        catch(e){
            console.log(e)
        }
        return responces;
    }

    /*Add user to the room*/
    addToRoom = async (data:{indexRoom:number}, connectionID:string): Promise<Array<WSServerResponceHandler>> =>{
        let responces:Array<WSServerResponceHandler> = [];
        try{
            const room = await this.bdManager.getRoomByIndex(data.indexRoom);
            if(room&&room.firstPlayerID!==connectionID){
                const game:Game = await this.bdManager.createGame(room.firstPlayerID, connectionID);
                await this.bdManager.deleteRoomByIndex(room.index);
                await this.bdManager.deleteRoomByConnectionID(connectionID);

                const first_player_responce:create_game_res = {
                    idGame: game.index,
                    idPlayer: 0
                }
                const wrapper_first_player:WSServerResponce = {
                    type:"create_game",
                    data:JSON.stringify(first_player_responce),
                    id:MAIN_ID
                }
                responces.push({ type:'single', data: wrapper_first_player, connectionID:game.firstPlayerID })


                const second_player_responce:create_game_res = {
                    idGame: game.index,
                    idPlayer: 1
                }
                const wrapper_second_player:WSServerResponce = {
                    type:"create_game",
                    data:JSON.stringify(second_player_responce),
                    id:MAIN_ID
                }
                responces.push({ type:'single', data: wrapper_second_player, connectionID:game.secondPlayerID })

                const update_rooms_responce = await this.updateRoomsList();
                responces.push(update_rooms_responce);

            }
        }
        catch(e){
            console.log(e)
        }
        return responces;
    }

    updateTurn = (currentTurn:number, firstId:string, secondId:string):WSServerResponceHandler[] => {
        const turn_responce:turn_res = {
            currentPlayer:currentTurn
        }
        const wrapper_turn:WSServerResponce = {
            type:"turn",
            data:JSON.stringify(turn_responce),
            id:MAIN_ID
        }
        return [
            { type:'single', data: wrapper_turn, connectionID:firstId },
            { type:'single', data: wrapper_turn, connectionID:secondId }
        ]
    }

    addShips = async (
        data:{
            gameId:number, 
            ships:ships,
            indexPlayer:number
        }) =>{
        let responces:Array<WSServerResponceHandler> = [];
        try{
            let result:Game | void = await this.bdManager.updateGameShips(data.gameId, data.ships, data.indexPlayer);
            if(result){
                const first_player_ships:start_game_res = {
                    currentPlayerIndex:0,
                    ships:result.firstPlayerShipsMessage
                }
                const second_player_ships:start_game_res = {
                    currentPlayerIndex:1,
                    ships:result.secondPlayerShipsMessage
                }

                const wrapper_start_first:WSServerResponce = {
                    type:"start_game",
                    data:JSON.stringify(first_player_ships),
                    id:MAIN_ID
                }
                responces.push(
                { type:'single', data: wrapper_start_first, connectionID:result.firstPlayerID },
                { type:'single', data: wrapper_start_first, connectionID:result.secondPlayerID }
                )

                const wrapper_start_second:WSServerResponce = {
                    type:"start_game",
                    data:JSON.stringify(second_player_ships),
                    id:MAIN_ID
                }
                responces.push(
                { type:'single', data: wrapper_start_second, connectionID:result.firstPlayerID },
                { type:'single', data: wrapper_start_second, connectionID:result.secondPlayerID }
                )

                console.log("currentTURN", result.playersTurn)
                responces.push(...this.updateTurn(result.playersTurn, result.firstPlayerID, result.secondPlayerID))
            }
        }
        catch(e){
            console.log(e)
        }
        return responces;   
    }

    handleAttack = async (
        data:{
            gameId:number, 
            x:number,
            y:number,
            indexPlayer:number
        }) =>{
        let responces:Array<WSServerResponceHandler> = [];
        try{
            console.log("poehali")
            const result:attackFeedback | void = await this.bdManager.updateGameAttack(data.gameId, data.x, data.y, data.indexPlayer);
            if(result){
                if(result.game.isWin){
                    let data_send:win_res = {
                        winPlayer: result.game.playersTurn
                    }

                    const wrapper_finish:WSServerResponce = {
                        type:"finish",
                        data:JSON.stringify(data_send),
                        id:MAIN_ID
                    }
                    responces.push(
                        { type:'single', data: wrapper_finish, connectionID:result.game.firstPlayerID },
                        { type:'single', data: wrapper_finish, connectionID:result.game.secondPlayerID }
                    )
                    await this.bdManager.updatePlayersWins(result.game.playersTurn ? result.game.secondPlayerID : result.game.firstPlayerID);
                    const winner_responce = await this.updateWinnersList();
                    responces.push(winner_responce);
                    return responces;
                }
                for(let responce of result.responces){
                    let data_send:attack_res = {
                        position: {
                            x: Number(responce.position.split('')[0]),
                            y: Number(responce.position.split('')[1]),
                        },
                        currentPlayer:data.indexPlayer,
                        status:responce.status
                    }

                    const wrapper_feedback:WSServerResponce = {
                        type:"attack",
                        data:JSON.stringify(data_send),
                        id:MAIN_ID
                    }
                    responces.push(
                        { type:'single', data: wrapper_feedback, connectionID:result.game.firstPlayerID },
                        { type:'single', data: wrapper_feedback, connectionID:result.game.secondPlayerID }
                    )
                }
                responces.push(...this.updateTurn(result.game.playersTurn, result.game.firstPlayerID, result.game.secondPlayerID))
            }
        }
        catch(e){
            console.log(e)
        }
        return responces;   
    }

    randomAttack = async (
        data:{
            gameId:number, 
            indexPlayer:number
        }) =>{
        let responces:Array<WSServerResponceHandler> = [];
        try{
            console.log("poehali")
            const result:attackFeedback | void = await this.bdManager.updateGameRandomAttack(data.gameId, data.indexPlayer);
            if(result){
                if(result.game.isWin){
                    let data_send:win_res = {
                        winPlayer: result.game.playersTurn
                    }
                    const wrapper_finish:WSServerResponce = {
                        type:"finish",
                        data:JSON.stringify(data_send),
                        id:MAIN_ID
                    }
                    responces.push(
                        { type:'single', data: wrapper_finish, connectionID:result.game.firstPlayerID },
                        { type:'single', data: wrapper_finish, connectionID:result.game.secondPlayerID }
                    )
                    await this.bdManager.updatePlayersWins(result.game.playersTurn ? result.game.secondPlayerID : result.game.firstPlayerID);
                    const winner_responce = await this.updateWinnersList();
                    responces.push(winner_responce);
                    return responces;
                }
                console.log("responces", responces)
                for(let responce of result.responces){
                    let data_send:attack_res = {
                        position: {
                            x: Number(responce.position.split('')[0]),
                            y: Number(responce.position.split('')[1]),
                        },
                        currentPlayer:data.indexPlayer,
                        status:responce.status
                    }

                    const wrapper_feedback:WSServerResponce = {
                        type:"attack",
                        data:JSON.stringify(data_send),
                        id:MAIN_ID
                    }
                    responces.push(
                        { type:'single', data: wrapper_feedback, connectionID:result.game.firstPlayerID },
                        { type:'single', data: wrapper_feedback, connectionID:result.game.secondPlayerID }
                    )
                }
                console.log("currentTURN", result.game.playersTurn)
                responces.push(...this.updateTurn(result.game.playersTurn, result.game.firstPlayerID, result.game.secondPlayerID))
            }
        }
        catch(e){
            console.log(e)
        }
        return responces;   
    }
}
