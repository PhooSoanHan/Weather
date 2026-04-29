import { useState } from "react";

function App() {
  const API_KEY = import.meta.env?.VITE_WEATHER_API_KEY || "";

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    const trimmedCity = city.trim();

    if (!trimmedCity) {
      setError("Please enter a city name first.");
      return;
    }

    if (!API_KEY) {
      setError("API key is missing. Add it in your .env file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          trimmedCity
        )}&appid=${API_KEY}&units=metric`
      );

      const data = await res.json();

      if (data.cod === 401) {
        setError("API key issue. Please check your .env file.");
        setWeather(null);
      } else if (data.cod === "404" || data.cod === 404) {
        setError("Please enter a valid city name, like Tokyo or Singapore.");
        setWeather(null);
      } else if (data.cod !== 200) {
        setError("Something went wrong. Try again later.");
        setWeather(null);
      } else {
        setWeather(data);
        setCity("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const iconUrl = weather
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`
    : "";

  return (
    <div className="min-h-screen overflow-hidden bg-[#FFF2A6] px-4 py-8 font-['Urbanist',sans-serif] text-[#1f1f1f]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;600;700;800;900&display=swap');

        @keyframes floatSoft {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.92) translateY(18px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes slideUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .float-soft { animation: floatSoft 4s ease-in-out infinite; }
        .pop-in { animation: popIn 0.45s ease-out both; }
        .slide-up { animation: slideUp 0.45s ease-out both; }
      `}</style>

      <div className="pointer-events-none fixed -left-24 top-12 h-64 w-64 rounded-full bg-[#FFE97D] blur-3xl" />
      <div className="pointer-events-none fixed -right-28 bottom-8 h-80 w-80 rounded-full bg-[#FF4F7C]/50 blur-3xl" />
      <div className="pointer-events-none fixed left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DD3D7F]/25 blur-3xl" />

      <div className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="w-full max-w-md pop-in">
          <div className="mb-6 text-center">
            <div className="float-soft mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.7rem] bg-[#FFE97D] text-4xl shadow-xl shadow-[#DD3D7F]/20">
              🌤️
            </div>

            <p className="text-xs font-black uppercase tracking-[0.45em] text-[#DD3D7F]">
              weather check
            </p>

            <h1 className="mt-2 text-5xl font-black tracking-tight">
              Weather App
            </h1>

            <p className="mt-2 text-base font-medium text-black/55">
              Type a city and get the current weather.
            </p>
          </div>

          <div className="rounded-[2rem] border-4 border-black bg-white p-4 shadow-[10px_10px_0px_#DD3D7F] transition hover:-translate-y-1 hover:shadow-[14px_14px_0px_#DD3D7F]">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter city..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                className="min-w-0 flex-1 rounded-2xl border-3 border-black bg-[#FFF2A6] px-4 py-4 text-lg font-bold outline-none placeholder:text-black/35 focus:bg-[#FFE97D]"
              />

              <button
                onClick={fetchWeather}
                disabled={loading}
                className="rounded-2xl border-3 border-black bg-[#FF4F7C] px-5 py-4 text-lg font-black text-white shadow-[4px_4px_0px_#000] transition hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_#000] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                Search
              </button>
            </div>

            {!weather && !loading && !error && (
              <div className="slide-up mt-6 rounded-[1.5rem] border-3 border-dashed border-black/30 bg-[#FFE97D]/60 p-6 text-center">
                <p className="text-4xl">🔎</p>
                <p className="mt-3 text-lg font-black">No city searched yet</p>
                <p className="mt-1 text-sm font-semibold text-black/50">
                  Try Singapore, Tokyo, Bangkok, or London.
                </p>
              </div>
            )}

            {loading && (
              <div className="slide-up mt-6 rounded-[1.5rem] border-3 border-black bg-[#FFE97D] p-6 text-center">
                <p className="text-3xl">⏳</p>
                <p className="mt-2 font-black">Loading weather...</p>
              </div>
            )}

            {error && !loading && (
              <div className="slide-up mt-6 rounded-[1.5rem] border-3 border-black bg-[#FF4F7C] p-5 text-center font-black text-white">
                {error}
              </div>
            )}

            {weather && !loading && (
              <div className="slide-up mt-6 overflow-hidden rounded-[1.7rem] border-4 border-black bg-[#FFE97D] shadow-[6px_6px_0px_#000]">
                <div className="bg-[#FF4F7C] px-6 py-4 text-white">
                  <p className="text-sm font-black uppercase tracking-[0.25em]">
                    📍 {weather.name}, {weather.sys.country}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-7xl font-black leading-none">
                        {Math.round(weather.main.temp)}°
                      </p>
                      <p className="mt-2 text-xl font-black capitalize text-[#DD3D7F]">
                        {weather.weather[0].description}
                      </p>
                    </div>

                    <div className="float-soft rounded-[1.5rem] bg-white/60 p-1">
                      <img src={iconUrl} alt="Weather icon" className="h-28 w-28" />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border-3 border-black bg-white p-3 text-center shadow-[3px_3px_0px_#000]">
                      <p className="text-xs font-black text-black/45">Feels</p>
                      <p className="mt-1 text-lg font-black">
                        {Math.round(weather.main.feels_like)}°C
                      </p>
                    </div>

                    <div className="rounded-2xl border-3 border-black bg-white p-3 text-center shadow-[3px_3px_0px_#000]">
                      <p className="text-xs font-black text-black/45">Humidity</p>
                      <p className="mt-1 text-lg font-black">
                        💧 {weather.main.humidity}%
                      </p>
                    </div>

                    <div className="rounded-2xl border-3 border-black bg-white p-3 text-center shadow-[3px_3px_0px_#000]">
                      <p className="text-xs font-black text-black/45">Wind</p>
                      <p className="mt-1 text-lg font-black">
                        💨 {weather.wind.speed}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
