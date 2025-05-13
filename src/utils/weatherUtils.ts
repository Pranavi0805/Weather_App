import { TemperatureUnit } from '../types';

// Format temperature with unit
export function formatTemperature(temp: number, unit: TemperatureUnit): string {
  const roundedTemp = Math.round(temp);
  return `${roundedTemp}°${unit === 'metric' ? 'C' : 'F'}`;
}

// Format date to IST
export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',  // Force IST
  });
}

// Format time to IST
export function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',  // Force IST
  });
}

// Other utilities remain the same...

export function getWeatherColors(weatherId: number, isDaytime: boolean): {
  primary: string;
  secondary: string;
  text: string;
} {
  if (weatherId >= 200 && weatherId < 300) {
    return { primary: '#2c3e50', secondary: '#34495e', text: '#ecf0f1' };
  }
  if ((weatherId >= 300 && weatherId < 400) || (weatherId >= 500 && weatherId < 600)) {
    return { primary: '#3498db', secondary: '#2980b9', text: '#ecf0f1' };
  }
  if (weatherId >= 600 && weatherId < 700) {
    return { primary: '#ecf0f1', secondary: '#bdc3c7', text: '#2c3e50' };
  }
  if (weatherId >= 700 && weatherId < 800) {
    return { primary: '#95a5a6', secondary: '#7f8c8d', text: '#ecf0f1' };
  }
  if (weatherId === 800) {
    return isDaytime
      ? { primary: '#3498db', secondary: '#2ecc71', text: '#ecf0f1' }
      : { primary: '#2c3e50', secondary: '#34495e', text: '#ecf0f1' };
  }
  if (weatherId > 800) {
    return isDaytime
      ? { primary: '#95a5a6', secondary: '#7f8c8d', text: '#ecf0f1' }
      : { primary: '#34495e', secondary: '#2c3e50', text: '#ecf0f1' };
  }
  return { primary: '#3498db', secondary: '#2980b9', text: '#ecf0f1' };
}

export function isDaytime(currentTime: number, sunrise: number, sunset: number): boolean {
  return currentTime > sunrise && currentTime < sunset;
}

export function getWindDescription(speed: number, unit: TemperatureUnit): string {
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';
  return `${speed.toFixed(1)} ${speedUnit}`;
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}
