// DOM
const canvasDOM = document.getElementById("canvas"),
  spanTimingDOM = document.getElementById("timing"),
  context2d = canvasDOM.getContext("2d");
(scoreWrapperDOM = document.getElementsByClassName("score-wrapper")[0]),
  (timerWrapperDOM = document.getElementsByClassName("timer-wrapper")[0]),
  (questionWrapperDOM = document.getElementById("question-wrapper")),
  (answerWrapperDOM = document.getElementById("answer-wrapper")),
  (loadGameDOM = document.getElementById("load-game")),
  (questionDOM = document.getElementsByClassName("question"));
answerButtonsDOM = answerWrapperDOM.querySelectorAll(".answer");

// property
let score = 0;
const scoreRate = 10;
const audioSource = ["static/sound/correct.mp3", "static/sound/wrong.mp3"];
const audio = new Audio();

// call functions
initialElements();

// set handlers
loadGameDOM.addEventListener("click", loadGameDOMHandlerClick);
loopThrowTheArray(Array.from(answerButtonsDOM), (element) =>
  element.addEventListener("click", answerButtonDOMHandler)
);

// handlers
function resetScore() {
  score = 0;
  scoreWrapperDOM.querySelector("#score").innerHTML = score;
}

function loadNextQuestion() {
  putQuestionToDOM();
  timerProgress(7);
}

function loadGameDOMHandlerClick() {
  const thisElement = this;
  thisElement.classList.add("hide");
  loopThrowTheArray(getListOfHiddenDOM(), function (element, index, elements) {
    if (thisElement.classList.contains("reload")) {
      element.classList.remove("disabled");
      if (elements.length == index + 1) thisElement.classList.remove("reload");
    } else {
      element.classList.remove("hide");
    }
  });

  resetScore();
  loadNextQuestion();
}

function answerButtonDOMHandler() {
  const thisElement = this;
  checkQuestionAnswer(thisElement.id, window.baseQuestion);
}

// helpers
function checkQuestionAnswer(state, question) {
  const answer = eval(question);
  const scoreOld = score;
  if (answer == window.justAnswer) {
    if (state == "correct") {
      score += scoreRate;
    }
  } else if (answer != window.justAnswer) {
    if (state == "wrong") {
      score += scoreRate;
    }
  }

  scoreWrapperDOM.querySelector("#score").innerHTML = score;

  if (scoreOld != score) {
    loadAndPlaySound(audioSource[0]);
    loadNextQuestion();
  } else if (scoreOld == score) {
    clearInterval(acrInterval);
    previewScoreAndShowLoadGame(false, answer);
  }
}

function putQuestionToDOM() {
  const question = generateQuestion().split(" ");
  loopThrowTheArray(Array.from(questionDOM), function (element, index) {
    element.innerHTML = question[index];
  });
}

function generateQuestionAnswerCorrectOrWrongRandom(x, y, operator) {
  const possibleAnswers = [eval(`${x} ${operator} ${y}`)];

  possibleAnswers[1] = possibleAnswers[0] - generateRandomIntNumber(5, 16);
  if (possibleAnswers[1] < 0)
    possibleAnswers[1] = possibleAnswers[0] + generateRandomIntNumber(5, 16);

  const answer = possibleAnswers[generateRandomIntNumber(0, 1)];
  const questionVsAnswer = `${x} ${operator} ${y} = ${answer}`;
  window.baseQuestion = `${x} ${operator} ${y}`;
  window.justAnswer = answer;
  return questionVsAnswer;
}

function generateQuestionPlus(operator) {
  var minX = 10,
    maxX = 100,
    minY = 10,
    maxY = 100,
    x,
    y;
  x = generateRandomIntNumber(minX, maxX);
  y = generateRandomIntNumber(minY, maxY);
  return generateQuestionAnswerCorrectOrWrongRandom(x, y, operator);
}

function generateQuestionMinus(operator) {
  return generateQuestionPlus("-");
}

function generateQuestionMultiply(operator) {
  var minX = 2,
    maxX = 9,
    minY = 2,
    maxY = 9,
    x,
    y;
  x = generateRandomIntNumber(minX, maxX);
  y = generateRandomIntNumber(minY, maxY);
  return generateQuestionAnswerCorrectOrWrongRandom(x, y, operator);
}

function generateQuestionDivision(operator) {
  var minX = 11,
    maxX = 50,
    minY = 2,
    maxY = 9,
    x,
    y;
  x = generateRandomIntNumber(minX, maxX);
  y = generateRandomIntNumber(minY, maxY);

  while (x % y != 0) {
    x = generateRandomIntNumber(minX, maxX);
    y = generateRandomIntNumber(minY, maxY);
  }

  return generateQuestionAnswerCorrectOrWrongRandom(x, y, operator);
}

