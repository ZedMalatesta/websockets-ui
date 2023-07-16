import { WSDatabase } from '../db/db.js'
import { WSServerResponceHandler, WSServerResponce } from '../types/WSServerResponce.js';
import { MAIN_ID } from '../types/contants.js'
import { Player } from '../models/User.js';

interface IGameController {
    bdManager: WSDatabase;
}

type reg_res = { name:string, index:number, error:string, errorMessage:string}
type update_room_res = Array<{ roomId: number, roomUsers: Array<{ name:string, index:number }> }>

export class GameController implements IGameController{
    bdManager: WSDatabase;

    constructor(db:WSDatabase){
        this.bdManager = db;
    }

    /*Update room list*/
    updateRoomsList = async (connectionID:string): Promise<WSServerResponceHandler> => {
        const room_list:update_room_res = await this.bdManager.getRooms();
        const wrapper_rooms:WSServerResponce = {
            type:"update_room",
            data:JSON.stringify(room_list),
            id:MAIN_ID
        }
        return { type:'all', data: wrapper_rooms, connectionID };
    }

    /*Registrate User*/
    registrateUser = async (data:any, connectionID:string): Promise<Array<WSServerResponceHandler>> =>{
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
        let responces:Array<WSServerResponceHandler> = [ { type:'single', data: wrapper_reg, connectionID } ];
        if(!error_status){
            const winners:Array<{
                name:string,
                wins:number
            }> = await this.bdManager.getWinners();
            const wrapper_winners:WSServerResponce = {
                type:"update_winners",
                data:JSON.stringify(winners),
                id:MAIN_ID
            }
            responces.push({ type:'all', data: wrapper_winners, connectionID });
            const update_rooms_responce = await this.updateRoomsList(connectionID);
            console.log(update_rooms_responce);
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
                const update_rooms_responce = await this.updateRoomsList(connectionID);
                console.log(update_rooms_responce);
                responces.push(update_rooms_responce);
            }
        }
        catch(e){
            console.log(e)
        }
        return responces;
    }
}
