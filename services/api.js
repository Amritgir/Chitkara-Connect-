import axios from "axios";

export const notesApi = axios.create({ baseURL: "https://jsonplaceholder.typicode.com", timeout: 10000 });
export const weatherApi = axios.create({ baseURL: "https://api.open-meteo.com/v1", timeout: 10000 });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// GET with automatic retry + exponential backoff
export async function getWithRetry(client, url, config = {}, retries = 2) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await client.get(url, config);
    } catch (err) {
      if (axios.isCancel(err) || attempt >= retries) throw err;
      await wait(500 * 2 ** attempt);
    }
  }
}

export const errorMessage = (err) =>
  err.code === "ECONNABORTED" ? "The request timed out." : !err.response ? "Network error - check your internet connection." : `Server error (${err.response.status}).`;

const CATS = ["Academic", "Exams", "Events", "Hostel", "Placements"];
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Third-party API demo: turn JSONPlaceholder posts into campus notices
export async function fetchNotices(page, limit, signal) {
  const res = await getWithRetry(notesApi, "/posts", { params: { _page: page, _limit: limit }, signal });
  const total = Number(res.headers["x-total-count"]) || 100;
  const notices = res.data.map((p) => ({
    id: p.id,
    title: cap(p.title),
    body: cap(p.body.replace(/\n/g, " ")),
    category: CATS[p.id % CATS.length],
    date: new Date(2026, 9, 1 + (p.id % 24)).toISOString().slice(0, 10),
  }));
  return { notices, total };
}

export async function fetchWeather(signal) {
  const res = await getWithRetry(weatherApi, "/forecast", {
    params: { latitude: 30.5161, longitude: 76.6593, current: "temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m", timezone: "auto" },
    signal,
  });
  return res.data.current;
}
