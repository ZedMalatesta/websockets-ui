import { ServerController } from "../controller/controller.js";
import { SocketData } from '../types/SocketData.js';
import { WSServerResponce, WSServerResponceHandler } from "../types/WSServerResponce.js";


export const router = async (ws_data: SocketData, connectionID:string, controller: ServerController): Promise<Array<WSServerResponceHandler>> => {
    try{
        let data = ws_data.data ? JSON.parse(ws_data.data) : '';
        console.log('data', data)
        switch(ws_data.type) { 
            case 'reg': { 
                return await controller.registrateUser(data, connectionID);
            } 
            case 'create_room':{
                return await controller.createRoom(connectionID);
            }
            case 'add_user_to_room':{
                return await controller.addToRoom(data, connectionID);
            }
            case 'add_ships':{
                return await controller.addShips(data)
            }
            default: { 
                return [];
            } 
        } 
    }
    catch(e){
        console.log(e);
        return []
    }
}
