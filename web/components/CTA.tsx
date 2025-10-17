import Link from "next/link";
import { RocketIcon, BarChartIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

interface CTAProps {
  title?: string;
  description?: string;
  primaryText?: string;
  primaryHref?: string;
  secondaryText?: string;
  secondaryHref?: string;
  variant?: "default" | "compact";
}

export default function CTA({
  title = "Ready to Start Trading Smarter?",
  description = "Join thousands of traders using AI-powered signals to enhance their crypto trading strategy.",
  primaryText = "Join Discord",
  primaryHref = "https://discord.gg/your-server",
  secondaryText = "View Performance",
  secondaryHref = "/performance",
  variant = "default",
}: CTAProps) {
  const isExternal = primaryHref.startsWith("http");

  return (
    <div
      className={clsx(
        "p-8 md:p-12 bg-gradient-to-br from-surface via-elev to-surface border border-border rounded-2xl shadow-glow",
        variant === "compact" ? "text-center" : ""
      )}
      role="region"
      aria-label="Call to action"
    >
      {/* Icon */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex p-3 bg-accent/10 rounded-lg">
          <RocketIcon className="w-10 h-10 text-accent" aria-hidden="true" />
        </div>
      </div>

      {/* Content */}
      <div className={clsx("mb-8", variant === "default" ? "text-center" : "")}>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text mb-4">
          {title}
        </h2>
        <p className="text-base md:text-lg text-text2 max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        {isExternal ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-elev"
            aria-label={`${primaryText} (opens in new tab)`}
          >
            <RocketIcon className="w-5 h-5" aria-hidden="true" />
            <span className="relative z-10">{primaryText}</span>
          </a>
        ) : (
          <Link
            href={primaryHref}
            className="group relative inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-white bg-gradient-brand rounded-lg shadow-soft hover:shadow-glow transition-all duration-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-elev"
          >
            <RocketIcon className="w-5 h-5" aria-hidden="true" />
            <span className="relative z-10">{primaryText}</span>
          </Link>
        )}

        <Link
          href={secondaryHref}
          className="inline-flex items-center justify-center gap-2 px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold text-text bg-surface border-2 border-border rounded-lg hover:border-accent hover:bg-elev transition-all duration-300 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-elev"
        >
          <BarChartIcon className="w-5 h-5" aria-hidden="true" />
          {secondaryText}
        </Link>
      </div>

      {/* Trust Indicators */}
      <div className="mt-8 text-center">
        <p className="text-sm text-dim">
          No credit card required • Cancel anytime • 99.8% uptime
        </p>
      </div>
    </div>
  );
}
