import { Entity } from '../core/entity';

export interface Report extends Entity {
  uid: string;
  report: any;
}

export interface ReportUser extends Report {
  claimUid: string;
}
