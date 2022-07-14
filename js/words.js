const containerWords = document.querySelector(".containerWords");
const fullInfoOfWord = document.querySelector(".fullInfoOfWord");
const wordFullInfoCloseBTN = document.querySelector(".wordFullInfoClose");
const repeatBtn = document.querySelector("button.repeatBtn");
const stopBtn = document.querySelector("button#stopBtn");
const pauseBtn = document.querySelector("button.pauseBtn ");
const categoriesContainer = document.querySelector(".categoriesContainer");
const bakcArrowButton = document.querySelector(".bakcArrowButton");
//localStorage.setItem('number','121')
//localStorage.removeItem('word.122')
class allOprations {
  constructor() {
    // mybe you thought why i do that
    // the initialize function
    // release instenly when i use the class you can see it in the buttom of this script
    this.shouldInterval = false;
    this.numbersForInterval = [];
    this.currentNumberToFetch = 0;
    this.currentCategory = undefined;
    this.initialize();
  }
  initialize() {
    const categoriesInLocalStorage = JSON.parse(
      localStorage.getItem("listCategories")
    );
    this.createCategory("word");
    if (categoriesInLocalStorage) {
      categoriesInLocalStorage.forEach((item) => {
        this.createCategory(item);
      });
    }
    this.allEvets();
  }
  createCategory(nameOfCategory) {
    const categoryDiv = document.createElement("div");
    const pElement = document.createElement("p");
    const imgForCategory = document.createElement("img");
    categoryDiv.className = "category";
    categoryDiv.setAttribute("category", nameOfCategory);
    pElement.className = "categoryName";
    pElement.innerText = nameOfCategory;
    imgForCategory.src = "/imgs/file.png";
    imgForCategory.className = "categoryImg ";
	  if(nameOfCategory == 'word'){
		  pElement.innerText = 'general'
	  }
    categoryDiv.append(imgForCategory, pElement);
    categoriesContainer.append(categoryDiv);
    const allCategoriesElements = document.querySelectorAll(".category");
    allCategoriesElements.forEach((item) => {
      item.addEventListener("click", () => {
        const clickedCategory = item.getAttribute("category");
        if (clickedCategory === "word") {
          // number in localStorage means unclassified (the user didn't specify it in a category)
          bakcArrowButton.classList.add("active");
          categoriesContainer.classList.remove("active");
          const numberOfWordToFetch = parseInt(localStorage.getItem("number"));
          this.fetchLocalStorage(clickedCategory, numberOfWordToFetch);
        } else {
          bakcArrowButton.classList.add("active");
          categoriesContainer.classList.remove("active");
          const numberOfWordToFetch = parseInt(
            localStorage.getItem(`numberOf.${clickedCategory}`)
          );
          this.fetchLocalStorage(clickedCategory, numberOfWordToFetch);
        }
      });
    });
  }

  allEvets() {
    wordFullInfoCloseBTN.addEventListener("click", () => {
      fullInfoOfWord.classList.remove("active");
      bakcArrowButton.classList.add("active");
    });
    repeatBtn.onclick = () => {
      let timeToRepeat = prompt("speed per second", 5);
      if (!timeToRepeat) return;
      timeToRepeat = timeToRepeat * 1000;
      this.shouldInterval = true;
      this.startRepeatSavedWords(timeToRepeat);
    };
    stopBtn.onclick = () => {
      this.clearPreviousDatafromFullInfoWord();
      stopBtn.classList.remove("active");
      wordFullInfoCloseBTN.classList.add("active");
      this.shouldInterval = false;
    };
    pauseBtn.onclick = () => {
      this.togglePause();
    };
    bakcArrowButton.onclick = () => {
      bakcArrowButton.classList.remove("active");
      categoriesContainer.classList.add("active");
    };
  }

