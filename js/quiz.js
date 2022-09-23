const row1 = document.querySelector(".row1 ul");
const row2 = document.querySelector(".row2 ul");
class Quiz {

  constructor() { this.demo(); }
  demo() {

    this.numberOfWordsInLocalStorage = localStorage.getItem("number");
    this.currentPrograss = 0;
    this.currentNumberFetched = 0;
    this.startFetchNumber = 1;
    this.endFetchNumber = 11;

    if (this.numberOfWordsInLocalStorage < 10) {
      this.fetchData(1, this.numberOfWordsInLocalStorage);
    } else {
      this.fetchData(this.startFetchNumber, this.endFetchNumber);
    }
  }

  fetchData(Start, End) {
    if (this.numberOfWordsInLocalStorage == 0)
      return;
    this.removePrevousLists();
      let arrayOfDefinitions = [];
      let arrayOfWords = [];
    for (let i = Start; i <= End; i++) {
      const mainInfo = JSON.parse(localStorage.getItem(`word.${i}`));

      if (mainInfo && mainInfo.mainSentence && mainInfo.mainworld) {
          arrayOfWords.push({value:mainInfo.mainworld, currentNumbAttr:i})
          arrayOfDefinitions.push({value:mainInfo.mainSentence, currentNumbAttr:i})

      } else {
        this.endFetchNumber -= 1;
      }
    }
      if(arrayOfWords.length){
          arrayOfWords = this.shuffle(arrayOfWords)
          arrayOfDefinitions = this.shuffle(arrayOfDefinitions)

          for (let i = 0; i < arrayOfWords.length; i++) {
              const word = arrayOfWords[i];
              const  definition = arrayOfDefinitions[i];

              this.appendLiElment({
                  attributeNumber : word.currentNumbAttr,
                  text : word.value,
                  row : "row1",
              });

              this.appendLiElment({
                  attributeNumber : definition.currentNumbAttr,
                  text : definition.value,
                  row : "row2",
              });

          }
      }

    this.setEvents();
  }
  appendLiElment({attributeNumber = 0, text='', row=''}) {

    const Li = document.createElement("li");

    Li.setAttribute("number", attributeNumber.toString());
    Li.innerText = text;
    if (row == "row1") {
      row1.appendChild(Li);
    } else {
      row2.appendChild(Li);
    }
  }
  setEvents() {
    let ListsRow1 = document.querySelectorAll(".row1 ul li");
    let ListsRow2 = document.querySelectorAll(".row2 ul li");
    let clickedPreviously1;
    let clickedPreviously2;

    ListsRow1.forEach((element) => {
      element.addEventListener("click", () => {
        if (clickedPreviously1) {

          clickedPreviously1.classList.remove("choosed");
          clickedPreviously1 = element;
          clickedPreviously1.classList.add("choosed");
          this.checkWin(clickedPreviously1, clickedPreviously2, "row1");

          if (clickedPreviously2 && clickedPreviously1) {
            clickedPreviously1 = null;
            clickedPreviously2 = null;
          }

        } else {

          clickedPreviously1 = element;
          clickedPreviously1.classList.add("choosed");
          this.checkWin(clickedPreviously1, clickedPreviously2, "row1");
          if (clickedPreviously2 && clickedPreviously1) {
            clickedPreviously1 = null;
            clickedPreviously2 = null;
          }
        }
      });
    });
    ListsRow2.forEach((element) => {
      element.addEventListener("click", () => {
        if (clickedPreviously2) {
          clickedPreviously2.classList.remove("choosed");
          clickedPreviously2 = element;
          clickedPreviously2.classList.add("choosed");
          this.checkWin(clickedPreviously1, clickedPreviously2, "row2");
          if (clickedPreviously2 && clickedPreviously1) {
            clickedPreviously1 = null;
            clickedPreviously2 = null;
          }
        } else {
          clickedPreviously2 = element;
          clickedPreviously2.classList.add("choosed");
          this.checkWin(clickedPreviously1, clickedPreviously2, "row2");
          if (clickedPreviously2 && clickedPreviously1) {
            clickedPreviously1 = null;
            clickedPreviously2 = null;
          }
        }
      });
    });
  }
  checkWin(Li1, Li2, lastOnChoosed) {
    let LiChoosed1 = Li1.getAttribute("number");
    let LiChoosed2 = Li2.getAttribute("number");
    if (!LiChoosed2 && !LiChoosed2)
      return;
    if (LiChoosed1 == LiChoosed2) {
      Li1.classList.add("correct");
      Li2.classList.add("correct");
      this.currentPrograss += 1;
      setTimeout(() => {
        this.removeElement(Li1);
        this.removeElement(Li2);
        //        Li1.classList.remove("correct");
        //       Li2.classList.remove("correct");
      }, 1000);
      this.checkAndGoToNextStepIfTheUserPassedAllExams();
    }
    if (LiChoosed1 !== LiChoosed2) {
      if (lastOnChoosed === "row1") {
        Li1.classList.add("wrong");
        const correctNum = Li2.getAttribute("number");
        const correctLi =
            document.querySelector(`.row1 ul li[number="${correctNum}"]`);
        correctLi.classList.add("correct");
        setTimeout(() => {
          Li1.classList.remove("choosed");
          Li2.classList.remove("choosed");
          Li1.classList.remove("wrong");
          correctLi.classList.remove("correct");
        }, 1000);
      }
      if (lastOnChoosed == "row2") {
        Li2.classList.add("wrong");
        const correctNum = Li1.getAttribute("number");
        const correctLi =
            document.querySelector(`.row2 ul li[number="${correctNum}"]`);
        correctLi.classList.add("correct");
        setTimeout(() => {
          correctLi.classList.remove("correct");
          Li1.classList.remove("choosed");
          Li2.classList.remove("choosed");
          Li2.classList.remove("wrong");
        }, 1000);
      }
    }
  }
  checkAndGoToNextStepIfTheUserPassedAllExams() {
    if (this.currentPrograss == this.endFetchNumber) {
      this.startFetchNumber = this.endFetchNumber;
      this.endFetchNumber = this.currentPrograss + 10;
      if (this.endFetchNumber < this.numberOfWordsInLocalStorage) {
        this.fetchData(this.startFetchNumber, this.endFetchNumber);
      } else {
        alert("your quiz is done ");
      }
    }
  }
  removeElement(element) { element.remove(); }
  removePrevousLists() {
    document.querySelectorAll(".row1 li")
        .forEach((element) => element.remove());
    document.querySelectorAll(".row2 li")
        .forEach((element) => element.remove());
  }

shuffle(array) {
  var tmp, current, top = array.length;
  if(top) while(--top) {


    current = Math.floor(Math.random() * (top + 1));
    tmp = array[current];
    array[current] = array[top];
    array[top] = tmp;
  }
  return array;
}
}
const main = new Quiz();
