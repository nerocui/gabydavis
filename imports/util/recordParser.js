function parseName(name, role) {
  const [firstName, lastName] = name.split(" ");
  return { firstName, lastName, role };
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
    parentObjects.push({ firstName: parent, lastName: null, role: "parent" });
  });
  return parentObjects;
}

export function parseSocialWorker(name) {
  return parseName(name, "social-worker");
}

function parseSibling(string) {
  const [name, age] = string.split('age');
  console.log(name);
  return parseName(name.trim(), 'sibling');
}

export function parseSiblings(name) {
  const siblings = name.split(',');
  console.log(siblings);
  return siblings.map(element => parseSibling(element));
}