  fetchLocalStorage(category, numberOfWordToFetch) {
    // all of these make this
    // <div class="containerWordInfo">
    //   <div class="word">
    // the word sets here
    //     <div class="numberOfMeaning">1</div>
    //     <div class="sentence"> the main sentence sets here</div>
    //   </div>
    // </div>;

    this.currentCategory = category;
    document
      .querySelectorAll(".containerWordInfo")
      .forEach((item) => item.remove());
    if (!numberOfWordToFetch) {
      containerWords.append("Empty!");
    }
    for (let i = numberOfWordToFetch; i >= 1; i--) {
      let mainInfo = JSON.parse(localStorage.getItem(`${category}.${i}`));

      const containerWordInfo = document.createElement("div");
      containerWordInfo.setAttribute("number", `${i}`);
      if (mainInfo.randomColor.length == 5) {
        containerWordInfo.style.border = `6px solid #${mainInfo.randomColor}1`;
      } else {
        containerWordInfo.style.border = `6px solid #${mainInfo.randomColor}`;
      }

      containerWordInfo.className = "containerWordInfo";
      const word = document.createElement("div");
      word.className = "word";
      word.innerText = mainInfo.mainworld;

      const numberOfMeaning = document.createElement("numberOfMeaning");
      numberOfMeaning.className = "numberOfMeaning";
      // changed the number of meaning to the number of current word
      if (mainInfo.numberOfMeaninig === 0) {
        numberOfMeaning.innerText = i;
      } else {
        numberOfMeaning.innerText = i;
      }
      word.appendChild(numberOfMeaning);

      const sentence = document.createElement("div");
      sentence.className = "sentence";
      sentence.innerText = mainInfo.mainSentence;
      containerWordInfo.appendChild(word);

      containerWordInfo.appendChild(sentence);
      containerWords.appendChild(containerWordInfo);
      const wordTime = new Date(mainInfo.date);
      const currentDate = new Date();
      const difference = Math.floor(
        (currentDate.getTime() - wordTime.getTime()) / 86400000
      );

      switch (difference) {
        case 0:
          this.numbersForInterval.push(i);
          break;
        case 1:
          this.numbersForInterval.push(i);
          break;

        case 7:
          this.numbersForInterval.push(i);
          break;

        case 30:
          this.numbersForInterval.push(i);
          break;

        default:
        //  containerWordInfo.style.display = "none";
         this.numbersForInterval.push(i);
          break;
      }
      // // this function  'openFullInfoAboutTheWord ' make the pop-up
      //  show all info about the word
      // like the phonemes and all the others meaning of it

      this.openFullInfoAboutTheWord(containerWordInfo, category);
    }
  }
  openFullInfoAboutTheWord(element, category) {
    // it's seme complex but its work is simple just fetch
    // the localStorage and put data the container of it
    // i already put style to the container you can find it
    // in word.css named .fullInfoOfWord .
    element.addEventListener("click", () => {
      this.clearPreviousDatafromFullInfoWord();
      const numberElement = parseInt(element.getAttribute("number"));
      this.appendFullInfoFun(numberElement, false, true, true, category);
    });
  }

