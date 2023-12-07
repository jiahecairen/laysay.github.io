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