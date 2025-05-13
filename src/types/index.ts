export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherData {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WindData {
  speed: number;
  deg: number;
}

export interface SysData {
  country: string;
  sunrise: number;
  sunset: number;
}

export interface CurrentWeatherData {
  coord: Coordinates;
  weather: WeatherData[];
  base: string;
  main: MainData;
  visibility: number;
  wind: WindData;
  clouds: {
    all: number;
  };
  dt: number;
  sys: SysData;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastItem {
  dt: number;
  main: MainData;
  weather: WeatherData[];
  clouds: {
    all: number;
  };
  wind: WindData;
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    coord: Coordinates;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export interface DailyForecast {
  date: string;
  day: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}

export interface AutocompleteResult {
  name: string;
  country: string;
  state?: string;
}

export type TemperatureUnit = 'metric' | 'imperial';