// 天気情報を取得するためのAPI
// OpenWeatherMap APIを使用して実際の天気データを取得します

export interface WeatherForecast {
  date: string;
  weather: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  icon: string;
}

interface RacetrackWeekendForecast {
  id: string;
  name: string;
  location: string;
  saturday: WeatherForecast;
  sunday: WeatherForecast;
}

interface ForecastItem {
  dt: number;
  weather: Array<{
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    humidity: number;
  };
  wind: {
    speed: number;
  };
  pop: number;
}

// JRA競馬場のリスト
const JRA_RACETRACKS = [
  {
    id: "tokyo",
    name: "東京競馬場",
    location: "東京都府中市",
    lat: 35.6694,
    lon: 139.4811,
  },
  {
    id: "nakayama",
    name: "中山競馬場",
    location: "千葉県船橋市",
    lat: 35.7213,
    lon: 140.0256,
  },
  {
    id: "kyoto",
    name: "京都競馬場",
    location: "京都府京都市",
    lat: 34.9169,
    lon: 135.7558,
  },
  {
    id: "hanshin",
    name: "阪神競馬場",
    location: "兵庫県宝塚市",
    lat: 34.7703,
    lon: 135.3612,
  },
  {
    id: "sapporo",
    name: "札幌競馬場",
    location: "北海道札幌市",
    lat: 43.0553,
    lon: 141.3403,
  },
  {
    id: "hakodate",
    name: "函館競馬場",
    location: "北海道函館市",
    lat: 41.7687,
    lon: 140.7288,
  },
  {
    id: "fukushima",
    name: "福島競馬場",
    location: "福島県福島市",
    lat: 37.7608,
    lon: 140.4747,
  },
  {
    id: "niigata",
    name: "新潟競馬場",
    location: "新潟県新潟市",
    lat: 37.9161,
    lon: 139.0364,
  },
  {
    id: "chukyo",
    name: "中京競馬場",
    location: "愛知県豊明市",
    lat: 35.0438,
    lon: 137.0158,
  },
  {
    id: "kokura",
    name: "小倉競馬場",
    location: "福岡県北九州市",
    lat: 33.8823,
    lon: 130.8825,
  },
];

export async function getWeekendForecasts(): Promise<
  RacetrackWeekendForecast[]
> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.error("OpenWeatherMap APIキーが設定されていません");
      return [];
    }

    return Promise.all(
      JRA_RACETRACKS.map(async (racetrack) => {
        try {
          // 5日間の天気予報を取得
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${racetrack.lat}&lon=${racetrack.lon}&units=metric&lang=ja&appid=${apiKey}`
          );

          if (!response.ok) {
            throw new Error(
              `API request failed with status ${response.status}`
            );
          }

          const data = await response.json();

          // 次の土曜日と日曜日の日付を取得
          const saturdayDate = getNextWeekendDate(true);
          const sundayDate = getNextWeekendDate(false);

          // 土曜日と日曜日の正午頃のデータを抽出
          const saturdayForecast = extractDayForecast(data.list, saturdayDate);
          const sundayForecast = extractDayForecast(data.list, sundayDate);

          return {
            id: racetrack.id,
            name: racetrack.name,
            location: racetrack.location,
            saturday: saturdayForecast || getFallbackForecast(saturdayDate),
            sunday: sundayForecast || getFallbackForecast(sundayDate),
          };
        } catch (error) {
          console.error(`${racetrack.name}の天気データ取得に失敗:`, error);
          // エラーが発生した場合はフォールバックデータを返す
          return {
            id: racetrack.id,
            name: racetrack.name,
            location: racetrack.location,
            saturday: getFallbackForecast(getNextWeekendDate(true)),
            sunday: getFallbackForecast(getNextWeekendDate(false)),
          };
        }
      })
    );
  } catch (error) {
    console.error("天気データの取得に失敗しました:", error);
    return [];
  }
}

// APIレスポンスから特定の日の予報を抽出する関数
function extractDayForecast(
  forecastList: ForecastItem[],
  targetDate: string
): WeatherForecast | null {
  // その日の12:00頃のデータを探す（正午に近いデータを優先）
  const targetForecasts = forecastList.filter((item) => {
    const itemDate = new Date(item.dt * 1000);
    const itemDateStr = itemDate.toISOString().split("T")[0];
    return itemDateStr === targetDate;
  });

  if (targetForecasts.length === 0) {
    return null;
  }

  // 正午に最も近い時間のデータを選択
  let closestToDayTime = targetForecasts[0];
  let minTimeDiff = Number.POSITIVE_INFINITY;

  targetForecasts.forEach((forecast) => {
    const forecastTime = new Date(forecast.dt * 1000);
    const hoursDiff = Math.abs(forecastTime.getHours() - 12);

    if (hoursDiff < minTimeDiff) {
      minTimeDiff = hoursDiff;
      closestToDayTime = forecast;
    }
  });

  const forecast = closestToDayTime;

  return {
    date: targetDate,
    weather: forecast.weather[0].description,
    temperature: forecast.main.temp,
    humidity: forecast.main.humidity,
    windSpeed: forecast.wind.speed,
    precipitation: forecast.pop * 100, // 降水確率（0-1を0-100%に変換）
    icon: forecast.weather[0].icon,
  };
}

// 次の週末の日付を取得する関数
function getNextWeekendDate(isSaturday: boolean): string {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = 日曜日, 6 = 土曜日

  // 次の土曜日までの日数を計算
  let daysUntilSaturday = 6 - currentDay;
  if (daysUntilSaturday <= 0) daysUntilSaturday += 7;

  // 次の日曜日までの日数を計算
  let daysUntilSunday = 7 - currentDay;
  if (daysUntilSunday <= 0) daysUntilSunday += 7;

  const targetDate = new Date(today);
  if (isSaturday) {
    targetDate.setDate(today.getDate() + daysUntilSaturday);
  } else {
    targetDate.setDate(today.getDate() + daysUntilSunday);
  }

  return targetDate.toISOString().split("T")[0];
}

// フォールバック用の天気予報データを生成する関数
function getFallbackForecast(date: string): WeatherForecast {
  return {
    date: date,
    weather: "データなし",
    temperature: 20,
    humidity: 50,
    windSpeed: 3,
    precipitation: 0,
    icon: "03d", // 曇りアイコン
  };
}
