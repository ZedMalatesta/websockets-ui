import { GameController } from "../controller/controller.js";
import { SocketData } from '../types/SocketData.js';
import { WSServerResponce, WSServerResponceHandler } from "../types/WSServerResponce.js";


export const router = async (ws_data: SocketData, connectionID:string, controller: GameController): Promise<Array<WSServerResponceHandler>> => {
    let responces:Array<WSServerResponce> = [];
    try{
        let data = JSON.parse(ws_data.data);
        switch(ws_data.type) { 
            case 'reg': { 
                return await controller.registrateUser(data, connectionID);
               break; 
            } 
            case 'create_room':{
                
            }
            default: { 
               //statements; 
               break; 
            } 
         } 
         return []
    }
    catch(e){
        return []
    }
}
