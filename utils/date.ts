// utils/date.ts

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import isToday from 'dayjs/plugin/isToday';

dayjs.extend(isToday);
dayjs.locale('zh-cn');

export function formatDate(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getWeekDates(centerDate: Date = new Date()): Date[] {
  const dates: Date[] = [];
  const center = dayjs(centerDate);

  for (let i = -3; i <= 3; i++) {
    dates.push(center.add(i, 'day').toDate());
  }

  return dates;
}

export function getWeekDayLabel(date: Date): string {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[date.getDay()];
}

export function getDayNumber(date: Date): number {
  return date.getDate();
}

export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  return dayjs(date1).format('YYYY-MM-DD') === dayjs(date2).format('YYYY-MM-DD');
}

export function isDateToday(date: Date | string): boolean {
  return dayjs(date).isToday();
}

export function getFormattedHeader(date: Date): string {
  return dayjs(date).format('M月D日 dddd');
}
