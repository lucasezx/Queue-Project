// lista todas as chaves de um objeto
// Exemplo: keys({ a: 1, b: 2 }) => ["a", "b"]

function keys(obj) {
  return Object.keys(obj);
}
console.log("keys", keys({ a: 1, b: 2, c: 3 }));

// lista todos os valores de um objeto
// Exemplo: values({ a: 1, b: 2 }) => [1, 2]

function values(val) {
  return Object.values(val);
}

console.log("values", values({ a: 1, b: 2 }));

// agrupa elementos do array em conjuntos de arrays para multiplo de 10
// Exemplo: groupByDecade([1990, 1991, 1999, 2000, 2001, 2002]) => { 1990: [1990, 1991, 1999], 2000: [2000, 2001, 2002] }

function groupByDecade(group) {
  return group.reduce((accumulator, currentValue) => {
    const decade = Math.floor(currentValue / 10) * 10;

    if (!accumulator[decade]) {
      accumulator[decade] = [];
    }
    accumulator[decade].push(currentValue);
    return accumulator;
  }, {});
}

console.log(
  "groupByDecade",
  groupByDecade([1990, 1991, 1999, 2000, 2001, 2002])
);

// agrupa cidades por estado
// Exemplo: groupByState([{ city: "New York", state: "NY" }, { city: "Los Angeles", state: "CA" }, { city: "Chicago", state: "IL" }, { city: "Houston", state: "TX" }]) => { NY: ["New York"], CA: ["Los Angeles"], IL: ["Chicago"], TX: ["Houston"] }

function groupByState(group) {
  return group.reduce((accumulator, currentValue) => {
    const { state } = currentValue;

    if (!accumulator[state]) {
      accumulator[state] = [];
    }

    accumulator[state].push(currentValue);
    return accumulator;
  }, {});
}

console.log(
  "groupByState",
  groupByState([
    { city: "New York", state: "NY" },
    { city: "Los Angeles", state: "CA" },
    { city: "Chicago", state: "IL" },
    { city: "Houston", state: "TX" },
  ])
);

// agrupa elementos do array por um determinado atributo
// Exemplo: groupBy([{ name: "John", age: 21 }, { name: "Mike", age: 22 }, { name: "Julia", age: 21 }], "age") => { 21: [{ name: "John", age: 21 }, { name: "Julia", age: 21 }], 22: [{ name: "Mike", age: 22 }] }

function groupBy(group, attribute) {
  return group.reduce((accumulator, currentValue) => {
    const value = currentValue[attribute];

    if (!accumulator[value]) {
      accumulator[value] = [];
    }
    accumulator[value].push(currentValue);
    return accumulator;
  }, {});
}

console.log(
  "groupBy",
  groupBy(
    [
      { name: "John", age: 21 },
      { name: "Mike", age: 22 },
      { name: "Julia", age: 21 },
    ],
    "age"
  )
);

// cria um novo objeto a partir da junção de dois objetos
// Exemplo: merge({ a: 1 }, { b: 2 }) => { a: 1, b: 2 }

function merge(...union) {
  return Object.assign({}, ...union);
}

console.log("merge", merge({ a: 1 }, { b: 2 }, { c: 3 }));

// checa se um objeto é vazio
// Exemplo: isEmpty({}) => true

function isEmpty(obj) {
  const keys = Object.keys(obj);

  return keys.length === 0;
}

console.log("isEmpty", isEmpty({}));

// checa se um objeto é igual a outro
// Exemplo: isEqual({ a: 1 }, { a: 1 }) => true

function isEqual(obj1, obj2) {
  const key1 = Object.keys(obj1);
  const key2 = Object.keys(obj2);

  if (key1.length !== key2.length) {
    return false;
  }

  for (let key of key1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
}

console.log("isEqual", isEqual({ a: 1 }, { a: 1 }, {}));

// checa se um objeto tem uma determinada chave
// Exemplo: hasKey({ a: 1 }, "a") => true

function hasKey(target, source) {
  return Object.hasOwn(target, source);
}

console.log("hasKey", hasKey({ a: 1 }, "a"));

// checa se um objeto tem um determinado valor
// Exemplo: hasValue({ a: 1 }, 1) => true

function hasValue(target, sourceValue) {
  const value = Object.values(target);

  return value.includes(sourceValue);
}

console.log("hasValue", hasValue({ a: 1 }, 1));

// checa se um objeto tem uma determinada chave e valor
// Exemplo: hasKeyValue({ a: 1 }, "a", 1) => true

function hasKeyValue(target, source, sourceValue) {
  return target.hasOwnProperty(source) && target[source] == sourceValue;
}

console.log("hasKeyValue", hasKeyValue({ a: 1 }, "a", 1));

// criar um objeto composto pela inversão de chaves e valores
// Exemplo: invert({ a: 1, b: 2 }) => { 1: "a", 2: "b" }

function invert(obj) {
  const invertedObj = {};
  for (const [key, value] of Object.entries(obj)) {
    invertedObj[value] = key;
  }
  return invertedObj;
}

console.log("invert", invert({ a: 1, b: 2 }));

// criar um objeto sem determinadas chaves
// Exemplo: omit({ a: 1, b: 2, c: 3 }, ["a", "c"]) => { b: 2 }

function omit(obj, keys) {
  const newObj = { ...obj };
  keys.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

console.log("omit", omit({ a: 1, b: 2, c: 3 }, ["a", "c"]));

// criar um objeto com determinadas chaves
// Exemplo: pick({ a: 1, b: 2, c: 3 }, ["a", "c"]) => { a: 1, c: 3 }
function pick(obj, keys) {
  const newObj = {};
  keys.forEach((key) => {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}
console.log("pick", pick({ a: 1, b: 2, c: 3 }, ["a", "c"]));

// analisa um vetor e retorna um objeto com a media, mediana, moda, minimo e maximo e a quantidade de elementos
// Exemplo: analyze([1, 2, 3, 3, 4, 5, 9, 10]) => { mean: 4.625, median: 3.5, mode: [3], min: 1, max: 10, length: 8 }

function analyze(nums) {
  const mean = nums.reduce((acc, num) => acc + num, 0) / nums.length;
  const sortedNums = [...nums].sort((a, b) => a - b);
  const median =
    nums.length % 2 === 0
      ? (sortedNums[nums.length / 2 - 1] + sortedNums[nums.length / 2]) / 2
      : sortedNums[Math.floor(nums.length / 2)];

  const frequency = sortedNums.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {});

  const maxFrequency = Math.max(...Object.values(frequency));
  const mode = Object.keys(frequency)
    .filter((key) => frequency[key] === maxFrequency)
    .map(Number);
  const max = Math.max(...nums);
  const min = Math.min(...nums);
  const length = nums.length;
  return { mean, median, mode, min, max, length };
}

console.log("analyze", analyze([1, 2, 3, 3, 4, 5, 9, 10]));
