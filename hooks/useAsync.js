import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { errorMessage } from "../services/api";

// Custom hook: runs an async fn (receives AbortSignal) with loading / error / retry
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const ctrl = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fn(ctrl.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err) => { if (!axios.isCancel(err)) setState({ data: null, loading: false, error: errorMessage(err) }); });
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);
  const retry = useCallback(() => setTick((t) => t + 1), []);
  return { ...state, retry };
}
