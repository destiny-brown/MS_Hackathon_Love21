import { Button } from "@/components/ui/button";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const inputClass = dark
    ? "h-11 rounded-md border border-brand-cream/30 bg-transparent px-3 text-brand-cream placeholder:text-brand-cream/45"
    : "h-11 rounded-md border border-brand-sand bg-white px-3 text-brand-ink placeholder:text-brand-ink/45";

  return (
    <form className="grid gap-3" aria-label="Newsletter form">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm" htmlFor="newsletter-first-name">
            First Name
          </label>
          <input id="newsletter-first-name" className={`mt-1 w-full ${inputClass}`} />
        </div>
        <div>
          <label className="text-sm" htmlFor="newsletter-last-name">
            Last Name
          </label>
          <input id="newsletter-last-name" className={`mt-1 w-full ${inputClass}`} />
        </div>
      </div>
      <div>
        <label className="text-sm" htmlFor="newsletter-email">
          Email Address *
        </label>
        <input id="newsletter-email" type="email" required className={`mt-1 w-full ${inputClass}`} />
      </div>
      <div>
        <label className="text-sm" htmlFor="newsletter-phone">
          Phone Number
        </label>
        <input id="newsletter-phone" type="tel" className={`mt-1 w-full ${inputClass}`} />
      </div>
      <Button type="submit" className="mt-2 w-fit">
        Subscribe
      </Button>
    </form>
  );
}
