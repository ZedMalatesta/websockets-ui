import { IWSDatabase } from '../types/Database.js';
import { Player } from '../models/User.js';
import { Room } from '../models/Room.js';
import { Game } from '../models/Game.js';
import { ships } from '../types/ships.js';
import { attackFeedback } from '../types/attackFeedback.js';

export class WSDatabase implements IWSDatabase{
    users: Player[];
    rooms: Room[];
    games: Game[];
    roomsIndex: number;
    gamesIndex: number;

    constructor(){
        this.users = [];
        this.rooms = [];
        this.games = [];
        this.roomsIndex = 0;
        this.gamesIndex = 0;
    }
    

    getAll<T>(storage:Array<T>):Array<T>{
        return storage;
    }

    /*

    getByField<T>(value:string, field:string, storage:Array<T>):T | undefined{
        return storage.find((elem:T)=>{
            elem[field] === value;
        })
    }*/

    async getUserByName(name:string):Promise<Player | undefined>{
        const user = this.users.find((user: Player)=>{
            return user.name === name ? true : false
        })
        return user;
    } 

    async getUserByConnectionID(connectionID:string):Promise<Player>{
        const user = this.users.find((user: Player)=>{
            return user.connectionID===connectionID ? true : false
        })
        return user as Player;
    } 

    async getWinners():Promise<Array<{
        name:string,
        wins:number
    }>>{
        let winners : Array<{
            name:string,
            wins:number
        }> = [];
        this.users.forEach((user:Player)=>{
            winners.push({
                name:user.name,
                wins:user.wins
            })
        })
        return winners;
    } 

    async getRooms():Promise<Array<{
        roomId:number,
        roomUsers:Array<{ name:string, index:number }>
    }>>{
        let active_rooms : Array<{
            roomId:number,
            roomUsers:Array<{ name:string, index:number }>
        }> = [];
        this.rooms.forEach(async (room:Room)=>{
            let user = await this.getUserByConnectionID(room.firstPlayerID);
            active_rooms.push({
                roomId:room.index,
                roomUsers:[{ 
                    name:user.name,
                    index:user.index
                }]
            })
        })
        return active_rooms;
    } 

    async checkRoomByConnectionID(connectionID:string):Promise<boolean>{
        const room = this.rooms.find((room: Room)=>{
            return room.firstPlayerID===connectionID ? true : false
        })
        return room ? true : false;
    }

    async updatePlayersState(name:string, connectionID:string):Promise<Player>{
        const user_index = this.users.findIndex((user: Player)=>{
            return user.name === name ? true : false
        })
        this.users[user_index].updateConnectionID(connectionID);
        return this.users[user_index];
    }

    async destroyPlayersState(connectionID:string):Promise<Player>{
        const user_index = this.users.findIndex((user: Player)=>{
            return user.connectionID === connectionID ? true : false
        })
        this.users[user_index].updateConnectionID('');
        return this.users[user_index];
    }

    async updatePlayersWins(connectionID:string):Promise<void>{
        const user_index = this.users.findIndex((user: Player)=>{
            return user.connectionID === connectionID ? true : false
        })
        this.users[user_index].updateWins();
    }


    async createPlayer(name:string, password:string, connectionID:string):Promise<Player>{
        const newUser = new Player(name, password, this.users.length+1, connectionID)
        this.users.push(newUser);
        return newUser;
    }

    async createRoom(connectionID:string):Promise<void>{
        const newRoom = new Room(this.roomsIndex, connectionID);
        this.rooms.push(newRoom);
        this.roomsIndex++;
    }

    async getRoomByIndex(index:number):Promise<Room>{
        const room = this.rooms.find((room: Room)=>{
            return room.index===index
        })
        return room as Room;
    }

    async deleteRoomByIndex(roomIndex:number):Promise<void>{
        const deleteIndex = this.rooms.findIndex((room: Room)=>{
            return room.index===roomIndex
        })
        this.rooms.splice(deleteIndex, 1);
    }

    async deleteRoomByConnectionID(connectionID:string):Promise<void>{
        const deleteIndex = this.rooms.findIndex((room: Room)=>{
            return room.firstPlayerID===connectionID
        })
        this.rooms.splice(deleteIndex, 1);
    }

    async findGameByConnection(connectionID:string):Promise<Game|void>{
        const gameIndex = this.games.findIndex((game: Game)=>{
            return game.checkConnections(connectionID);
        })
       if(gameIndex>-1) return this.games[gameIndex];
    }

    async createGame(firstConnectID:string, secondConnectID:string, isBot:boolean=false):Promise<Game>{
        const newGame = new Game(this.gamesIndex, firstConnectID, secondConnectID, isBot)
        this.games.push(newGame);
        this.gamesIndex++;
        return newGame;
    }

    async updateGameShips(index:number, date:ships, playerIndex:number):Promise<Game | void>{
        const game_index = this.games.findIndex((game: Game)=>{
            return game.index === index ? true : false
        })
        return this.games[game_index].handleFillShips(date, playerIndex);
    }

    async updateGameAttack(index:number, x:number, y:number, playerIndex:number):Promise<attackFeedback | void>{
        const game_index = this.games.findIndex((game: Game)=>{
            return game.index === index ? true : false
        })
        return this.games[game_index].handleShoot(x, y, playerIndex);
    }

    async updateGameRandomAttack(index:number, playerIndex:number):Promise<attackFeedback | void>{
        const game_index = this.games.findIndex((game: Game)=>{
            return game.index === index ? true : false
        })
        return this.games[game_index].randomAttack(playerIndex);
    }

    async deleteGameByIndex(index:number):Promise<void>{
        const game_index = this.games.findIndex((game: Game)=>{
            return game.index === index ? true : false
        })
        this.games.splice(game_index, 1);
    }
    /*
    getUsersList(name:string){
        return this.getByField(name, 'name', this.users);
    }*/


}