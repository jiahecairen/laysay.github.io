document.addEventListener('DOMContentLoaded', function () {
  const textTransitionElement = document.getElementById('textTransition');
  const textList = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔']; 
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % textList.length;
    textTransitionElement.textContent = textList[currentIndex];
  }, 1000);
});