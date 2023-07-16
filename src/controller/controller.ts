import { WSDatabase } from '../db/db.js'
import { IPlayer } from '../types/User.js';
import { WSServerResponceHandler, WSServerResponce } from '../types/WSServerResponce.js';
import { MAIN_ID } from '../types/contants.js'
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
            console.log("player")
            console.log(player)
            
            if(player){ 
                if(player.verifyPassword(data.password)){
                    console.log("@@@@@@@@@@@@@@@@@@@@@@")
                    this.bdManager.updatePlayersState(player.name, connectionID);
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
                        'error':true,
                        'errorMessage':'IncorrectPassword'
                    }
                }
            }
            else {
                const new_player = await this.bdManager.createPlayer(data.name as string, data.password as string, connectionID);
                res_data = {
                    'name':new_player.name,
                    'index':0,
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
        }
        let wrapper:WSServerResponce = {
            type:"reg",
            data:JSON.stringify(res_data),
            id:MAIN_ID
        }
        console.log(wrapper, "wrapper")
        return [ { type:'single', data: wrapper, connectionID } ]
    }
}
