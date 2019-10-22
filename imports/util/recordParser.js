import UniqueId from "uniqid";
import changeCase from "change-case";
import settings from "../../settings.json";

function parseName(name, role) {
  const [firstName, lastName] = name.split(" ");
  return { first_name: firstName, last_name: lastName, role, _id: UniqueId() };
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
    parentObjects.push({
      first_name: parent,
      last_name: null,
      role: "parent",
      _id: UniqueId()
    });
  });
  return parentObjects;
}

function parseSibling(string) {
  const [name, age] = string.split("age");
  //console.log(name);
  return parseName(name.trim(), "sibling");
}

export function parseSiblings(name) {
  const siblings = name.split(",");
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
    } else if (stringValue.includes("months")) {
      return number * 30;
    } else {
      return 0;
    }
  }
  return 0;
}

function getRecommendations(header) {
  const relatedWords = header.split(" ");
  const headerValues = settings.public.RECORD_TEMPLATE;
  let recommendations = [];
  relatedWords.forEach(word => {
    const re = new RegExp(word, "i");
    const result = headerValues.filter(value => {
      return value.display_name.match(re);
    });
    recommendations = recommendations.concat(result);
  });

  return recommendations;
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
  const id = UniqueId();
  const headerValues = settings.public.RECORD_TEMPLATE;
  const re = new RegExp(header, "i");
  const filteredHeaders = headerValues.filter(headerValue => {
    if (headerValue.display_name === "Birthday" && header === "Birthday") {
      console.log(headerValue, header);
    }

    return headerValue.display_name.match(re);
  });
  let valid = null;
  let parsedHeader = null;
  let recommended = [];
  // console.log(filteredHeaders);
  const snakedCaseHeader = changeCase.snakeCase(header);
  if (filteredHeaders.length === 0) {
    valid = false;
    parsedHeader = snakedCaseHeader;
    recommended = getRecommendations(header);
  } else {
    valid = true;
    parsedHeader = filteredHeaders[0].display_name;
  }

  // console.log({ id, value: parsedHeader, valid, recommended });
  return {
    id,
    value: parsedHeader,
    valid,
    recommended,
    updatedValue: snakedCaseHeader
  };
}

/**
 *
 * @param {string} value
 * @param {ParsedHeader} parsedHeader
 * @returns {value: string, valid: boolean, parser: function}
 */
function parseCell(value, parsedHeader) {
  const valid = value ? true : false;

  return {
    id: parsedHeader.id,
    value,
    valid,
    parsedHeader,
    parser: null
  };
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
export const parseSheet = json => {
  console.log(json);
  const headers = Object.keys(json[0]);
  const parsedHeaders = headers.map(header => parseHeader(header));
  const res = [];

  json.forEach(row => {
    parsedHeaders.forEach(header => {
      const cellObj = parseCell(row[header.value], header);
      const record = {
        ...cellObj,
        valid: cellObj.valid && header.valid,
        originalValue: row[header.value]
      };

      res.push(record);
    });
  });
  console.log(res);
  // return res;
};
