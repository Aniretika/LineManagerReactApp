import { useEffect, useState } from 'react';
import '../../styles/mainLayout.css';
import MaterialTable from 'material-table';
import { DeleteLine, UpdateLine } from '../api/agent';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';
import { ILineAppearance } from '../models/lineAppearance';

function MainLayout()
{
    const {lineStore} = useStore();
    const { lineList, getLineList } = lineStore;
    useEffect(() => {
             getLineList();
         }, []);

    const lineConvector = () => {
             let appearanceListLine: ILineAppearance[] = [];
             lineList.forEach(line =>
                {
                    let appearanceLine: ILineAppearance = {
                        id: '',
                        lineName: '',
                        lineType: '',
                        lineFinish: '',
                        lineStart: '',
                        positionPeriod:'',
                        isSteamAccount: ''
                    };
                    appearanceLine!.id = line!.id;
                    appearanceLine!.lineName = line.lineName;
                    appearanceLine!.lineType = line.lineType;
                    
                    if(line.positionPeriod !== 0)
                    {
                        let ticks = line.positionPeriod/10000000/60;
                        appearanceLine!.positionPeriod = ticks.toString();
                    }
                    if(line?.lineStart?.toString() === "0001-01-01T00:00:00+00:00")
                    {
                        appearanceLine.lineStart = '';
                        appearanceLine.lineFinish = '';
                    }
                    else
                    {
                        appearanceLine.lineStart = line?.lineStart?.toString().split('T')[0] + ' '+ line?.lineStart?.toString().split('T')[1].split('.')[0];
                        appearanceLine.lineFinish = line?.lineFinish?.toString().split('T')[0]+ ' '+ line?.lineFinish?.toString().split('T')[1].split('.')[0];
                    }
                    line.isSteamAccount ? appearanceLine.isSteamAccount = 'Yes' : appearanceLine.isSteamAccount = 'No';
                    appearanceListLine.push(appearanceLine)
                })
                return appearanceListLine!;
    }

    return(
        <div className='main-block'>
            
            <h1 >Welcome to Line Manager!</h1>
            <div className='greetings-handler'>
                <p>
                    The manager was created to create and manage queues for steam accounts. It is possible to sign up for the queue through the telegram bot.
                </p>
                <MaterialTable
                onSelectionChange={(selectedRows) => console.log(selectedRows)}
                style={{ background: 'transparent', boxShadow: 'none', borderBottom: 'none' }}
                
                options={{
                    loadingType: 'linear',
                    showTitle: false,
                    search: true,
                    searchFieldStyle: { color: 'white', borderColor: "white" },
                    actionsCellStyle: { color: 'white', textAlign: 'left' },
                    rowStyle: { color: 'white', borderBottom: 'transparent', textAlign: 'left' },
                    actionsColumnIndex: -1,
                    headerStyle: {
                        background: "transparent", color: "white", fontStyle: "bold" },
                }}

                    columns={[
                    {
                        title: "id",
                        field: "id",
                        type: "string",
                        hidden: true
                    },
                    {
                        title: "Line Name",
                        field: "lineName",
                        type: "string",
                        hidden: false
                    },
                    {
                        title: `Type`,
                        field: "lineType",
                        type: "string",
                        hidden: false,
                        editable: 'never'
                    },
                    {
                        title: `Position Period\n(minutes)`,
                        field: "positionPeriod",
                        type: "string",
                        hidden: false,
                        editable: 'never'
                    },
                    {
                        title: "Start Line",
                        field: "lineStart",
                        type: "string",
                        hidden: false,
                        editable: 'never'
                    },
                    {
                        title: "End Line",
                        field: "lineFinish",
                        type: "string",
                        hidden: false,
                        editable: 'never'
                    },
                    {
                        title: `Steam line`,
                        field: "isSteamAccount",
                        type: "string",
                        hidden: false,
                        editable: 'never'
                    },

                ]}
                data={lineConvector()}
                 editable={{
                    onRowDelete: oldData =>
                        new Promise(async resolve => {
                            const dataDelete = [...lineList];
                            let oldLine = lineList.find(line => line.id === oldData?.id);
                            dataDelete.splice(dataDelete.indexOf(oldLine!), 1);  
                            await DeleteLine(oldData.id);
                            resolve(getLineList());
                        })
                 }}
            />
            </div>

            
        </div>
    )
}

export default observer(MainLayout)