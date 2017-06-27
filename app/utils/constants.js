const sextypes = ['f', 'm', 'mf', 'ff', 'mm'];

const self_sextypes = [
  {
    value: 'm',
    label: 'Single Woman',
  },
  {
    value: 'f',
    label: 'Single Man',
  },
  {
    value: 'mf',
    label: 'Male/Female Couple',
  },
  {
    value: 'mm',
    label: 'Female/Female Couple',
  },
  {
    value: 'ff',
    label: 'Male/Male Couple',
  },
];

const self_labels = {
  'f': 'Single Woman',
  'm': 'Single Man',
  'mf': 'M/F Couple',
  'ff': 'F/F Couple',
  'mm': 'M/M Couple',
};

const looking_sextypes = [
  {
    value: 'f',
    label: 'Single Women',
  },
  {
    value: 'm',
    label: 'Single Men',
  },
  {
    value: 'mf',
    label: 'Male/Female Couples',
  },
  {
    value: 'ff',
    label: 'Female/Female Couples',
  },
  {
    value: 'mm',
    label: 'Male/Male Couples',
  },
];

const looking_labels = {
  'f': 'Single Women',
  'm': 'Single Men',
  'mf': 'M/F Couples',
  'ff': 'F/F Couples',
  'mm': 'M/M Couples',
};

export { sextypes, self_labels, self_sextypes, looking_labels, looking_sextypes };
