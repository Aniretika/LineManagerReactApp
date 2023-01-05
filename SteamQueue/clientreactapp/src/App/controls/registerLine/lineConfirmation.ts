import { ILineForm } from "../../models/lineForm";


export const confirmationTextMaker = (formValues: ILineForm) => 
{
    let result = 'Are you sure you want to add this line?\n';
    
    for (var key in formValues) {
        if (formValues.hasOwnProperty(key)) {
            switch(key) {
                case 'lineName':
                    result += `☄Line name: ${formValues.lineName}\n`;
                    break;
                case 'positionPeriod':
                    result += `☄Time of session: ${tickConvertor(formValues.positionPeriod)}\n`;
                    break;
                case 'lineStart':
                    result += `☄Start of session: ${formValues!.datePicker!.lineStart!.toLocaleString("en-US")}\n`;
                    break;
                case 'lineFinish':
                    result += `☄End of session: ${formValues!.datePicker!.lineFinish!.toLocaleString("en-US")}\n`;
                    break;
                default:
              }
        }
      }
    return result;
}

const tickConvertor = (ticks: number) =>
{
    let minutes = ticks/10000000/60;
    let hours = minutes/60;
    let result = `${minutes} minutes`;
    if(hours >= 1)
    {
        result += ` or ${hours} hour`
        if(hours > 1)
        {
            result += 's';
        }
    }
    return result;
}