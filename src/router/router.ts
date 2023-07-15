import { GameController } from "../controller/controller";\
import { SocketData } from '../types/SocketData.js';
import { WSServerResponce, WSServerResponcesBunch } from "../types/WSServerResponce.js";


export const router = async (ws_data: SocketData, connectionID:string, controller: GameController): Promise<WSServerResponcesBunch>  => {
    let responces:Array<WSServerResponce> = [];
    try{
        switch(ws_data.type) { 
            case 'reg': { 
                console.log("proceed");
                return await controller.registrateUser(ws_data.data, connectionID);
            } 
            default: { 
               //statements; 
               break; 
            } 
         } 
         return { responces: responces } 
    }
    catch(e){
        return { responces: responces } 
    }
}