  appendFullInfoFun(
    numberElement,
    shouldPlayAudio = false,
    shouldAppendPlayButton = true,
    shouldMakeCloseButtonVisable = false,
    category = "word"
  ) {
    const mainword = document.querySelector(".mainword");
    const phonemes = document.querySelector(".phonemes");
    const mainSentence = document.querySelector(".mainSentence");
    bakcArrowButton.className = "bakcArrowButton";
    const mainInfo = JSON.parse(
      localStorage.getItem(`${category}.${numberElement}`)
    );
    if (mainInfo && mainInfo.mainworld) {
      mainword.innerText = mainInfo.mainworld;
    }

    if (mainInfo && mainInfo.phoneme) {
      phonemes.innerText = "phonetics :" + mainInfo.phoneme;
    }
    if (mainInfo && mainInfo.randomColor) {
      if (mainInfo.randomColor.length == 5) {
        fullInfoOfWord.style.background = `#${mainInfo.randomColor}1`;
      } else {
        fullInfoOfWord.style.background = `#${mainInfo.randomColor}`;
      }
    }
    if (mainInfo && mainInfo.mainSentence) {
      mainSentence.innerText = mainInfo.mainSentence;
    }

    if (mainInfo && mainInfo.audio) {
      const audio = document.createElement("audio");
      audio.loop = false;
      audio.src = mainInfo.audio;
      if (shouldPlayAudio) {
        audio.play();
      }
      if (shouldAppendPlayButton) {
        const hearIt = document.createElement("button");
        const styleHearIt = hearIt.style;
        styleHearIt.width = "50px";
        styleHearIt.height = "50px";

        hearIt.innerHTML = "&#9654;";
        hearIt.className = "hearIt";
        hearIt.onclick = () => {
          audio.play();
        };
        if (shouldMakeCloseButtonVisable) {
          wordFullInfoCloseBTN.classList.add("active");
        }
        fullInfoOfWord.appendChild(hearIt);
      }
    }

    if (mainInfo && mainInfo.pic) {
      const newImg = document.createElement("img");
      newImg.src = mainInfo.pic;
      newImg.className = "img";
      fullInfoOfWord.appendChild(newImg);
    }

    if (mainInfo && mainInfo.numberOfMeaninig) {
      mainInfo.anotherSentenceWithNewMeaning.forEach((item) => {
        const anotherSentenceElement = document.createElement("div");
        anotherSentenceElement.className = "anotherSentences";
        anotherSentenceElement.innerText = item;
        fullInfoOfWord.appendChild(anotherSentenceElement);
      });
    }

    fullInfoOfWord.classList.add("active");
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      pauseBtn.innerText = "continue";
    } else {
      pauseBtn.innerText = "pause";
    }
  }
  // this clear the img and others stuff from
  // the pop-up ".fullInfoOfWord" that i told you about it recently
  // or if you didn't read it you can check it out above
  clearPreviousDatafromFullInfoWord() {
    const img = document.querySelector(".fullInfoOfWord .img");
    const audioToRemove = document.querySelector(".hearIt");

    if (audioToRemove) audioToRemove.remove();
    const anotherSentences = document.querySelectorAll(
      ".fullInfoOfWord .anotherSentences"
    );
    if (img) img.remove();
    if (anotherSentences) {
      anotherSentences.forEach((item) => {
        item.remove();
      });
    }
    document.querySelector(".mainword").innerText = "";
    document.querySelector(".phonemes").innerText = "";
    document.querySelector(".mainSentence").innerText = "";
    fullInfoOfWord.classList.remove("active");
  }
  startRepeatSavedWords(timeToRepeat) {
    let repeatIntervalFun = null;

    const interavlOprations = () => {
      if (!this.isPaused) {
        if (!this.shouldInterval) {
          this.clearPreviousDatafromFullInfoWord();
          this.numbersForInterval.reverse();
          stopBtn.classList.remove("active");
          pauseBtn.classList.remove("active");
          wordFullInfoCloseBTN.classList.add("active");
          this.currentNumberToFetch = 0;
          clearInterval(repeatIntervalFun);
	bakcArrowButton.className = 'bakcArrowButton active' 
          return;
        }

        this.clearPreviousDatafromFullInfoWord();

        this.appendFullInfoFun(
          this.numbersForInterval[this.currentNumberToFetch],
          true,
          false,
          true,
          this.currentCategory
        );
        if (this.currentNumberToFetch == this.numbersForInterval.length) {
          this.currentNumberToFetch = 0;
          this.clearPreviousDatafromFullInfoWord();
          pauseBtn.classList.remove("active");
          wordFullInfoCloseBTN.classList.add("active");
          this.shouldInterval = false;
        } else {
          this.currentNumberToFetch += 1;
        }
      }
    };
    this.numbersForInterval.reverse();
    stopBtn.classList.add("active");
    pauseBtn.classList.add("active");
    wordFullInfoCloseBTN.classList.remove("active");
    this.clearPreviousDatafromFullInfoWord();
    this.appendFullInfoFun(
      this.numbersForInterval[this.currentNumberToFetch],
      true,
      false,
      true,
      this.currentCategory
    );
    this.currentNumberToFetch = 1;
    repeatIntervalFun = setInterval(interavlOprations, timeToRepeat);
  }
}
let APP = new allOprations();
