import moment from "moment";
import { ILineForm } from "../../models/lineForm";

const currentDate = moment().set({ hours: 0, minute: 59, second: 59 });
const currentTime = moment().set({ hours: 5, minute: 0, second: 0 });
export const lineErrors = {
  lineType: '',
  lineName: '',
  positionPeriodText: '',
  dateTime: ''
};


export const validateForm = (formValues, formErrors) =>
{
  let formErrorForSomeFields = Object.keys(formErrors).map(e => formErrors[e]).some(a => a.length === 0);
  let formErrorForAllFields = Object.keys(formErrors).map(e => formErrors[e]).every(a => a.length === 0);
  let formErrorForRequiredFields = Object.keys(formValues.lineName).length;

   return formErrorForSomeFields && formErrorForAllFields && formErrorForRequiredFields;
}

export const disabledDate = (date) => {
    return currentDate.isAfter(date);
};
export const disabledTime= (date) => {
    return currentTime.isBefore(date);
};

export const initialValues : ILineForm = {
  lineType: '',  
  lineName: '',
  positionPeriod: 0,
  datePicker:
  {
    lineStart: undefined,
    lineFinish: undefined,
  }
};
export const startOption = [
  { value: '', label: 'Select time' },

];
export const timeOptions = [
  { value: '18000000000', label: '30 minutes' },
  { value: '36000000000', label: '1 hour' },
  { value: '54000000000', label: '1.5 hours' },
  { value: '72000000000', label: '2 hours' },
  { value: '108000000000', label: '3 hours' },
  { value: '144000000000', label: '4 hours' }   
];

export const initialOption = [
  { value: '', label: 'Select time' },

];

export const lineOptions = [
  { value: 'live', label: 'Live line. The person reports in the bot on one`s own' },
  { value: 'timeslot', label: 'Line with time slots. Set time spent in queue' }
];

export const accountOption = [
  { value: '', label: 'Select account' },
];

export const accountOptions = [
  { value: 'plain', label: 'Account1' },
  { value: 'infinite', label: 'Account2' },
  { value: 'complex', label: 'Account' }
];

