import { Button } from "@/components/ui/button";

export function ContactForm() {
  return (
    <form className="grid gap-4 rounded-2xl border border-brand-light bg-white p-6" aria-label="Contact form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm" htmlFor="contact-first-name">
            First Name
          </label>
          <input id="contact-first-name" className="mt-1 h-11 w-full rounded-md border border-brand-light bg-white px-3" />
        </div>
        <div>
          <label className="text-sm" htmlFor="contact-last-name">
            Last Name
          </label>
          <input id="contact-last-name" className="mt-1 h-11 w-full rounded-md border border-brand-light bg-white px-3" />
        </div>
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-email">
          Email Address
        </label>
        <input id="contact-email" type="email" className="mt-1 h-11 w-full rounded-md border border-brand-light bg-white px-3" />
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-phone">
          Contact No.
        </label>
        <input id="contact-phone" type="tel" className="mt-1 h-11 w-full rounded-md border border-brand-light bg-white px-3" />
      </div>
      <div>
        <label className="text-sm" htmlFor="contact-message">
          Message
        </label>
        <textarea id="contact-message" rows={5} className="mt-1 w-full rounded-md border border-brand-light bg-white px-3 py-2" />
      </div>
      <Button type="submit" className="w-fit">
        Send Message
      </Button>
    </form>
  );
}
