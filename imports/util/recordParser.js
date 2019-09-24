import UniqueId from "uniqid";

function parseName(name, role) {
  const [firstName, lastName] = name.split(" ");
  return { first_name:firstName, last_name:lastName, role, "_id": UniqueId()};
}

export function parseChild(name) {
  return parseName(name, "child");
}

export function parseParents(name) {
  const parents = name.split(" and ");
  let parentObjects = [];
  parents.forEach(parent => {
    if (!parent) {
      return;
    }
    if (/(?<=[a-z]) (?=[a-z])/i.test(parent)) {
      parentObjects.push(parseName(parent, "parent"));
      return;
    }
    parentObjects.push({ first_name: parent, last_name: null, role: "parent", "_id": UniqueId() });
  });
  return parentObjects;
}

function parseSibling(string) {
  const [name, age] = string.split('age');
  //console.log(name);
  return parseName(name.trim(), 'sibling');
}

export function parseSiblings(name) {
  const siblings = name.split(',');
  //console.log(siblings);
  return siblings.map(element => parseSibling(element));
}

// assumes that the user enters in a number in the first value of the string and a unit of length
export function parseLengthOfTreatment(stringValue) {
  const number = parseInt(stringValue);
  if (Number.isInteger(number) && number > 0) {
    stringValue = stringValue.toLowerCase();
    if (stringValue.includes("years")) {
      return number * 365;
    } else if(stringValue.includes("months")) {
      return number * 30;
    } else {
      return 0;
    }
  }
  return 0;
}

/**
 * 
 * @param {string} header 
 * @returns {id: string, value(parsed value): string, valid: boolean, recommended: string[]} ParsedHeader
 */
function parseHeader(header) {
  //set an uniqid so we can find the cells using the old header in case of updating header.
  //read into the settings column.
  //if no match, try to break header into 
  //array of words and find the column that
  //include all the words.toLower().
  //if still no match,
  //return the header converted to snake case, then set valid to false
  //then find the column that include the most of the words,
  //ranked from most likely to least.
  return 'header';//stub
}


/**
 * 
 * @param {string} value 
 * @param {ParsedHeader} parsedHeader
 * @returns {value: string, valid: boolean, parser: function}
 */
function parseCell(value, parsedHeader) {
  return 'value';//stub
}


//@return record[]
/*record: {
  [header_id]: string,
  valid: boolean,
  parsedHeader: ParsedHeader,
  originalValue: string,
  parser: function,
}
*/
/**
 * 
 * @param {CSV} csv
 * @returns {Records} [...{ id: string, value: string, valid: boolean, parsedHeader: ParsedHeader, originalValue: string, parser: function,}]
 */
export const parseSheet = csv => {
  const rows = csv.split("\n");
  const grid = rows.map(row => row.split(","));
  const headers = grid[0];
  const res = [];
  for (let i = 0; i < headers.length; i++) {
    const parsedHeader = parseHeader(headers[i]);
    let records = [];
    for (let j = 1; j < grid.length; j++) {
      const record = {};
      const row = grid[i];
      const parsedCell = parseCell(row[j], parsedHeader);
      record.id = parsedHeader.id;
      record.value = parsedCell.value;
      record.valid = parsedCell.valid && parseHeader.valid;
      record.parsedHeader = parsedHeader;
      record.originalValue = row[j];
      record.parser = parsedCell.parser;
      records.push(record);
    }
    res.push(records);
  }
  return res;
};
