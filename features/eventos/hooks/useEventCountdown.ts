import * as React from "react";

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
  isMounted: boolean;
}

export function parseTargetDate(
  fecha: Date | string | null | undefined,
  horaInicio?: string,
): Date {
  if (!fecha) return new Date();

  let year: number;
  let month: number;
  let day: number;

  if (fecha instanceof Date) {
    if (isNaN(fecha.getTime())) return new Date();
    year = fecha.getUTCFullYear();
    month = fecha.getUTCMonth();
    day = fecha.getUTCDate();
  } else {
    const str = String(fecha);
    const datePart = str.split("T")[0];
    const parts = datePart.split("-").map((p) => parseInt(p, 10));
    if (parts.length === 3 && !parts.some(isNaN)) {
      year = parts[0];
      month = parts[1] - 1;
      day = parts[2];
    } else {
      const d = new Date(fecha);
      if (isNaN(d.getTime())) return new Date();
      year = d.getUTCFullYear();
      month = d.getUTCMonth();
      day = d.getUTCDate();
    }
  }

  let hours = 20;
  let minutes = 0;

  if (horaInicio) {
    const match = horaInicio.match(/(\d{1,2}):(\d{2})/);
    if (match) {
      const parsedHours = parseInt(match[1], 10);
      const parsedMinutes = parseInt(match[2], 10);
      if (!isNaN(parsedHours) && parsedHours >= 0 && parsedHours < 24) {
        hours = parsedHours;
      }
      if (!isNaN(parsedMinutes) && parsedMinutes >= 0 && parsedMinutes < 60) {
        minutes = parsedMinutes;
      }
    }
  }

  const targetUTC = Date.UTC(year, month, day, hours, minutes, 0, 0);
  const targetTimeMs = targetUTC + 3 * 60 * 60 * 1000;
  return new Date(targetTimeMs);
}

function pad(num: number): string {
  return String(Math.max(0, num)).padStart(2, "0");
}

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useEventCountdown(
  fecha: Date | string | null | undefined,
  horaInicio?: string,
): CountdownResult {
  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const targetDate = React.useMemo(
    () => parseTargetDate(fecha, horaInicio),
    [fecha, horaInicio],
  );

  const diffMs = targetDate.getTime() - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      formatted: "00D : 00H : 00M : 00S",
      isMounted,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${pad(days)}D : ${pad(hours)}H : ${pad(minutes)}M : ${pad(seconds)}S`;

  return {
    days,
    hours,
    minutes,
    seconds,
    isExpired: false,
    formatted,
    isMounted,
  };
}
