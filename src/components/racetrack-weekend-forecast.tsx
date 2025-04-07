import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplets, Wind, Calendar } from "lucide-react";
import type { WeatherForecast } from "@/lib/weather";

type RacetrackWeekendForecastProps = {
  name: string;
  location: string;
  saturday: WeatherForecast;
  sunday: WeatherForecast;
};

export function RacetrackWeekendForecast({
  name,
  location,
  saturday,
  sunday,
}: RacetrackWeekendForecastProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="bg-green-700 text-white">
        <CardTitle className="text-xl mt-2">{name}</CardTitle>
        <p className="text-green-100 text-sm mb-2">{location}</p>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs defaultValue="saturday" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="saturday" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>土曜日</span>
            </TabsTrigger>
            <TabsTrigger value="sunday" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>日曜日</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saturday" className="mt-0">
            <DayForecast forecast={saturday} />
          </TabsContent>

          <TabsContent value="sunday" className="mt-0">
            <DayForecast forecast={sunday} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function DayForecast({ forecast }: { forecast: WeatherForecast }) {
  const { date, weather, temperature, humidity, windSpeed, precipitation } =
    forecast;

  return (
    <div className="p-2">
      <div className="text-sm text-gray-500 mb-2">{formatDate(date)}</div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div>
            <p className="text-lg font-medium">{weather}</p>
            <p className="text-3xl font-bold">{temperature.toFixed(1)}°C</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex items-center">
          <Droplets className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-700">{humidity}%</span>
        </div>
        <div className="flex items-center">
          <Wind className="h-5 w-5 text-gray-500 mr-2" />
          <span className="text-gray-700">{windSpeed} m/s</span>
        </div>
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-400 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M8 19v1M12 19v1M16 19v1M8 14v1M12 14v1M16 14v1M8 9v1M12 9v1M16 9v1M4 4h16" />
            <path d="M8 4v.01M12 4v.01M16 4v.01" />
          </svg>
          <span className="text-gray-700">{precipitation}%</span>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
    weekday: "short",
  });
}
