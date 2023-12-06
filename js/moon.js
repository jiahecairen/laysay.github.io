document.addEventListener('DOMContentLoaded', function () {
  const textTransitionElement = document.getElementById('textTransition');
  const textList = ['🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔']; 
  let currentIndex = 0;

  setInterval(() => {
    currentIndex = (currentIndex + 1) % textList.length;
    textTransitionElement.style.opacity = 0;

    setTimeout(() => {
      textTransitionElement.textContent = textList[currentIndex];
      textTransitionElement.style.opacity = 1;
    }, 500);
  }, 1000);
});