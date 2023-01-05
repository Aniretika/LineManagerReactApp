import { IsSteamAccountAvailable } from "../../api/agent";

export const isSteamLinesAvailable = (isSteamAccount: boolean) => {
   console.log("isSteamLine", isSteamAccount);
   if(!isSteamAccount)
   {
        return false;
   }

    IsSteamAccountAvailable().then(response =>
    {
        if(response)
        {
            return false;
        }
        else
        {
            return true;
        }
    }).catch(err => console.log(err));
}