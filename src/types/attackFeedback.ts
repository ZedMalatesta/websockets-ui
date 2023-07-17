import { Game } from "../models/Game.js"

export type attackFeedback = {
    game:Game,
    responces:{status:"miss"|"killed"|"shot", position:string}[]
}