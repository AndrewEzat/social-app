import { Link, Outlet, useLocation } from "react-router-dom";

const academyStats = [
  ["2012", "Founded"],
  ["40K+", "Graduates"],
  ["50+", "Partner companies"],
  ["5", "Branches"],
  ["20", "Diplomas available"],
];

export default function AuthLayout() {
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <main className="auth-shell">
      <aside className="academy-panel">
        <div className="academy-mark" aria-hidden="true">R</div>
        <p className="eyebrow">About Route Academy</p>
        <h1 className="academy-title">Egypt&apos;s Leading IT Training Center Since 2012</h1>
        <p className="academy-description">
          Route Academy is the premier IT training center in Egypt. We specialize in high-quality training in programming,
          web development, and application development, helping learners take their next step in technology.
        </p>
        <div className="academy-stats">
          {academyStats.map(([value, label]) => (
            <div className="academy-stat" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <p className="academy-footer">Learn. Build. Connect.</p>
      </aside>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="brand-lockup">
            <div className="brand-icon" aria-hidden="true">R</div>
            <div>
              <p className="brand-name">Route Posts</p>
              <p className="brand-tagline">Connect with friends and the world around you.</p>
            </div>
          </div>

          <div className="auth-tabs" aria-label="Account options">
            <Link className={!isRegister ? "auth-tab active" : "auth-tab"} to="/login">Login</Link>
            <Link className={isRegister ? "auth-tab active" : "auth-tab"} to="/register">Register</Link>
          </div>

          <Outlet />
        </div>
        <p className="auth-legal">By continuing, you agree to use Route Posts respectfully.</p>
      </section>
    </main>
  );
}
