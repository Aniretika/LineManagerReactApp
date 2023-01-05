import { useEffect } from 'react';
import '../../styles/mainLayout.css';
import MaterialTable from 'material-table';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';
import { useHistory, useParams } from 'react-router-dom';
import { AddPosition, DeletePosition, UpdatePosition } from '../api/agent';
import '../../styles/positionTable/positionTable.css';

function LineTable() 
{
    const {lineStore} = useStore();
    const history = useHistory();
    const {selectedLine: currentLine, loadLine, loadPosition, positionList: positions} = lineStore;

    const {id} = useParams<{id: string}>();
    useEffect(() => {
        loadLine(id)
        loadPosition(id)
        if(currentLine === null)
        {
            //TODO: Redirect line not found
            history.push(`/`);
        }
    }, [id]);
   
    return (
       
        <div className="main-table" style={{
            maxWidth: '70%',
            display: "block",
            marginLeft: "auto",
            marginRight: "auto"   }}>
            <h1 style={{ textAlign: "center", color: "white", fontSize: "50px" }}>Line: {currentLine?.lineName}</h1>
            {currentLine?.isSteamAccount ? <h2>Steam account</h2> : null}
           <MaterialTable
                onSelectionChange={(selectedRows) => console.log(selectedRows)}
                style=
                {{ 
                    background: 'transparent', 
                    boxShadow: 'none', 
                    borderBottom: 'none' 
                }}
                options=
                {{
                    loadingType: 'linear',
                    showTitle: false,
                    search: true,
                    searchFieldStyle: { color: 'white', borderColor: "white" },
                    actionsCellStyle: { color: 'white', textAlign: 'left' },
                    rowStyle: 
                      { color: 'white', 
                        borderBottom: 'transparent', 
                        textAlign: 'left' },
                    actionsColumnIndex: -1,
                    headerStyle: 
                      { background: "transparent", 
                        color: "white", 
                        fontStyle: "bold" },
                }}

                columns={[
                    {
                        title: "Id",
                        field: "id",
                        type: "string",
                        hidden: true
                    },
                    {
                        title: "No",
                        field: "numberInTheQueue",
                        type: "string",
                        hidden: false,
                        editable: 'onUpdate'
                    },
                    {
                        title: "Author",
                        field: "requester",
                        type: "string",
                        hidden: false
                    },
                    {
                        title: "Start",
                        field: "timelineStart",
                        type: "datetime",
                        editable: 'always',
                        hidden: currentLine?.lineType !== 'timeslot'
                    },
                    {
                        title: "End",
                        field: "timelineFinish",
                        type: "datetime",
                        editable: 'never', 
                        hidden: currentLine?.lineType !== 'timeslot'
                    },
                    {
                        title: "Registration time",
                        field: "registrationTime",
                        type: "date",
                        editable: 'never'
                    },
                    {
                        title: "Description",
                        field: "descriptionText",
                        type: "string",
                        hidden: false
                    }
                ]}
                data={positions}
                 editable={{
                    onRowAdd: (newData) =>
                        new Promise(async (resolve, reject) => {
                            newData.lineId = id;
                            await AddPosition(newData)
                            .then(
                                response => {
                                    resolve(loadPosition(id));
                                }
                            ).catch(() => reject()) 
                        }),
                     onRowUpdate: (updatedData, oldData) =>
                        new Promise(async (resolve, reject) => {
                            const dataUpdate = [...positions];
                            let newAddedElement = dataUpdate[dataUpdate.indexOf(oldData!)];
                            newAddedElement = updatedData;
                            await UpdatePosition(id, newAddedElement);
                            resolve(loadPosition(id));
                        }),
                    onRowDelete: oldData =>
                        new Promise(async resolve => {
                            const dataDelete = [...positions];
                            dataDelete.splice(dataDelete.indexOf(oldData), 1);  
                            await DeletePosition(oldData.id);
                            resolve(loadPosition(id));
                        })
                 }}
            />
        </div>

    )
}
export default observer(LineTable);
