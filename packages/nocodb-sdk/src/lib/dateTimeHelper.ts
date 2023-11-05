import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import duration from 'dayjs/plugin/duration.js';
import utc from 'dayjs/plugin/utc.js';
import weekday from 'dayjs/plugin/weekday.js';
import timezone from 'dayjs/plugin/timezone.js';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(timezone);

export const dateMonthFormats = ['YYYY-MM', 'YYYY MM'];

export const timeFormats = ['HH:mm', 'HH:mm:ss', 'HH:mm:ss.SSS'];

export const dateFormats = [
  'DD-MM-YYYY',
  'MM-DD-YYYY',
  'YYYY-MM-DD',
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY/MM/DD',
  'DD MM YYYY',
  'MM DD YYYY',
  'YYYY MM DD',
  ...dateMonthFormats,
];

export const isDateMonthFormat = (format: string) =>
  dateMonthFormats.includes(format);

export function validateDateWithUnknownFormat(v: string) {
  for (const format of dateFormats) {
    if (dayjs(v, format, true).isValid() as any) {
      return true;
    }
    for (const timeFormat of timeFormats) {
      if (dayjs(v, `${format} ${timeFormat}`, true).isValid() as any) {
        return true;
      }
    }
  }
  return false;
}

export function getDateFormat(v: string) {
  for (const format of dateFormats) {
    if (dayjs(v, format, true).isValid()) {
      return format;
    }
  }
  return 'YYYY/MM/DD';
}

export function getDateTimeFormat(v: string) {
  for (const format of dateFormats) {
    for (const timeFormat of timeFormats) {
      const dateTimeFormat = `${format} ${timeFormat}`;
      if (dayjs(v, dateTimeFormat, true).isValid() as any) {
        return dateTimeFormat;
      }
    }
  }
  return 'YYYY/MM/DD';
}

export function parseStringDate(v: string, dateFormat: string) {
  const dayjsObj = dayjs(v);
  if (dayjsObj.isValid()) {
    v = dayjsObj.format('YYYY-MM-DD');
  } else {
    v = dayjs(v, dateFormat).format('YYYY-MM-DD');
  }
  return v;
}

export function convertToTargetFormat(
  v: string,
  oldDataFormat,
  newDateFormat: string
) {
  if (
    !dateFormats.includes(oldDataFormat) ||
    !dateFormats.includes(newDateFormat)
  )
    return v;
  return dayjs(v, oldDataFormat).format(newDateFormat);
}

export const handleTZ = (val: any) => {
  if (val === undefined || val === null) {
    return;
  }
  if (typeof val !== 'string') {
    return val;
  }
  return val.replace(
    /((?:-?(?:[1-9][0-9]*)?[0-9]{4})-(?:1[0-2]|0[1-9])-(?:3[01]|0[1-9]|[12][0-9])T(?:2[0-3]|[01][0-9]):(?:[0-5][0-9]):(?:[0-5][0-9])(?:\.[0-9]+)?(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9]))/g,
    (_, v) => {
      return dayjs(v).format('YYYY-MM-DD HH:mm');
    }
  );
};

export function validateDateFormat(v: string) {
  return dateFormats.includes(v);
}
