export interface WSServerResponce{
    type: string;
    id: number;
    data: string;
}

export interface WSServerResponceHandler{
    type: 'single' | 'all';
    connectionID: string;
    data: WSServerResponce | undefined
}
