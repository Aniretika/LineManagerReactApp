import { makeAutoObservable, runInAction } from 'mobx';
import { GetLine, GetLines, GetPositions, IsSteamAccountAvailable, RegisterLine } from '../api/agent';
import { initialValues, lineErrors, validateForm } from '../controls/registerLine/lineRegControls';
import { ILineError } from '../models/lineError';
import { ILineForm } from '../models/lineForm';
import { ILineInfo } from '../models/lineInfo';
import { IPosition } from '../models/position';

export default class LineStore{

    formValues: ILineForm = initialValues;
    lineList: ILineInfo[] = [];
    userName: string = '';
    emailAddress: string = '';
    positionList: IPosition[] = [];
    createdLine: ILineForm | null = null;
    formErrors: ILineError = lineErrors;
    isSteamAccountAvailable: boolean = true;
    selectedLine: ILineInfo | null = null;
    notify =  {
        isOpen: false,  
        message:'',
        type:''
    };
    isConfirmFormOpen = false;
    isSubmit = false;
    isDatePicker = false;
    isSteamAccount = false;

    constructor() {
        makeAutoObservable(this)
    }

    setUserName = async(name) => {
        runInAction(() =>
        {
            this.userName = name;
        })
    }
    loadLine = async (id: string) => {

        this.selectedLine = await GetLine(id);
    }

    loadPosition = async(id: string) => {
        
        await GetPositions(id).then(response => {
            runInAction(() =>
            {
                this.positionList = response!;
            })
        });
    }

    checkUser = async(account) => {
        runInAction(() =>
        {
            this.userName = account!.idTokenClaims!['given_name'];
            this.emailAddress = account!.username;
        })
    }

    createLine = async (history) => {
            let line = await RegisterLine(this.formValues, this.isSteamAccount);
            runInAction(() =>
            {
                this.selectedLine = line;
                this.isConfirmFormOpen = false;    
            })
          
            history.push(`/Line/${this.selectedLine?.id}`)
            this.getLineList();
        }

        getLineList = async() => {
            runInAction(() => {
                GetLines().then(lines =>  {
                    runInAction(() =>
                    {
                        this.lineList = lines;
                    })
                 })
                 .catch(e => console.log('Error: ', e));
                });
        }

    setDate = async (timeRange) => {
        runInAction(() =>
        {
            this.formValues.datePicker.lineStart = timeRange[0];
            this.formValues.datePicker.lineFinish = timeRange[1];
        })
       
    }

    setTimeSlot = async (time) => {
        runInAction(() =>
        {
            this.formValues.positionPeriod = time['value'];
        })
    }

    setLineType = async (lineState) => {
        runInAction(() =>
        {
            this.formValues.lineType = lineState['value'];
            this.formValues.positionPeriod = 0;
        })
    }

    setDatePicker = async() => {
        runInAction(() =>
        {
            this.isDatePicker = !this.isDatePicker;
            if(!this.isDatePicker)
            {
                this.formValues.datePicker.lineStart = undefined;
                this.formValues.datePicker.lineFinish = undefined;
            }
        })
    }

    setSteamAccount = async() => {
        runInAction(() =>
        {
            this.isSteamAccount = !this.isSteamAccount;
        })
    }

    setConfirmForm = async(state: boolean) => {
        runInAction(() =>
        {
            this.isSubmit = state;
            this.isDatePicker = state;
            this.isSteamAccount = state;
        })
    }

    resetAccountAvailability= async() => {
        runInAction(() =>
        {
            this.isSubmit = false;
            this.isSteamAccountAvailable = true;
            this.isSteamAccount = false;
        })
    }

    formValuesReset = async() => {
        runInAction(() =>
        {
            this.formValues = initialValues;
        })
    }

    steamAccountChecker = async() => {
        runInAction(() =>
        {
            if(!this.isSteamAccount)
            {
                this.isSteamAccountAvailable = true;
            }
            else
            {
                this.isSteamAccountAvailable = false;
            }
        })
        await IsSteamAccountAvailable().then(response =>
            {
                if(response)
                {
                    this.isSteamAccountAvailable = true;
                }
                else
                {
                    this.isSteamAccountAvailable = false;
                }
            }).catch(err => console.log(err));
    }

//TO DO: renewable formErrorState
    validationRunner = async() => {
        runInAction(() =>
        {
            if (!this.formValues.lineType) {
                this.formErrors.lineType = "Line type is required!";
              }
              else{
                this.formErrors.lineType = "";
              }
          
              if (!this.formValues.lineName) {
                this.formErrors.lineName = "Line name is required!";
              } 
              else{
                this.formErrors.lineName = "";
              }
          
              if(this.isDatePicker)
              {
                if(this.formValues.datePicker.lineStart === undefined || this.formValues.datePicker.lineFinish === undefined)
                {
                    this.formErrors.dateTime = "Date time is required";
                }
                else{
                    this.formErrors.dateTime = "";
                  }
              }
              else{
                this.formErrors.dateTime = "";
              }
    
              if(this.formValues.lineType === 'timeslot')
              {
                if (this.formValues.positionPeriod === 0) {
                    this.formErrors.positionPeriodText = "Time slot is required";
                }
                else{
                    this.formErrors.positionPeriodText = "";
                  }
              }
              else{
                this.formErrors.dateTime = "";
              }
        })

        return this.formErrors;
    }

    setLineValue = async(name: string, value: any) => {
        runInAction(() =>
        {
            this.formValues[name] = value;
        })
    }

    submitForm = async() => {
        this.validationRunner()
        runInAction(() =>
        {
            if(validateForm(this.formValues, this.formErrors))
            {
                this.isSubmit = true;
            }
            else
            {
            this.notify ={
                isOpen: true,
                message: 'Fill all required fields',
                type: 'error'
            };
            }
        })
    }
}