import { Pipe, PipeTransform } from '@angular/core';

import { User } from '../interfaces/user';

@Pipe({name: 'displayName'})
export class DisplayNamePipe implements PipeTransform {

  transform(user: User): any {
    const {firstName, lastName} = user.profile;

    return `${firstName} ${lastName}`;
  }

}
