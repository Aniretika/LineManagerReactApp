import { useStore } from "../../stores/store";
import { confirmationTextMaker } from "./lineConfirmation";
import ConfirmBox from 'react-dialog-confirm';
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

 function ConfirmDialog() {
  const history = useHistory();
  const { lineStore } = useStore();
  const { createLine, formValues, isSubmit , formValuesReset } = lineStore;
  const handleClose = () => {
    lineStore.setConfirmForm(false);
  };

  const handleConfirm = async() => {
    await createLine(history);
    formValuesReset();
    lineStore.setConfirmForm(false);
  };

        return (
            <ConfirmBox
            icon='https://img.icons8.com/ios/344/steam.png'
            label={{
              text: `${confirmationTextMaker(formValues)}`,
              confirm: 'yes',
              cancel: 'no'
            }}
            isOpen={isSubmit}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onCancel={handleClose}
          />
        );
  }

  export default observer(ConfirmDialog);