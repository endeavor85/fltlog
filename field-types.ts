export enum FieldType {
    'boolean',
    'float',
    'int',
    'string',
    'uint'
}

export const fieldTypeLookup: Map<string, FieldType> = new Map();

fieldTypeLookup.set('TIME', FieldType.string);
fieldTypeLookup.set('SEL TANK QTY', FieldType.string); // 'TOTAL   : 0.00'
fieldTypeLookup.set('RPMLEFT;RPM', FieldType.uint);
fieldTypeLookup.set('RPMRIGHT;RPM', FieldType.uint);
fieldTypeLookup.set('RPM;***', FieldType.uint);
fieldTypeLookup.set('MP;InHg', FieldType.float);
fieldTypeLookup.set('TEMP COMP;*F', FieldType.int);
fieldTypeLookup.set('FLOW;GPH', FieldType.float);
fieldTypeLookup.set('FLOW     ANN;GPH', FieldType.float);
fieldTypeLookup.set('EGT1;*F', FieldType.int);
fieldTypeLookup.set('EGT2;*F', FieldType.int);
fieldTypeLookup.set('EGT3;*F', FieldType.int);
fieldTypeLookup.set('EGT4;*F', FieldType.int);
fieldTypeLookup.set('EGT:;***', FieldType.int);
fieldTypeLookup.set('EGT-D:;***', FieldType.int);
fieldTypeLookup.set('EGT-H:;***', FieldType.int);
fieldTypeLookup.set('CHT1;*F', FieldType.int);
fieldTypeLookup.set('CHT2;*F', FieldType.int);
fieldTypeLookup.set('CHT3;*F', FieldType.int);
fieldTypeLookup.set('CHT4;*F', FieldType.int);
fieldTypeLookup.set('CHT:;***', FieldType.int);
fieldTypeLookup.set('CHT-D:;***', FieldType.int);
fieldTypeLookup.set('CHT-H:;***', FieldType.int);
fieldTypeLookup.set('OIL P;PSI', FieldType.int);
fieldTypeLookup.set('OIL P    ANN;PSI', FieldType.int);
fieldTypeLookup.set('OIL T;*F', FieldType.int);
fieldTypeLookup.set('OIL T    ANN;*F', FieldType.int);
fieldTypeLookup.set('HP;%', FieldType.int);
fieldTypeLookup.set('FLT;HRS', FieldType.string);
fieldTypeLookup.set('TACH;HRS', FieldType.string);
fieldTypeLookup.set('ENG;HRS', FieldType.string);
fieldTypeLookup.set('LOCAL;H:M:S', FieldType.string);
fieldTypeLookup.set('ZULU;H:M:S', FieldType.string);
fieldTypeLookup.set('EST  TOTAL;GAL', FieldType.float);
fieldTypeLookup.set('RANGE;NM', FieldType.float);
fieldTypeLookup.set('TO DEST;NM', FieldType.float);
fieldTypeLookup.set('AT DEST;NM', FieldType.float);
fieldTypeLookup.set('REMAIN;GAL', FieldType.float);
fieldTypeLookup.set('TO DEST;GAL', FieldType.float);
fieldTypeLookup.set('AT DEST;GAL', FieldType.float);
fieldTypeLookup.set('TO EMPTY;H:M', FieldType.string);
fieldTypeLookup.set('TO DEST;H:M', FieldType.string);
fieldTypeLookup.set('AT DEST;H:M', FieldType.string);
fieldTypeLookup.set('DISTANCE;NM', FieldType.float);
fieldTypeLookup.set('TIME;H:M', FieldType.string);
fieldTypeLookup.set('QUANTITY;GAL', FieldType.float);
fieldTypeLookup.set('FLIGHT;GAL', FieldType.float);
fieldTypeLookup.set('SINCE ADD;GAL', FieldType.float);
fieldTypeLookup.set('ECONOMY;MPG', FieldType.float);
fieldTypeLookup.set('ENGINE;GPH', FieldType.float);
fieldTypeLookup.set('SWITCH IN;H:M', FieldType.float);
fieldTypeLookup.set('SWTCH    ANN; ', FieldType.float);
fieldTypeLookup.set('FUEL     ANN; ', FieldType.float);
fieldTypeLookup.set('', FieldType.string);
