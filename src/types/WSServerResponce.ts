export interface WSServerResponceData{
    type: string;
    id: number;
    data: { [key: string]: string | number | boolean | Array<any> };
}

export interface WSServerResponce{
    type: 'single' | 'all';
    connectionID: string;
    data: WSServerResponceData;
}
