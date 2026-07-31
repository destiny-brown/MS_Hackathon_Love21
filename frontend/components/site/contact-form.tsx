import { Button } from "@/components/ui/button";

const fieldClass =
  "mt-1 h-11 w-full rounded-md border border-brand-sand bg-white px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export function ContactForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-brand-sand bg-white p-6" aria-label="Contact form">
      <div>
        <h2 className="font-serif-display text-3xl text-brand-ink">Send an enquiry</h2>
        <p className="mt-2 text-sm leading-6 text-brand-ink/70">
          Share a few details and the Love 21 team can guide you to the right next step.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-brand-ink" htmlFor="contact-first-name">
            First name
          </label>
          <input id="contact-first-name" className={fieldClass} autoComplete="given-name" />
        </div>
        <div>
          <label className="text-sm font-medium text-brand-ink" htmlFor="contact-last-name">
            Last name
          </label>
          <input id="contact-last-name" className={fieldClass} autoComplete="family-name" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-brand-ink" htmlFor="contact-email">
          Email address
        </label>
        <input id="contact-email" type="email" className={fieldClass} autoComplete="email" />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-ink" htmlFor="contact-phone">
          Contact number
        </label>
        <input id="contact-phone" type="tel" className={fieldClass} autoComplete="tel" />
      </div>
      <div>
        <label className="text-sm font-medium text-brand-ink" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className="mt-1 w-full rounded-md border border-brand-sand bg-white px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button type="submit" className="w-full sm:w-fit">
        Send message
      </Button>
    </form>
  );
}
