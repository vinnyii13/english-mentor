// English Mentor - main script with voice (SpeechSynthesis) and guided lessons
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

let step = 0;
let userName = "";

// Safety: check speech support
const hasSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

// voice selection helper
let selectedVoice = null;
function loadVoices(){
  const voices = speechSynthesis.getVoices();
  if (voices.length === 0) return;
  // prefer english female voices, fallback to first en-US or first available
  selectedVoice = voices.find(v => /en-?us|english/i.test(v.lang) && /female|woman|female/i.test(v.name)) 
    || voices.find(v => /en-?us|english/i.test(v.lang)) 
    || voices[0];
}
if(hasSpeech){
  // some browsers load voices asynchronously
  speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

function speak(text){
  if(!hasSpeech) return;
  const ut = new SpeechSynthesisUtterance(text);
  ut.lang = "en-US";
  ut.rate = 0.98;
  ut.pitch = 1.05;
  if(selectedVoice) ut.voice = selectedVoice;
  speechSynthesis.cancel(); // avoid overlap
  speechSynthesis.speak(ut);
}

function addMessage(sender, text){
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight - chatBox.clientHeight + 100;
  if(sender === 'bot') speak(text);
}

function botTalk(text, delay = 700){
  setTimeout(()=> addMessage('bot', text), delay);
}

// initial
botTalk("👋 Hi! I'm Emma, your English Mentor. I will help you learn basic English step by step.");
botTalk("First, what's your name?");

// event
sendBtn.addEventListener("click", onSend);
userInput.addEventListener("keydown", (e) => { if(e.key === 'Enter') onSend(); });

function onSend(){
  const raw = userInput.value.trim();
  if(!raw) return;
  addMessage('user', raw);
  userInput.value = '';
  setTimeout(()=> handleConversation(raw), 450);
}

function handleConversation(text){
  const input = text.toLowerCase();
  switch(step){
    case 0:
      userName = capitalize(text);
      botTalk(`Nice to meet you, ${userName}! 😊`);
      botTalk("Lesson 1 — Greetings. How do you say 'Olá' in English?");
      step = 1;
      break;
    case 1:
      if(input.includes("hello") || input.includes("hi")){
        botTalk("✅ Correct! 'Olá' = 'Hello' or 'Hi'.");
        botTalk("Lesson 2 — How are you? How do you ask 'Como você está?' in English?");
        step = 2;
      } else {
        botTalk("🤔 Not quite. Try 'Hello' or 'Hi'. You can say 'Hello' to greet someone.");
      }
      break;
    case 2:
      if(input.includes("how are you") || input.includes("how r you")){
        botTalk("✅ Perfect! 'How are you?' = 'Como você está?'.");
        botTalk("Lesson 3 — Introductions. How do you say 'Meu nome é ...' in English?");
        step = 3;
      } else {
        botTalk("❌ Try again: it usually starts with 'How...'");
      }
      break;
    case 3:
      if(input.startsWith("my name is") || input.startsWith("i am")){
        botTalk("✅ Great! That's a correct introduction.");
        botTalk("Lesson 4 — Numbers. What is 'Cinco' in English?");
        step = 4;
      } else {
        botTalk("💡 Hint: start with 'My name is ...' or 'I am ...'");
      }
      break;
    case 4:
      if(input.includes("five") || input.includes("5")){
        botTalk("✅ Right! 'Cinco' = 'Five'.");
        botTalk("Lesson 5 — Colors. How do you say 'Vermelho' in English?");
        step = 5;
      } else {
        botTalk("❌ Not yet. 'Cinco' is a number between four and six.");
      }
      break;
    case 5:
      if(input.includes("red")){
        botTalk("✅ Correct! 'Vermelho' = 'Red'.");
        botTalk("Lesson 6 — Objects. Translate 'Livro' to English.");
        step = 6;
      } else {
        botTalk("💡 Hint: it's a color that often means 'stop'.");
      }
      break;
    case 6:
      if(input.includes("book")){
        botTalk("✅ Well done! 'Livro' = 'Book'.");
        botTalk("Lesson 7 — Animals. What is 'Cachorro' in English?");
        step = 7;
      } else {
        botTalk("❌ Try again. 'Livro' is something you read.");
      }
      break;
    case 7:
      if(input.includes("dog") || input.includes("doggy")){
        botTalk("✅ Nice! 'Cachorro' = 'Dog'.");
        botTalk("Lesson 8 — Food. Translate 'Maçã' to English.");
        step = 8;
      } else {
        botTalk("💡 Hint: it's man's best friend.");
      }
      break;
    case 8:
      if(input.includes("apple")){
        botTalk("✅ Excellent! 'Maçã' = 'Apple'.");
        botTalk("🎉 You've completed the Basic Module! Would you like a short quiz to practice? (yes/no)");
        step = 9;
      } else {
        botTalk("❌ Try again. It's a common fruit, often red or green.");
      }
      break;
    case 9:
      if(input.includes("yes")){
        startQuiz();
        step = 100; // in quiz mode
      } else {
        botTalk("No problem! You can practice later. Keep studying, and come back anytime. 😊");
        step = 10;
      }
      break;
    default:
      botTalk("If you want to restart the lesson, type 'restart'.");
      if(input.includes("restart")) { step = 0; botTalk("Restarting... What's your name?"); }
      break;
  }
}

function startQuiz(){
  botTalk("📝 Quick Quiz — 5 short questions. I'll ask, you answer in English.");
  const quiz = [
    { q: "How do you say 'Olá'?", a: "hello" },
    { q: "How do you ask 'Como você está'?", a: "how are you" },
    { q: "Translate: 'Cinco'", a: "five" },
    { q: "Translate: 'Vermelho'", a: "red" },
    { q: "Translate: 'Maçã'", a: "apple" }
  ];
  let idx = 0;
  let score = 0;

  function ask(){
    if(idx >= quiz.length){
      botTalk(`Quiz finished! Your score: ${score}/${quiz.length}. Great job, ${userName}!`);
      botTalk("Type 'restart' to try again or 'exit' to finish.");
      return;
    }
    botTalk(`Q${idx+1}: ${quiz[idx].q}`);
    // wait for user's answer
    const handler = (e) => {
      if(e.key === 'Enter'){
        const resp = userInput.value.trim().toLowerCase();
        if(!resp) return;
        addMessage('user', userInput.value.trim());
        userInput.value = '';
        if(resp.includes(quiz[idx].a)) { score++; botTalk("✅ Correct!"); }
        else { botTalk(`❌ Not quite. Correct answer: ${quiz[idx].a}`); }
        idx++;
        document.removeEventListener('keydown', handler);
        setTimeout(ask, 700);
      }
    };
    document.addEventListener('keydown', handler);
  }
  // start asking after short delay
  setTimeout(ask, 700);
}

function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }
