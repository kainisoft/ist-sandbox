import { Injectable } from '@angular/core';

import { CustomFirestore } from '../core/firestore';

import { Report } from '../interfaces/report';

@Injectable()
export class ReportService extends CustomFirestore<Report> {

  get collectionName(): string {
    return 'report';
  }

}
