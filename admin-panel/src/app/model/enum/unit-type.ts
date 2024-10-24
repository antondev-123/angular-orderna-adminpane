import isEnumValue from "@orderna/admin-panel/src/utils/is-enum-value";

export enum Unit {
   GRAM ='g',
   KILOGRAM ='kg'
  }
  
  export const isUnit = (value: any) => isEnumValue(Unit, value);

  export interface WithUnit {
    unit: Unit;
  }