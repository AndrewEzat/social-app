import { useState } from "react";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth";

type LoginValues = { login: string; password: string };

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginValues>();

  async function onSubmit(values: LoginValues) {
    setApiError("");
    setIsSubmitting(true);
    try {
      await signIn(values.login.trim(), values.password);
      navigate("/profile", { replace: true });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "We couldn’t log you in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-form-section">
      <div className="form-heading-row">
        <div>
          <h2 className="auth-heading">Log in to Route Posts</h2>
          <p className="auth-subheading">Log in and continue your social journey.</p>
        </div>
        <span className="form-emoji" aria-hidden="true">✦</span>
      </div>

      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-group">
          <Label htmlFor="login">Email or username</Label>
          <TextInput
            id="login"
            type="text"
            autoComplete="username"
            placeholder="you@example.com or username"
            color={errors.login ? "failure" : "gray"}
            {...register("login", { required: "Enter your email or username." })}
          />
          {errors.login && <p className="field-error">{errors.login.message}</p>}
        </div>
        <div className="field-group">
          <div className="label-row">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-link">Forgot password?</Link>
          </div>
          <TextInput
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            color={errors.password ? "failure" : "gray"}
            {...register("password", { required: "Enter your password." })}
          />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        {apiError && <Alert color="failure" role="alert">{apiError}</Alert>}
        <Button type="submit" className="primary-auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Log In"}
        </Button>
      </form>
      <p className="switch-prompt">New to Route Posts? <Link className="text-link strong-link" to="/register">Create an account</Link></p>
    </section>
  );
}
