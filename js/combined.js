document.addEventListener('DOMContentLoaded', function () {
    const textTransitionElement = document.getElementById('darkToggle');
    const textList = ['🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓'];
    let currentIndex = 0;
  
    const moonInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % textList.length;
      textTransitionElement.textContent = textList[currentIndex];
    }, 700);
  
    const darkToggle = document.getElementById('darkToggle');
    const body = document.body;
  
    // 检查 localStorage 中的 dark 模式设置
    const isDark = localStorage.getItem('dark') === 'enabled';
  
    // 根据用户之前的选择设置初始模式
    if (isDark) {
      body.classList.add('dark-mode');
    }
  
    // 点击按钮切换模式
    darkToggle.addEventListener('click', () => {
      // 切换模式
      body.classList.toggle('dark-mode');
  
      // 更新 localStorage 中的设置
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('dark', 'enabled');
      } else {
        localStorage.setItem('dark', 'disabled');
      }
    });
  
    // 在点击链接时清除月亮变换的间隔
    /*
    darkToggle.addEventListener('click', () => {
      clearInterval(moonInterval);
    }
    );
    */
  });
  