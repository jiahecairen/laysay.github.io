document.addEventListener('DOMContentLoaded', function () {
  const textTransitionElement = document.getElementById('darkToggle');
  const textList = ['🌔', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓'];
  let currentIndex = 0;
  let isAnimating = false;

  function updateMoon() {
    currentIndex = (currentIndex + 1) % textList.length;
    textTransitionElement.textContent = textList[currentIndex];
    setTimeout(updateMoon, 1500); // 将 setInterval 改为 setTimeout，以达到 1500 毫秒的间隔
  }

  // 添加月亮字符变换的动画
  updateMoon();

  const darkToggle = document.getElementById('darkToggle');
  const body = document.body;

  // 检查 Cookie 中的 dark 模式设置
  const isDark = getCookie('dark') === 'enabled';

  // 根据用户之前的选择设置初始模式
  if (isDark) {
    // 添加黑暗模式样式
    body.classList.add('dark-mode');
  }

  // 在点击按钮切换模式时
  darkToggle.addEventListener('click', () => {
    if (!isAnimating) {
      isAnimating = true;

      // 切换模式
      body.classList.toggle('dark-mode');

      // 更新 Cookie 中的设置
      const expirationDate = new Date();
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
      document.cookie = `dark=${body.classList.contains('dark-mode') ? 'enabled' : 'disabled'}; expires=${expirationDate.toUTCString()}; path=/`;

      // 增加延时，确保动画执行完毕后再重置状态
      setTimeout(() => {
        isAnimating = false;
      }, 500); // 保留原有的延时时间
    }
  });

  // 检测页面加载状态
  window.addEventListener('load', () => {
    body.style.visibility = 'visible';
  });

  // 从 Cookie 中获取值的辅助函数
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
});
