export const isChitkaraEmail = (e) => /^[^\s@]+@(chitkara\.edu\.in|chitkarauniversity\.edu\.in)$/i.test(e.trim());
export const isPhone = (v) => /^[6-9]\d{9}$/.test(v.trim());
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}

export function validateSignup({ name, email, password, confirm }) {
  const e = {};
  if (name.trim().length < 3) e.name = "Enter your full name (min 3 characters).";
  if (!isChitkaraEmail(email)) e.email = "Use your Chitkara email (@chitkara.edu.in).";
  if (password.length < 6) e.password = "Password must be at least 6 characters.";
  if (confirm !== password) e.confirm = "Passwords do not match.";
  return e;
}

export function validateLogin({ email, password }) {
  const e = {};
  if (!isChitkaraEmail(email)) e.email = "Use a valid Chitkara email ID.";
  if (!password) e.password = "Password is required.";
  return e;
}

export function validateItem(f) {
  const e = {};
  if (f.title.trim().length < 3) e.title = "Title needs at least 3 characters.";
  if (f.description.trim().length < 10) e.description = "Describe the item in at least 10 characters.";
  if (!isPhone(f.contactInfo) && !isEmail(f.contactInfo)) e.contactInfo = "Enter a valid 10-digit mobile number or email.";
  if (f.imageUrl && !/^https?:\/\//i.test(f.imageUrl.trim())) e.imageUrl = "Image link must start with http:// or https://";
  return e;
}

export function validateClass(f) {
  const e = {};
  if (f.subject.trim().length < 2) e.subject = "Enter the subject name.";
  if (!f.start) e.start = "Select a start time.";
  if (!f.end) e.end = "Select an end time.";
  if (f.start && f.end && f.end <= f.start) e.end = "End time must be after start time.";
  return e;
}
