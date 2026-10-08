"use client";

import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-10 border border-line bg-white p-6 md:p-8">
      <label htmlFor="password" className="mb-2 block text-[14px]">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        className="field"
        aria-invalid={!!state.error}
        aria-describedby="login-error"
        required
        autoFocus
      />
      {state.error ? (
        <p id="login-error" role="alert" className="mt-2 text-[13px] text-danger">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-6 w-full rounded-[2px] bg-ink px-5 py-3.5 text-[15px] text-white transition-colors hover:bg-accent disabled:opacity-60"
      >
        {pending ? "Memeriksa…" : "Masuk"}
      </button>
    </form>
  );
}
