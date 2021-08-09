const dateSelector = document.getElementById("birth_date");
const submitButton = document.getElementById("submit");
const invalid = document.getElementById("invalid-input");
const clock = document.getElementById("clock");
const rAnswer = document.getElementById("r-answer");
const wAnswer = document.getElementById("w-answer");

const sumOfDigits = (dateString) => {
  let sum = 0;
  for (const x of dateString.split("")) sum += Number.parseInt(x, 10);
  return sum;
};

const stringReverse = (str) => str.split("").reverse().join("");

/**
 * Checks data in  dd-mm-yyyy, mm-dd-yyyy,mm-dd-yy formats
 * @param {Date} date
 * @returns {Object}  {date:date, format: 'dd-mm-yy'}
 */
const checkPallindrome = (date) => {
  const { d, m, y } = {
    d: date.getDate(),
    m: date.getMonth() + 1,
    y: date.getFullYear(),
  };
  const ddmmyyyy = [d, m, y].map((n) => (n < 10 ? `0${n}` : `${n}`)).join("");
  const mmddyyyy = [m, d, y].map((n) => (n < 10 ? `0${n}` : `${n}`)).join("");
  const mmddyy = [m, d, `${y}`.slice(0, 2)]
    .map((n) => (n < 10 ? `0${n}` : `${n}`))
    .join("");

  if (ddmmyyyy === stringReverse(ddmmyyyy))
    return { date, format: `dd-mm-yyyy` };
  if (mmddyyyy === stringReverse(mmddyyyy))
    return { date, format: `mm-dd-yyyy` };
  if (mmddyy === stringReverse(mmddyy)) return { date, format: `mm-dd-yy` };

  return { date, format: undefined };
};

/**
 * @param {Date} nextDate
 * @returns {Object}  {date:date, format: 'dd-mm-yy'}
 */
const lookForNextPallindromeDate = (date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 1);

  const dateObj = checkPallindrome(nextDate);
  if (dateObj.format) return dateObj;
  return lookForNextPallindromeDate(nextDate);
};

submitButton.addEventListener("click", async () => {
  invalid.style.display = "none";
  rAnswer.style.display = "none";
  wAnswer.style.display = "none";
  clock.style.display = "none";

  /** @type {Date} */
  const birthDate = dateSelector.valueAsDate;

  if (!birthDate) {
    invalid.style.display = "block";
    return;
  }

  const { format } = checkPallindrome(birthDate);
  clock.style.display = "flex";
  await new Promise((resolve) => setTimeout(resolve, 5000));
  clock.style.display = "none";

  if (format) {
    rAnswer.style.backgroundColor = "green";
    rAnswer.style.display = "flex";
    const text = document.getElementById("answer__text");
    text.innerText = format;
  } else {
    const dateObj = lookForNextPallindromeDate(birthDate);
    const diffTime = Math.abs(dateObj.date - birthDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    wAnswer.style.backgroundColor = "red";
    wAnswer.style.display = "flex";
    const textDate = document.getElementById("answer__date");
    textDate.innerText = dateObj.date.toDateString();
    const textDays = document.getElementById("answer__days");
    textDays.innerText = diffDays;
    const textFormat = document.getElementById("answer__format");
    textFormat.innerText = dateObj.format;
  }
});
