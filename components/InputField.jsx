// Reusable controlled input: handles label, error text, textarea and select
export default function InputField({ label, id, error, as = "input", hint, children, ...props }) {
  const Tag = as;
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <Tag id={id} name={id} aria-invalid={!!error} {...props}>{children}</Tag>
      {error ? <small className="field-error"><i className="fa-solid fa-circle-exclamation" /> {error}</small> : hint && <small className="field-hint">{hint}</small>}
    </div>
  );
}
