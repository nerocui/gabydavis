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