function generateQuestion() {
  var operators, operatorIndex, currentOperator;

  operators = ["+", "-", "*", "/"];
  operatorIndex = generateRandomIntNumber(0, operators.length - 1);
  currentOperator = operators[operatorIndex];
  var question = "";

  switch (currentOperator) {
    case "+":
      question = generateQuestionPlus(currentOperator);
      break;

    case "-":
      question = generateQuestionMinus(currentOperator);
      break;

    case "*":
      question = generateQuestionMultiply(currentOperator);
      break;

    case "/":
      question = generateQuestionDivision(currentOperator);
      break;

    default:
      console.warn("unallowed operator");
      break;
  }

  return question;
}

function generateRandomIntNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getListOfHiddenDOM() {
  const hiddenDOM = [
    scoreWrapperDOM,
    timerWrapperDOM,
    questionWrapperDOM,
    answerWrapperDOM,
  ];
  return hiddenDOM;
}

function loopThrowTheArray(arr, func) {
  arr.forEach(func);
}

function timerProgress(seconds) {
  if (typeof acrInterval != "undefined") clearInterval(acrInterval);

  var posX = canvasDOM.width / 2,
    posY = canvasDOM.height / 2,
    updateRate = 1000,
    toMaxRadian = Math.PI * 2,
    radius = 40;

  context2d.lineCap = "round";
  var deegres = 0;
  var counter = 0;
  window.acrInterval = setInterval(function () {
    counter++;
    deegres += 360 / seconds;
    context2d.clearRect(0, 0, canvasDOM.width, canvasDOM.height);

    var progress = (counter / seconds) * 100,
      color = "00bcd4";

    spanTimingDOM.innerHTML = counter;

    if (0 <= progress && progress < 33) color = "00bcd4";
    else if (33 <= progress && progress < 66) color = "ff9800";
    else if (66 <= progress) color = "f44336";

    context2d.beginPath();
    context2d.arc(posX, posY, radius, 0, toMaxRadian);
    context2d.strokeStyle = "#b1b1b1";
    context2d.lineWidth = 5;
    context2d.stroke();

    context2d.beginPath();
    context2d.strokeStyle = `#${color}`;
    spanTimingDOM.style.color = `#${color}`;
    context2d.lineWidth = 5;
    context2d.arc(posX, posY, radius, 0, radianDegress(true, deegres));
    context2d.stroke();
    if (radianDegress(true, deegres).toFixed(2) == toMaxRadian.toFixed(2)) {
      previewScoreAndShowLoadGame(true);
      clearInterval(acrInterval);
    }
  }, updateRate);
}

function previewScoreAndShowLoadGame(timesUp, answer = "") {
  loadAndPlaySound(audioSource[1]);

  if (timesUp) {
    cuteToast({
      type: "info",
      message: "دیر جواب دادی",
      timer: "3500",
    });
  } else {
    if (answer < 0) answer = "منفی " + answer.toString().replace("-", "");

    cuteToast({
      type: "error",
      message: `جوابت اشتباه بود درستش میشه ${answer}`,
      timer: "3500",
    });
  }

  loadGameDOM.classList.remove("hide");
  loadGameDOM.classList.add("reload");
  loopThrowTheArray(getListOfHiddenDOM(), function (element) {
    if (element.classList.contains("score-wrapper")) return;
    element.classList.add("disabled");
  });
}

function radianDegress(toRadianConvert, val) {
  const radian = Math.PI;
  const deegree = 180;
  const tmpVal = toRadianConvert
    ? (radian / deegree) * val
    : (deegree / radian) * radian * val;
  return tmpVal;
}

String.prototype.getBaseConversionNumber = function (label) {
  const faDigits = ["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹", "۰"];
  const enDigits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
  const arDigits = ["٠", "٩", "٨", "٧", "٦", "٥", "٤", "٣", "٢", "١"];

  var whichDigit = {};

  switch (label) {
    case "fa":
      whichDigit[label] = faDigits;
      break;
    case "en":
      whichDigit[label] = enDigits;
      break;
    case "ar":
      whichDigit[label] = arDigits;
      break;
    case "all":
      whichDigit = {
        fa: faDigits,
        en: enDigits,
        ar: arDigits,
      };
      break;
    default:
      whichDigit = [];
  }

  return whichDigit;
};

String.prototype.CvnFromTo = function (fromDigits, toDigits, str) {
  var str = str == undefined ? this : str;
  for (var i = 0; i < toDigits.length; i++) {
    const currentFromDigit = fromDigits[i];
    const currentToDigit = toDigits[i];
    const regex = new RegExp(currentFromDigit, "g");
    str = str.replace(regex, currentToDigit);
  }
  return str;
};

String.prototype.convertDigits = function (to) {
  let str = this;
  const toCvn = this.getBaseConversionNumber(to)[to];
  const allDigits = this.getBaseConversionNumber("all");

  delete allDigits[to];

  const Objkeys = Object.keys(allDigits);
  for (var i = 0; i < Objkeys.length; i++) {
    const currentKey = Objkeys[i];
    const fromCvn = allDigits[currentKey];
    str = this.CvnFromTo(fromCvn, toCvn, str);
  }
  return str;
};

function loadAndPlaySound(src) {
  audio.src = src;
  audio.load();
  audio.play();
}

function initialElements() {
  audioSource.forEach((element) => {
    audio.src = element;
    audio.load();
  });
}
