"use client";

import { useState, type FormEvent } from "react";
import { contactSchema, fieldErrors } from "@/lib/contact-schema";
import { site } from "@/content/site";
import Magnetic from "@/components/ui/Magnetic";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full scroll-mt-28 rounded-md border border-line bg-transparent px-4 py-3 text-base text-fg placeholder:text-muted focus:border-fg";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budget, setBudget] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const parsed = contactSchema.safeParse({
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      projectType,
      budget,
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    });

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error.issues));
      setFormError("Please fix the highlighted fields below.");
      setStatus("error");
      return;
    }

    setErrors({});
    setFormError("");
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setStatus("error");
        setFormError(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      form.reset();
      setProjectType("");
      setBudget("");
      setStatus("success");
    } catch {
      setStatus("error");
      setFormError("Network error. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="rounded-md border border-line p-8">
        <h3 className="text-2xl font-medium tracking-[-0.02em]">
          {site.contact.successTitle}
        </h3>
        <p className="mt-3 text-muted">{site.contact.successBody}</p>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="space-y-8">
      {formError ? (
        <p
          role="alert"
          className="rounded-md border border-accent/40 px-4 py-3 text-sm text-accent"
        >
          {formError}
        </p>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="label text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            inputMode="text"
            enterKeyHint="next"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`mt-2 ${inputClass}`}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-sm text-accent">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="label text-muted">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            enterKeyHint="next"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`mt-2 ${inputClass}`}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-sm text-accent">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <fieldset>
        <legend id="projectType-label" className="label text-muted">
          Project type
        </legend>
        <div
          role="group"
          aria-labelledby="projectType-label"
          className="mt-3 flex flex-wrap gap-2"
        >
          {site.contact.projectTypes.map((type) => {
            const selected = projectType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={selected}
                onClick={() => setProjectType(selected ? "" : type)}
                className={`label inline-flex min-h-11 items-center rounded-full border px-3 py-2 transition-colors ${
                  selected
                    ? "border-accent bg-accent text-bg"
                    : "border-line text-muted hover:border-fg hover:text-fg"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
        {errors.projectType ? (
          <p className="mt-2 text-sm text-accent">{errors.projectType}</p>
        ) : null}
      </fieldset>

      <fieldset>
        <legend id="budget-label" className="label text-muted">
          Budget <span className="normal-case">(optional)</span>
        </legend>
        <div
          role="group"
          aria-labelledby="budget-label"
          className="mt-3 flex flex-wrap gap-2"
        >
          {site.contact.budgets.map((band) => {
            const selected = budget === band;
            return (
              <button
                key={band}
                type="button"
                aria-pressed={selected}
                onClick={() => setBudget(selected ? "" : band)}
                className={`label inline-flex min-h-11 items-center rounded-full border px-3 py-2 transition-colors ${
                  selected
                    ? "border-fg text-fg"
                    : "border-line text-muted hover:border-fg hover:text-fg"
                }`}
              >
                {band}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="label text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          enterKeyHint="send"
          required
          placeholder={site.contact.messagePlaceholder}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`mt-2 resize-y ${inputClass}`}
        />
        {errors.message ? (
          <p id="message-error" className="mt-2 text-sm text-accent">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div aria-hidden="true" className="sr-only">
        <label htmlFor="company">Company (leave empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <Magnetic>
        <button
          type="submit"
          data-cursor="open"
          disabled={status === "submitting"}
          className="label inline-flex min-h-11 items-center rounded-full bg-accent px-6 py-3 text-bg transition-colors hover:bg-fg disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : site.contact.submitLabel}
        </button>
      </Magnetic>
    </form>
  );
}