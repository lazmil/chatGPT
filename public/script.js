const startButton = document.getElementById('startButton');
let isRecording = false;

// Check if the browser supports the Web Speech API
if ('webkitSpeechRecognition' in window) {

  const recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = function (event) {
    // Handle the speech recognition result
    const result = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join(' ')
      .trim();
    displayListenedText(result); // Display the listened text
    sendToServer(result); // Send the spoken text to the server
  };

  recognition.onerror = function (event) {
    // Handle recognition errors
    console.error('Recognition error occurred: ' + event.error);
  };

  startButton.addEventListener('click', function () {
    // Start button click event listener
    if (!isRecording) {
      recognition.start();
      isRecording = true;
      startButton.textContent = 'Stop'; // Update the button text to "Stop"
    } else {
      recognition.stop();
      isRecording = false;
      stopSpeech(); // Stop the speech synthesis
      startButton.textContent = 'Start'; // Update the button text to "Start"
    }
  });
} else {
  console.error('Web Speech API is not supported in this browser.');
}

async function sendToServer(message) {
  // Send the spoken text to the server for processing
  const response = await fetch('https://part-l8zwtf580-lazmil.vercel.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (response.ok) {
    // If the server responds with a successful status
    const reply = await response.text();
    displayResponseText(reply); // Display the response text
    convertToSpeech(reply); // Convert the server's response to speech
  } else {
    console.error('Server request failed:', response.status);
  }
}

function displayListenedText(text) {
  // Display the listened text in the input field
  const messageInput = document.getElementById('messageInput');
  messageInput.value = text;
}

function displayResponseText(text) {
  // Display the response text in the response container
  const responseText = document.getElementById('responseText');
  responseText.textContent = text;
}

const speechSynthesis = window.speechSynthesis;
const utterance = new SpeechSynthesisUtterance();

function convertToSpeech(text) {
  // Convert the text to speech using speech synthesis
  stopSpeech(); // Stop any ongoing speech synthesis
  utterance.text = text; // Set the text to be spoken by the speech synthesis engine

  if (text.trim().length > 0) {
    // Set the voice for speech synthesis
    const voices = speechSynthesis.getVoices();
    const desiredVoice = voices[3];
    utterance.voice = desiredVoice; // Set the desired voice for speech synthesis

    utterance.onend = function () {
      // This callback is triggered when speech synthesis is complete
      startButton.textContent = 'Start'; // Change the button text back to "Start"
    };

    speechSynthesis.speak(utterance); // Speak the text using the modified utterance
  }
}

function stopSpeech() {
  // Stop any ongoing speech synthesis
  speechSynthesis.cancel();
}
