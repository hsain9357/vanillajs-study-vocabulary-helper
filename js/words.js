const containerWords = document.querySelector(".containerWords");
const fullInfoOfWord = document.querySelector(".fullInfoOfWord");
const wordFullInfoCloseBTN = document.querySelector(".wordFullInfoClose");
const repeatBtn = document.querySelector("button.repeatBtn");
const stopBtn = document.querySelector("button#stopBtn");
var shouldInteravl = false;
class allOprations {
  constructor() {
    // mybe you thought why i do that
    // the initialize function
    // release instenly when i use the class you can see it in the buttom of this script

    this.initialize();
  }
  initialize() {
    this.allEvets();
    this.fetchLocalStorage();
  }
  allEvets() {
    wordFullInfoCloseBTN.addEventListener("click", () => {
      fullInfoOfWord.classList.remove("active");
    });
    repeatBtn.onclick = () => {
      let timeToRepeat = prompt("speed per second", 5);
      if (!timeToRepeat) return;
      timeToRepeat = timeToRepeat * 1000;
      shouldInteravl = true;
      this.startRepeatSavedWords(timeToRepeat);
    };
    stopBtn.onclick = () => {
      this.clearPreviousDatafromFullInfoWord();
      stopBtn.classList.remove("active");
      wordFullInfoCloseBTN.classList.add("active");
      shouldInteravl = false;
    };
  }

  fetchLocalStorage() {
    // all of these make this
    // <div class="containerWordInfo">
    //   <div class="word">
    // the word sets here
    //     <div class="numberOfMeaning">1</div>
    //     <div class="sentence"> the main sentence sets here</div>
    //   </div>
    // </div>;

    this.theNumberOfWords = parseInt(localStorage.getItem("number"));
    if(!this.theNumberOfWords) {
      containerWords.append('Empty!')
    }
    for (let i = this.theNumberOfWords; i >= 1; i--) {
      let mainInfo = JSON.parse(localStorage.getItem(`word.${i}`));

      const containerWordInfo = document.createElement("div");
      containerWordInfo.setAttribute("number", `${i}`);
      containerWordInfo.style.border = `6px solid #${mainInfo.randomColor}`;
      containerWordInfo.className = "containerWordInfo";
      const word = document.createElement("div");
      word.className = "word";
      word.innerText = mainInfo.mainworld;

      const numberOfMeaning = document.createElement("numberOfMeaning");
      numberOfMeaning.className = "numberOfMeaning";
      if (mainInfo.numberOfMeaninig === 0) {
      } else {
        numberOfMeaning.innerText = mainInfo.numberOfMeaninig;
      }
      word.appendChild(numberOfMeaning);

      const sentence = document.createElement("div");
      sentence.className = "sentence";
      sentence.innerText = mainInfo.mainSentence;
      containerWordInfo.appendChild(word);

      containerWordInfo.appendChild(sentence);
      containerWords.appendChild(containerWordInfo);

      // this function  'openFullInfoAboutTheWord ' make the pop-up
      //  show all info about the word
      // like the phonemes and all the others meaning of it

      this.openFullInfoAboutTheWord(containerWordInfo);
    }
  }
  openFullInfoAboutTheWord(element) {
    // it's seme complex but its work is simple just fetch
    // the localStorage and put data the container of it
    // i already put style to the container you can find it
    // in word.css named .fullInfoOfWord .
    element.addEventListener("click", () => {
      this.clearPreviousDatafromFullInfoWord();
      const numberElement = parseInt(element.getAttribute("number"));
      this.appendFullInfoFun(numberElement,false,true,true);
    });
  }

  appendFullInfoFun(numberElement, shouldPlayAudio = false,shouldAppendPlayButton = true,shouldMakeCloseButtonVisable=false) {
    const mainword = document.querySelector(".mainword");
    const phonemes = document.querySelector(".phonemes");
    const mainSentence = document.querySelector(".mainSentence");

    const mainInfo = JSON.parse(localStorage.getItem(`word.${numberElement}`));
    mainword.innerText = mainInfo.mainworld;
    if (mainInfo.phoneme) {
      phonemes.innerText = "phonetics :" + mainInfo.phoneme;
    }
    fullInfoOfWord.style.background = `#${mainInfo.randomColor}`;
    mainSentence.innerText = mainInfo.mainSentence;
    if (mainInfo.audio) {
      const audio = document.createElement("audio");

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
          wordFullInfoCloseBTN.classList.add('active')  
        }
        fullInfoOfWord.appendChild(hearIt);
      }
      
    }

    if (mainInfo.pic) {
      const newImg = document.createElement("img");
      newImg.src = mainInfo.pic;
      newImg.className = "img";
      fullInfoOfWord.appendChild(newImg);
    }

    if (mainInfo.numberOfMeaninig) {
      mainInfo.anotherSentenceWithNewMeaning.forEach((item) => {
        const anotherSentenceElement = document.createElement("div");
        anotherSentenceElement.className = "anotherSentences";
        anotherSentenceElement.innerText = item;
        fullInfoOfWord.appendChild(anotherSentenceElement);
      });
    }
    
    fullInfoOfWord.classList.add("active");
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

    var currentNumberToFetch = 1;

    const interavlOprations = () => {
      if (!shouldInteravl) {
        clearInterval(repeatIntervalFun);
        stopBtn.classList.remove("active");
        currentNumberToFetch = 1;
        return;
      }

      this.clearPreviousDatafromFullInfoWord();

      this.appendFullInfoFun(currentNumberToFetch, true,false);
      if (currentNumberToFetch == this.theNumberOfWords) {
        currentNumberToFetch = 1;
      } else {
        currentNumberToFetch += 1;
      }
    };
    stopBtn.classList.add("active");
    wordFullInfoCloseBTN.classList.remove("active");
    repeatIntervalFun = setInterval(interavlOprations, timeToRepeat);
  }
}
let APP = new allOprations();
