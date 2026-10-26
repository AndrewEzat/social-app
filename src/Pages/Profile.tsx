import { Alert, Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

type PasswordValues = { password: string; newPassword: string; confirmPassword: string };

export default function Profile() {
    const { user, signOut, changePassword } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [apiError, setApiError] = useState("");
    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<PasswordValues>();
    const newPassword = useWatch({ control, name: "newPassword" });

    function handleSignOut() {
        signOut();
        navigate("/login", { replace: true });
    }

    async function onChangePassword(values: PasswordValues) {
        setApiError("");
        setMessage("");
        try {
            await changePassword(values.password, values.newPassword);
            setMessage("Your password has been changed.");
            reset();
        } catch (error) {
            setApiError(error instanceof Error ? error.message : "Could not change your password.");
        }
    }

    return (
        <main className="profile-page">
            <div className="profile-card">
                <div className="profile-avatar" aria-hidden="true">{(user?.name || user?.username || "R").slice(0, 1).toUpperCase()}</div>
                <p className="eyebrow profile-eyebrow">Route Posts</p>
                <h1 className="auth-heading">You&apos;re signed in{user?.name ? `, ${user.name}` : ""}.</h1>
                <p className="auth-subheading">Your account session is active in this browser tab.</p>
                {user?.email && <p className="profile-email">{user.email}</p>}
                <div className="auth-notice">
                      Your account is connected. Feed and post screens will be added when their exact API contracts are verified from the collection.
                </div>
                <form className="password-form" onSubmit={handleSubmit(onChangePassword)} noValidate>
                    <h2 className="password-form-title">Change password</h2>
                    <div className="field-group">
                        <Label htmlFor="current-password">Current password</Label>
                        <TextInput id="current-password" type="password" autoComplete="current-password" {...register("password", { required: "Enter your current password." })} />
                        {errors.password && <p className="field-error">{errors.password.message}</p>}
                    </div>
                    <div className="field-group">
                        <Label htmlFor="new-password">New password</Label>
                        <TextInput id="new-password" type="password" autoComplete="new-password" {...register("newPassword", {
                            required: "Enter a new password.",
                            pattern: { value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, message: "Use 8+ characters with uppercase, lowercase, a number, and a symbol." },
                        })} />
                        {errors.newPassword && <p className="field-error">{errors.newPassword.message}</p>}
                    </div>
                    <div className="field-group">
                        <Label htmlFor="confirm-new-password">Confirm new password</Label>
                        <TextInput id="confirm-new-password" type="password" autoComplete="new-password" {...register("confirmPassword", { required: "Confirm your new password.", validate: (value) => value === newPassword || "Passwords do not match." })} />
                        {errors.confirmPassword && <p className="field-error">{errors.confirmPassword.message}</p>}
                    </div>
                    {apiError && <Alert color="failure" role="alert">{apiError}</Alert>}
                    {message && <Alert color="success" role="status">{message}</Alert>}
                    <Button type="submit" color="blue" disabled={isSubmitting}>{isSubmitting ? "Updating…" : "Update password"}</Button>
                </form>
                <Button color="light" onClick={handleSignOut}>Log out</Button>
            </div>
        </main>
    );
}
