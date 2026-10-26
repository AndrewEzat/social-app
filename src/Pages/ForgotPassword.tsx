import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <section className="auth-form-section">
      <h2 className="auth-heading">Forgot your password?</h2>
      <p className="auth-subheading">Password recovery is not available in the provided API documentation yet.</p>
      <div className="auth-notice" role="status">
        Contact Route Posts support to recover your account. This page will be connected when a recovery endpoint is documented.
      </div>
      <Link className="text-link back-link" to="/login">← Back to login</Link>
    </section>
  );
}
