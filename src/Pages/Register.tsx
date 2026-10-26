import { useState } from "react";
import { Alert, Button, Label, Select, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/useAuth";
import type { SignupPayload } from "../services/authApi";
import { useWatch } from "react-hook-form";

type RegisterValues = SignupPayload & { confirmPassword: string };

export default function Register() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, control, formState: { errors } } = useForm<RegisterValues>();
  const password = useWatch({ control, name: "password" });

  async function onSubmit(values: RegisterValues) {
    setApiError("");
    setIsSubmitting(true);
    const payload: SignupPayload = {
      name: values.name,
      username: values.username,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      password: values.password,
      rePassword: values.password,
    };
    try {
      await signUp(payload);
      navigate("/profile", { replace: true });
    } catch (error) {
      setApiError(error instanceof Error ? error.message : "We couldn’t create your account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="auth-form-section register-section">
      <h2 className="auth-heading">Create a new account</h2>
      <p className="auth-subheading">It is quick and easy.</p>

      <form className="auth-form register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="field-group">
          <Label htmlFor="name">Full name</Label>
          <TextInput id="name" autoComplete="name" placeholder="Your full name" color={errors.name ? "failure" : "gray"}
            {...register("name", { required: "Enter your full name.", minLength: { value: 2, message: "Name must be at least 2 characters." } })} />
          {errors.name && <p className="field-error">{errors.name.message}</p>}
        </div>
        <div className="field-group">
          <Label htmlFor="username">Username <span className="optional-label">(optional)</span></Label>
          <TextInput id="username" autoComplete="username" placeholder="Choose a username" color={errors.username ? "failure" : "gray"}
            {...register("username", { minLength: { value: 3, message: "Username must be at least 3 characters." } })} />
          {errors.username && <p className="field-error">{errors.username.message}</p>}
        </div>
        <div className="field-group">
          <Label htmlFor="email">Email address</Label>
          <TextInput id="email" type="email" autoComplete="email" placeholder="you@example.com" color={errors.email ? "failure" : "gray"}
            {...register("email", { required: "Enter your email address.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address." } })} />
          {errors.email && <p className="field-error">{errors.email.message}</p>}
        </div>
        <div className="form-two-columns">
          <div className="field-group">
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" color={errors.gender ? "failure" : "gray"} {...register("gender", { required: "Choose your gender." })}>
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
            {errors.gender && <p className="field-error">{errors.gender.message}</p>}
          </div>
          <div className="field-group">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <TextInput id="dateOfBirth" type="date" autoComplete="bday" color={errors.dateOfBirth ? "failure" : "gray"}
              {...register("dateOfBirth", { required: "Enter your date of birth." })} />
            {errors.dateOfBirth && <p className="field-error">{errors.dateOfBirth.message}</p>}
          </div>
        </div>
        <div className="field-group">
          <Label htmlFor="register-password">Password</Label>
          <TextInput id="register-password" type="password" autoComplete="new-password" placeholder="At least 8 characters" color={errors.password ? "failure" : "gray"}
            {...register("password", {
              required: "Create a password.",
              pattern: {
                value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                message: "Use 8+ characters with uppercase, lowercase, a number, and a symbol.",
              },
            })} />
          {errors.password && <p className="field-error">{errors.password.message}</p>}
        </div>
        <div className="field-group">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <TextInput id="confirmPassword" type="password" autoComplete="new-password" placeholder="Enter your password again" color={errors.confirmPassword ? "failure" : "gray"}
            {...register("confirmPassword", { required: "Confirm your password.", validate: (value) => value === password || "Passwords do not match." })} />
          {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
        </div>
        {apiError && <Alert color="failure" role="alert">{apiError}</Alert>}
        <Button type="submit" className="primary-auth-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create New Account"}
        </Button>
      </form>
      <p className="switch-prompt">Already have an account? <Link className="text-link strong-link" to="/login">Log in</Link></p>
    </section>
  );
}
