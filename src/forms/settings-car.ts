import { CompleteProfileForm, CompleteProfileFormValues } from './complete-profile';
import { Element } from '../core/form-element';

import { SelectElement } from './elements/select/select';
import { NumberElement } from './elements/number/number';

export const MILE_AGE_ELEMENT = 'mileage';
export const COLOR_ELEMENT = 'color';
export const EXTERIOR_ELEMENT = 'exterior';
export const INTERIOR_ELEMENT = 'interior';

export class SettingsCarForm extends CompleteProfileForm {

  constructor() {
    super();

    const mileAge = new NumberElement(MILE_AGE_ELEMENT);
    mileAge.setLabel('Mileage');
    this.addElement(mileAge);

    const color = new SelectElement(COLOR_ELEMENT);
    color.setLabel('Color');
    color.setOptions(Object.keys(Colors));
    this.addElement(color);

    const exterior = new SelectElement(EXTERIOR_ELEMENT);
    exterior.setLabel('Exterior');
    exterior.setMultiple(true);
    exterior.setOptions([
      'Weather-cloth',
      'Tinted',
      'Spoiler',
      'Cast discs',
      'Sunroof'
    ]);
    this.addElement(exterior);

    const interior = new SelectElement(INTERIOR_ELEMENT);
    interior.setLabel('Interior');
    interior.setMultiple(true);
    interior.setOptions([
      'Velour',
      'Leather',
      'Combined',
      'Wood'
    ]);
    this.addElement(interior);
  }

  getMileAge(): Element {
    return this.getElement(MILE_AGE_ELEMENT);
  }

  getColor(): Element {
    return this.getElement(COLOR_ELEMENT);
  }

  getExterior(): Element {
    return this.getElement(EXTERIOR_ELEMENT);
  }

  getInterior(): Element {
    return this.getElement(INTERIOR_ELEMENT);
  }

  getValues(): SettingsCarFormValues {
    const {year, volume, mileage, color, exterior, interior} = super.getValues();

    return {year, volume, mileage, color, exterior, interior};
  }

}

export interface SettingsCarFormValues extends CompleteProfileFormValues {
  mileage: number;
  color: string;
  exterior: string[];
  interior: string[];
}

export enum Colors {
  Silver = 'C0C0C0',
  Black = '000000',
  White = 'FFFFFF',
  Gray = 'A0A0A4',
  Beige = 'F5F5DC',
  Turquoise = '1CA9C9',
  Vinous = '9B2D30',
  Cherry = '911E42',
  Cyan = '00BFFF',
  Yellow = 'FFBA00',
  Green = '386646',
  Golden = 'DAA520',
  Brown = '806B2A',
  Red = 'AF2B1E',
  Orange = 'FF7514',
  Pink = 'FC89AC',
  Blue = '1A4780',
  Lilac = '6C4675',
  Purple = '7366BD',
  Chameleon = '3C4458',
  Eggplant = '6E5160'
}
