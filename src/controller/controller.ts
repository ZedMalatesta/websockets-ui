import { WSDatabase } from '../db/db.js'
import { IPlayer } from '../types/User.js';
import { WSServerResponceHandler, WSServerResponce } from '../types/WSServerResponce.js';
import { Player } from '../models/User.js';

interface IGameController {
    bdManager: WSDatabase;
}

export class GameController implements IGameController{
    bdManager: WSDatabase;

    constructor(db:WSDatabase){
        this.bdManager = db;
    }

    registrateUser = async (data:any, connectionID:string): Promise<Array<WSServerResponceHandler>> =>{
        type reg_res = { name:string, index:number, error:string, errorMessage:string}
        let res_data:reg_res | {} = {};
        try{
            const player:Player | undefined = this.bdManager.getUserByName(data.name);
            if(player){ 
                if(player.verifyPassword(data.password)){
                    player.updateConnectionID(connectionID);
                    res_data = {
                        'name':player.name,
                        'index':0,
                        'error':false,
                        'errorMessage':''
                    }
                }
                else{
                    res_data = {
                        'name':'',
                        'index':0,
                        'error':false,
                        'errorMessage':''
                    }
                }
            }
        }
        catch(e){
            res_data = {
                'name':'',
                'index':0,
                'error':true,
                'errorMessage':'UnknownError'
            }
        }
        let :WSServerResponceData = {
            type:"reg",
            data:res_data,
            id:0
        }
        return [ { type:'single', data: } ]
    }
}
