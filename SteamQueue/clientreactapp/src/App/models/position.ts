export interface IPosition {
    id: string;
    numberInTheQueue: number;
    requester: string;
    registrationTime: string;
    descriptionText: string;
    timelineStart: Date;
    timelineFinish: Date;
    lineId: string;
}