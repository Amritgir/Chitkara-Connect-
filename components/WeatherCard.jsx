import useAsync from "../hooks/useAsync";
import { fetchWeather } from "../services/api";
import { Spinner, ErrorBox } from "./States";

const CODES = (c) => c === 0 ? ["Clear sky", "fa-sun"] : c <= 3 ? ["Partly cloudy", "fa-cloud-sun"] : c <= 48 ? ["Foggy", "fa-smog"] : c <= 67 ? ["Rainy", "fa-cloud-rain"] : c <= 77 ? ["Snow", "fa-snowflake"] : c <= 82 ? ["Showers", "fa-cloud-showers-heavy"] : ["Thunderstorm", "fa-bolt"];
const tip = (w) => w.weather_code >= 51 ? "Carry an umbrella to class." : w.temperature_2m >= 35 ? "It's hot - stay hydrated, carry water." : w.temperature_2m <= 10 ? "Cold morning - wear a jacket." : "Nice weather for walking between blocks.";

export default function WeatherCard() {
  const { data, loading, error, retry } = useAsync(fetchWeather, []);
  if (loading) return <div className="weather"><Spinner text="Checking campus weather..." /></div>;
  if (error) return <div className="weather"><ErrorBox message={error} onRetry={retry} /></div>;
  const [label, icon] = CODES(data.weather_code);
  return (
    <div className="weather">
      <div className="weather-top">
        <i className={`fa-solid ${icon}`} />
        <div><div className="temp">{Math.round(data.temperature_2m)}°C</div><span>{label} - Chitkara Campus</span></div>
      </div>
      <div className="weather-meta">
        <span><i className="fa-solid fa-droplet" /> {data.relative_humidity_2m}%</span>
        <span><i className="fa-solid fa-wind" /> {data.wind_speed_10m} km/h</span>
      </div>
      <p className="weather-tip"><i className="fa-solid fa-lightbulb" /> {tip(data)}</p>
    </div>
  );
}
