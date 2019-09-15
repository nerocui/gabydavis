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