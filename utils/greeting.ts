// utils/greeting.ts

export function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 9) {
    return { text: '早上好', emoji: '🌅' };
  } else if (hour >= 9 && hour < 12) {
    return { text: '上午好', emoji: '☀️' };
  } else if (hour >= 12 && hour < 14) {
    return { text: '中午好', emoji: '🌤️' };
  } else if (hour >= 14 && hour < 18) {
    return { text: '下午好', emoji: '🌇' };
  } else if (hour >= 18 && hour < 22) {
    return { text: '晚上好', emoji: '🌙' };
  } else {
    return { text: '夜深了', emoji: '🌛' };
  }
}

export function getEncouragement(): string {
  const phrases = [
    '今天也要加油哦 💪',
    '坚持就是胜利 🎯',
    '每一天都是新的开始 🌟',
    '你比昨天更好了 ✨',
    '保持热爱，奔赴山海 🏔️',
    '今日事今日毕 📋',
    '优秀是一种习惯 🏆',
    '一步一个脚印 👣',
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}
