
export interface ILineInfo {
    id: string;
    lineType: string;
    lineName: string;
    positionPeriod: number;
    lineStart: Date | undefined;
    lineFinish: Date | undefined;
    isSteamAccount: boolean;
}

export function instanceOfILineInfo(object: any): object is ILineInfo {
    return 'id' in object 
    && 'lineType' in object 
    && 'lineName' in object 
    && 'positionPeriod' in object 
    && 'lineStart' in object 
    && 'lineFinish' in object;
}

