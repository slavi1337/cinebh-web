import { Link } from "react-router-dom";
import CheckmarkIcon from "../components/ui/icons/CheckmarkIcon";

const pricingTiers = [
  {
    name: "Regular Seats",
    price: "7 KM",
    features: [
      "Comfortable seating",
      "Affordable pricing",
      "Wide selection",
      "Accessible locations",
      "Suitable for everyone",
    ],
    featured: false,
  },
  {
    name: "Love Seats",
    price: "24 KM",
    features: [
      "Side-by-side design",
      "Comfortable padding",
      "Adjustable armrests",
      "Cup holders",
      "Reserved for couples",
    ],
    featured: true,
  },
  {
    name: "Vip Seats",
    price: "10 KM",
    features: [
      "Enhanced comfort",
      "Priority seating",
      "Prime viewing",
      "Personal space",
      "Luxury extras",
    ],
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="w-full grow bg-pricing-page-background pt-18.5 pb-24.25">
      <div className="mx-auto max-w-360 px-4 md:px-8 lg:px-23">
        <div className="mb-15 text-center">
          <h1 className="mb-6 text-[32px] leading-10 font-bold tracking-[-0.0025em] text-pricing-heading-text">
            Pricing
          </h1>

          <p className="mx-auto max-w-158 text-center text-[16px] leading-6 font-normal tracking-[0.005em] text-pricing-description-text">
            Welcome to our cinema ticket pricing options! We offer three tiers
            to suit everyone's preferences. Explore our pricing options below
            and treat yourself to a cinematic adventure like never before!
          </p>
        </div>

        <div className="grid grid-cols-1 items-center justify-items-center gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`w-full max-w-102 overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-2 ${
                tier.featured
                  ? "h-161 border border-pricing-card-border-featured bg-pricing-card-background shadow-[0px_2px_4px_-2px_rgba(52,64,84,0.08),0px_4px_6px_-1px_rgba(52,64,84,0.08)]"
                  : "h-141 border border-pricing-card-border-default bg-pricing-card-background"
              }`}
            >
              <div className={tier.featured ? "h-full py-10" : "h-full"}>
                <div className="flex h-full flex-col px-6 pt-13.25 pb-8">
                  <div className="mb-8 text-center">
                    <h3 className="text-[20px] leading-6 font-bold tracking-[-0.0015em] text-pricing-heading-text">
                      {tier.name}
                    </h3>

                    <div className="mt-6 flex items-center justify-center">
                      <span
                        className={`text-[32px] leading-10 font-bold tracking-[-0.0025em] ${
                          tier.featured
                            ? "text-brand-red"
                            : "text-pricing-heading-text"
                        }`}
                      >
                        {tier.price}
                      </span>
                    </div>

                    <p className="mt-3 text-[16px] leading-6 font-normal tracking-[0.005em] text-pricing-description-text">
                      *per ticket
                    </p>
                  </div>

                  <ul className="mb-8 grow space-y-5">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckmarkIcon />

                        <span className="text-[16px] leading-6 font-normal tracking-[0.005em] text-pricing-description-text">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/"
                    className={`mx-auto inline-flex h-12 w-37.25 shrink-0 items-center justify-center whitespace-nowrap rounded-lg px-5 py-3 text-[16px] leading-6 font-semibold tracking-[0.005em] transition-colors ${
                      tier.featured
                        ? "bg-brand-red text-pricing-card-background hover:bg-red-800"
                        : "border border-brand-red bg-pricing-card-background text-brand-red hover:bg-red-50"
                    }`}
                  >
                    Explore Movies
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
