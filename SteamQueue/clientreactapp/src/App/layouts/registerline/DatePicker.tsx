import { DateRangePicker } from "rsuite";
import { disabledDate } from "../../controls/registerLine/lineRegControls";
import { useStore } from "../../stores/store";

export default function DatePicker(){
  const {lineStore} = useStore();
    return (
      <div>
      <div className='field'>
    <label className='signature-label'>Valid until</label>
    <DateRangePicker
      format='yyyy-MM-dd HH'
      onChange={(range: any) => 
        {
          lineStore.setDate(range)
        }
      }
      disabledDate={disabledDate}
    />
    </div>
      <p>{lineStore.formErrors.dateTime}</p>
    </div>
    )
}