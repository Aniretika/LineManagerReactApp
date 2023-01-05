import { useStore } from "../../stores/store";
import ConfirmBox from 'react-dialog-confirm';
import { observer } from "mobx-react-lite";
import '../../../styles/dialogButton/errorDialogStyle.css'

 function ErrorDialog() {
  const { lineStore } = useStore();
  const { isSteamAccountAvailable , resetAccountAvailability} = lineStore;

  const reset = () => {
    resetAccountAvailability();
  };

  
        return (
            <div className='error-dialog-form'>
            <ConfirmBox
                icon='https://img.icons8.com/pastel-glyph/344/appointment-reminders.png'
                label={{
                text: 'There is no available steam accounts. Create line without steam account or try again later',
                 }}
                isOpen={!isSteamAccountAvailable}
                onClose={reset}
                onConfirm={reset}
                onCancel={reset}
             />
        </div>
            
        );
  }

  export default observer(ErrorDialog);
  


  