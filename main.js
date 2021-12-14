// PROCESS:
// 1. assign the Web Speech API to a var
// 2. assign dom elements to vars
// 3. fetch array of voices available to this browser/os
// 4. create function getVoices to build the array as a range of options within select list
// 5. event: if voices change, call getVoices
// 6. create function speak;
// 7. add conditions: if already speaking, leave function; if textarea is NOT an empty string "", then proceed.
// 8. assign the new SpeechSynthesisUtterance object, containing inputText.value, to var speakText.
// 9. event listeners for finishing speaking or error in speaking.
// 10. assign voice selected from array by index and data-attribute to selectedVoice.
// 11. assign voice property to speakText (SpeechSynthesisUtterance object) by loop through voices array to find the matching voice by voice.name==="data-name"
// 12. set pitch and rate
// 13. now call synth (speechSynthesis) method speak and pass in the speakText (SpeechSynthesisUtterance) with all its properties set.
// 14. Set Event Listeners for: 
//      - text form submit; change to rate; change to pitch; change to voice selected.

// ==============================================

// quite a boggly project, but got through it.
// not using images, including wavy.gif, so commented those bits out but they're still there if I want to try again.



// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = `${voice.name} (${voice.lang})`
    
    // voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    // // Add background animation
    // body.style.background = '#141414 url(img/wave.gif)';
    // body.style.backgroundRepeat = 'repeat-x';
    // body.style.backgroundSize = '100% 100%';

    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // Speak end
    speakText.onend = e => {
      console.log('Done speaking...');
    //   body.style.background = '#141414';
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };

    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set pitch and rate
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;
    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textInput.blur();
});

// Rate value change
rate.addEventListener('change', e => (rateValue.textContent = rate.value));

// Pitch value change
pitch.addEventListener('change', e => (pitchValue.textContent = pitch.value));

// Voice select change
voiceSelect.addEventListener('change', e => speak());
