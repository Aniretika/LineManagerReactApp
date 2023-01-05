import React, { useRef } from 'react';
import '../../styles/formikStyles.css';
import 'react-datepicker/dist/react-datepicker.css';
import '../../styles/lineRegStyle.css';
import {  Checkbox } from 'rsuite';
import 'rsuite/dist/rsuite.css';
import { initialOption, lineOptions } from '../controls/registerLine/lineRegControls';
import Select from 'react-select';
import '../../../node_modules/react-dialog-confirm/build/index.css'; 
import '../../styles/confirmDialog.css';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/store';
import DatePicker from '../layouts/registerline/DatePicker';
import Notification from '../controls/registerLine/notification';
import TimeSlot from '../layouts/registerline/TimeSlot';
import ConfirmDialog from '../controls/registerLine/ConfirmDialog';
import ErrorDialog from '../controls/registerLine/ErrorDialog';

function CreateLine() 
{
  const {lineStore} = useStore();
  const { isSteamAccountAvailable, steamAccountChecker } = lineStore;
  const notInitialRender = useRef(false)
  const renderSwitch = () => {
    switch(lineStore.formValues.lineType) {
      case 'live':
        return (
          ''
        );
      case 'timeslot':
        return (
            <TimeSlot />
        );
      default:
        return '';
    }
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    lineStore.setLineValue(name, value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    lineStore.submitForm();
    if(lineStore.isSubmit)
    {
      steamAccountChecker();
    }
  };


  React.useEffect(() => {
    return(() => {
      if(notInitialRender.current)
      {
          lineStore.validationRunner()
      }
      else{
        notInitialRender.current = true;
      }
     });
  });

  return (
    <div className='main-register-block' style={{
      display:'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
  }}>
     <div>
      <form className='line-register-form' onSubmit={handleSubmit}>
        <h1 className='main-header'>Line Creator</h1>
        <h3 style={{ textAlign: 'left', color: 'white', fontSize: '25px' }}>Create new line</h3>
          <div className='field'>
          <label className='signature-label'>Line`s title</label>
          <input
            type='text'
            name='lineName'
            placeholder='Line name'
            autoComplete='off'
            value={lineStore.formValues.lineName}
            onChange={handleChange}
          />
          </div>
          <p>{lineStore.formErrors.lineName}</p>
          
          <div className='field'>
          <label className='signature-label'>Line Type</label>
          <Select
            className='basic-single'
            classNamePrefix='select'
            defaultValue={initialOption[0]}
            name='color'
            options={lineOptions}
            onChange=
            {
              (lineState: any) =>
              {
                lineStore.setLineType(lineState)
              }
            }
          />
          </div>
          <p>{lineStore.formErrors.lineType}</p>

          {renderSwitch()}
          <div className='checkbox-datepicker'>
            <div>Set time limits</div>
            <Checkbox onClick={() => {
                lineStore.setDatePicker()
            }}/>
          </div>
          <div className='checkbox-datepicker'>
            <div>Has steam account?</div>
            <Checkbox onClick={() => {
                lineStore.setSteamAccount()
            }}/>
          </div>
          
          {lineStore.isDatePicker ? <DatePicker/>: null}
          {lineStore.isSubmit && isSteamAccountAvailable ? <ConfirmDialog /> : <ErrorDialog/>}
     <button 
        className='submit-button' 
        type='submit' 
        onClick={handleSubmit}
     >Register line
     </button>
     </form>
     </div>
     {lineStore.notify.isOpen ? <Notification /> : null}
    </div>
  );
}

export default observer(CreateLine);