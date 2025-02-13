window.onload = () => triggerFunction();

let canvas = document.getElementById("canvas");
let text = "";

const randomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const textGenerator = () => {
  let generatedText = "";
  for (let i = 0; i < 3; i++) {
    generatedText += String.fromCharCode(randomNumber(65, 90)); // capital letters
    generatedText += String.fromCharCode(randomNumber(97, 122)); // small letters
    generatedText += String.fromCharCode(randomNumber(48, 57)); // digits
  }
  return generatedText;
};

function drawOnCanvas(string) {
  let context = canvas.getContext("2d");
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);

  const textColors = ["rgb(0,0,0)", "rgb(157, 156, 156)"];
  const letterSpace = 150 / string.length;
  for (let i = 0; i < string.length; i++) {
    const initialSpace = 25;
    context.font = "15px Arial";
    context.fillStyle = textColors[Math.round(Math.random())];
    context.fillText(
      string[i],
      initialSpace + i * letterSpace,
      randomNumber(25, 40),
      100
    );
  }
}

function triggerFunction() {
  text = textGenerator();
  console.log(text);
  drawOnCanvas(text);
}