import { RacetrackWeekendForecast } from "@/components/racetrack-weekend-forecast";
import { getWeekendForecasts } from "@/lib/weather";

export default async function Home() {
  const weekendForecasts = await getWeekendForecasts();

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
            JRA競馬場の週末天気予報
          </h1>
          <p className="text-green-600">
            日本の主要競馬場の土曜・日曜の天気情報
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {weekendForecasts.map((racetrack) => (
            <RacetrackWeekendForecast
              key={racetrack.id}
              name={racetrack.name}
              location={racetrack.location}
              saturday={racetrack.saturday}
              sunday={racetrack.sunday}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
