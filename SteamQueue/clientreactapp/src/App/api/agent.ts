import axios, { AxiosResponse } from 'axios';
import { ILineForm } from '../models/lineForm';
import { ILineInfo } from '../models/lineInfo';
import { IPosition } from '../models/position';

// require('dotenv').config()
axios.defaults.baseURL = 'https://steamqueue20221003152847.azurewebsites.net/api';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    create: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    update: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    delete: <T> (url: string) => axios.post<T>(url).then(responseBody),
}

export async function GetPositions(lineId) {

    return await requests.get<IPosition[]>(`/Position/GetList/${lineId}`).then(response =>
        {   
            let positions: IPosition[] = [];
            response.forEach(line => {
                positions.push(line);
            })
            return positions;
        })
}

export async function GetLines() {

    return await requests.get<ILineInfo[]>('/Line/GetAll').then(response =>
        {   
            let positions: ILineInfo[] = [];
            response.forEach(line => {
                positions.push(line);
            })
            return positions;
        })
}

export async function IsSteamAccountAvailable() {

    return await requests.get<boolean>('/Account/IsSpareAccounts').then(response =>
        {   
            let IsSteamAccountAvailable: boolean = false;
            IsSteamAccountAvailable = response;
            return IsSteamAccountAvailable;
        })
}


export async function AddPosition (newPositition: IPosition)
{
    await axios.post<void>(`/Position/Add/`, newPositition);
}

export async function UpdatePosition (lineId: string, newPositition: IPosition)
{
    await requests.update<void>(`/Position/Update/${lineId}`, newPositition);
}

export async function DeletePosition (id: string)
{
    await axios.post<void>(`/Position/Delete/${id}`);
}

export async function UpdateLine (lineId: string, newPositition: ILineInfo)
{
    await axios.post<void>(`/Line/Update/${lineId}`, newPositition);
}

export async function DeleteLine (id: string)
{
    await axios.post<void>(`/Line/Delete/${id}`)
    .then(async response => {
            return response.status;
        }).catch(err => console.log(err));
}

export async function RegisterLine(line: ILineForm, isSteamAccount: boolean) {
    const destructureLine = destructure(line);
    let responseLine: any;
    await requests.create<ILineInfo>(`/Line/Add/${isSteamAccount}`, destructureLine).then(response => 
        {
            responseLine =  response!;
        })
    .catch(err => console.log(err));
    return responseLine;
}

export async function GetLine(lineId) {
    let responseLine: any;
    await requests.get<ILineInfo>(`/Line/GetInfo/${lineId}`)
   .then(response =>
    {   
        responseLine = response!;
    }).catch(err => console.log(err))
    return responseLine;
};

export async function AddAccountToLine(lineId, accountId) {

     await axios.post(`/Line/Add`, lineId, accountId)
        .then(async response => {
            return response.status;
            }).catch(err => console.log(err));
}

const simpleObj = {};
function destructure(obj) {
    for (let key in obj) {
        const value = obj[key];
        const type = typeof value;
        if (type === 'string' || (type === 'number' && !isNaN(value))) {
            simpleObj[key] = value;
        } else if (type === 'object') {
            Object.assign(simpleObj, value);
        }
    }
    return simpleObj;
}

