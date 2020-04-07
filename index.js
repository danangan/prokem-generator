Array.prototype.first = String.prototype.first = function () {
  if (this.length === 0) {
    return null;
  }

  return this[0];
};

Array.prototype.last = String.prototype.last = function () {
  if (this.length === 0) {
    return null;
  }

  return this[this.length - 1];
};

Array.prototype.getNthElement = String.prototype.getNthElement = function (n) {
  if (n > this.length) {
    return null;
  }

  return this[n - 1];
};

function prokemGenerator(string) {}

function splitToSyllabels(string) {
  const result = [];
  if (string.length === 0) {
    return result;
  }

  let stringIndex = 0;
  let numberOfSyllabel = 0;
  let currentLetter;
  let previousLetter;
  let isNewSyllabel = true;
  while (stringIndex < string.length) {
    currentLetter = string.slice(stringIndex, stringIndex + 1);
    if (isNewSyllabel) {
      result[numberOfSyllabel++] = currentLetter;
      previousLetter = currentLetter;
      isNewSyllabel = false;
    } else {
      result[numberOfSyllabel] = result[numberOfSyllabel].concat(currentLetter);
      if (true) {
        isNewSyllabel = true;
      }
    }
    stringIndex++;
  }

  return result;
}

function isValidSyllabel(syllabel) {
  if (syllabel.length === 0) {
    return false;
  }
  // Prefixed by vocal
  if (isVocal(syllabel[0])) {
    if (syllabel[1]) {
      if (isConsonant(syllabel[1])) {
        if (syllabel[1] === "n") {
          if (syllabel[2]) {
            return syllabel[2] && syllabel[2] === "g";
          }
        }

        return !syllabel[2];
      }
    }

    return true;
  }

  // Prefixed by consonant
  const [firstLetter, restSyllabel] = pluckFirstLetter(syllabel);
  syllabel = restSyllabel;
  if (syllabel.length === 0) {
    return false;
  }

  if (isVocal(syllabel[0])) {
    return isValidSyllabel(syllabel);
  }

  if (
    (firstLetter === "n" &&
      (syllabel.first() === "y" || syllabel.first === "g")) ||
    (firstLetter === "p" && syllabel.first() === "r")
  ) {
    const [_, rest] = pluckFirstLetter(syllabel);
    return isValidSyllabel(rest);
  }

  return false;
}

// Test
// console.log(isValidSyllabel(""), "should be", false);
// console.log(isValidSyllabel("maka"), "should be", false);
// console.log(isValidSyllabel("pre"), "should be", true);
// console.log(isValidSyllabel("ngam"), "should be", true);
// console.log(isValidSyllabel("a"), "should be", true);
// console.log(isValidSyllabel("am"), "should be", true);
// console.log(isValidSyllabel("ang"), "should be", true);
// console.log(isValidSyllabel("an"), "should be", true);
// console.log(isValidSyllabel("ba"), "should be", true);
// console.log(isValidSyllabel("sen"), "should be", true);
// console.log(isValidSyllabel("b"), "should be", false);
// console.log(isValidSyllabel("bong"), "should be", true);
// console.log(isValidSyllabel("bo"), "should be", true);
// console.log(isValidSyllabel("nya"), "should be", true);
// console.log(isValidSyllabel("nza"), "should be", false);
// console.log(isValidSyllabel("maka"), "should be", false);

function pluckFirstLetter(word) {
  const firstLetter = word.slice(0, 1);
  word = word.slice(1, word.length);
  return [firstLetter, word];
}

function pluckFirstSyllable(
  word,
  syllabel = "",
  prevValidSyllable = "",
  prevValidWord = ""
) {
  if (isValidSyllabel(syllabel)) {
    prevValidSyllable = syllabel;
    prevValidWord = word;
  }

  if ((!isValidSyllabel(syllabel) && prevValidSyllable) || word.length === 0) {
    if (
      prevValidWord.length !== 0 &&
      isConsonant(prevValidSyllable.last()) &&
      isVocal(prevValidWord.first())
    ) {
      return [
        removeLastLetter(prevValidSyllable),
        prevValidSyllable.last() + prevValidWord,
      ];
    }

    return [prevValidSyllable, prevValidWord];
  }

  const [firstLetter, restWord] = pluckFirstLetter(word);

  syllabel = syllabel.concat(firstLetter);
  word = restWord;

  return pluckFirstSyllable(
    restWord,
    syllabel,
    prevValidSyllable,
    prevValidWord
  );
}

// Test
// let makan = pluckFirstSyllable("makan");
// let ngambek = pluckFirstSyllable("ngambek");
// let nyaman = pluckFirstSyllable("nyaman");
// let nyambung = pluckFirstSyllable("nyambung");
// let o = pluckFirstSyllable("o");
// console.log(makan, "should be", ["ma", "kan"]);
// console.log(ngambek, "should be", ["ngam", "bek"]);
// console.log(nyaman, "should be", ["nya", "man"]);
// console.log(nyambung, "should be", ["nyam", "bung"]);
// console.log(o, "should be", ["o", ""]);

function getSyllabels(word, syllabels = []) {
  if (word === "") {
    return syllabels;
  }

  const [firstSyllabel, restWord] = pluckFirstSyllable(word);
  return getSyllabels(restWord, [...syllabels, firstSyllabel]);
}

// let makan = getSyllabels("makan");
// let gila = getSyllabels("gila");
// let ngambek = getSyllabels("ngambek");
// let sendiri = getSyllabels("sendiri");
// let o = getSyllabels("o");
// console.log(makan, "should be", ["ma", "kan"]);
// console.log(gila, "should be", ["gi", "la"]);
// console.log(ngambek, "should be", ["ngam", "bek"]);
// console.log(sendiri, "should be", ["sen", "di", "ri"]);
// console.log(o, "should be", ["o"]);

function isVocal(letter) {
  switch (letter.toLowerCase()) {
    case "a":
    case "i":
    case "u":
    case "e":
    case "o":
      return true;
      break;
    default:
      return false;
      break;
  }
}

function isConsonant(letter) {
  return !isVocal(letter);
}

function removeLastLetter(word) {
  return word.slice(0, word.length - 1);
}

function generateProkem(word) {
  const syllabels = getSyllabels(word);

  if (syllabels.length === 0 || syllabels.length > 3) {
    return null;
  }

  let targetSyllable = syllabels.getNthElement(syllabels.length - 1);
  if (isVocal(targetSyllable.last())) {
    targetSyllable = targetSyllable.concat(
      syllabels.getNthElement(syllabels.length).first()
    );
  }

  targetSyllable = `${targetSyllable.first()}ok${targetSyllable.slice(
    1,
    targetSyllable.length
  )}`;

  const prefixSyllable = syllabels.getNthElement(syllabels.length - 2);

  return (prefixSyllable || "") + targetSyllable;
}

// Test
let gokil = generateProkem("gila");
let sepatu = generateProkem("sepatu");
// console.log(gokil, "should be", "gokil");
// console.log(sepatu, "should be", "sepokat");
