import { WebSocket } from 'ws';

export interface SpecifiedWebSocket extends WebSocket{
    id:string;
}