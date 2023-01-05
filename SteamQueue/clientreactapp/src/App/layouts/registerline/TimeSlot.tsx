import { startOption, timeOptions } from "../../controls/registerLine/lineRegControls";
import Select from 'react-select';
import { useStore } from "../../stores/store";

export default function TimeSlot(){
  const {lineStore} = useStore();
        return (
          <div>
          <div className='field'>
          <label className='signature-label'>Position period</label>
          <Select
            className='basic-single'
            classNamePrefix='select'
            defaultValue={startOption[0]}
            name='color'
            options={timeOptions}
            onChange={
              (time: any) =>
              {
                lineStore.setTimeSlot(time)
              }
            }
          />
          </div>
          <p>{lineStore.formErrors.positionPeriodText}</p>
        </div>
        );
  }