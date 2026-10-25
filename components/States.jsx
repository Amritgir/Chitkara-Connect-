export function Spinner({ text = "Loading..." }) {
  return <div className="state-box"><div className="spinner" /><p>{text}</p></div>;
}
export function ErrorBox({ message, onRetry }) {
  return (
    <div className="state-box error">
      <i className="fa-solid fa-triangle-exclamation" />
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <button className="btn btn-primary" onClick={onRetry}><i className="fa-solid fa-rotate-right" /> Try again</button>}
    </div>
  );
}
export function Empty({ icon = "fa-box-open", title, text, children }) {
  return (
    <div className="state-box">
      <div className="card-icon"><i className={`fa-solid ${icon}`} /></div>
      <h3>{title}</h3><p>{text}</p>{children}
    </div>
  );
}
export const Skeletons = ({ n = 6 }) => (
  <div className="cards">{Array.from({ length: n }, (_, i) => <div key={i} className="skeleton" />)}</div>
);
