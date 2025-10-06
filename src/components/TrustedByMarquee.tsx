"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/UnifiedThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";

interface Logo {
  name: string;
  src: string;
}

type TrustedByEntry =
  | string
  | {
      name?: string;
      file?: string;
      path?: string;
      src?: string;
    };

const DEFAULT_SUPABASE_URL = "https://hphuswfgqfnnxqncvpoj.supabase.co";
const LEGACY_SUPABASE_URL = "https://mnymihqaxdddxokphire.supabase.co";
const FALLBACK_LOGO_FILE = "House_leaders.png";

const resolveSupabaseUrl = () => {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_FALLBACK_URL,
    DEFAULT_SUPABASE_URL,
    LEGACY_SUPABASE_URL
  ] as (string | undefined)[];

  const selected = candidates.find((value) => typeof value === "string" && value.trim().length > 0);
  return (selected ?? DEFAULT_SUPABASE_URL).replace(/\/$/, "");
};

const STORAGE_BASE_URL = resolveSupabaseUrl();
const TRUSTED_BY_BUCKET = (() => {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_TRUSTED_BY_BUCKET || "trusted-by";
  return raw.trim().length > 0 ? raw.trim() : "trusted-by";
})();

const encodeStoragePath = (path: string) =>
  path
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

const PUBLIC_TRUSTED_BY_BASE = `${STORAGE_BASE_URL}/storage/v1/object/public/${encodeURIComponent(
  TRUSTED_BY_BUCKET
)}/`;

const shouldUseProxyForHost = (hostname?: string | null) => {
  if (!hostname) return false;
  const normalized = hostname.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "127.0.0.1" ||
    normalized.includes("vercel.app") ||
    normalized.includes("mohcareer.com") ||
    !normalized.includes("supabase.co")
  );
};

const buildLogoSource = (fileName: string, useProxy: boolean): string | null => {
  if (!fileName) return null;
  const trimmed = fileName.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (useProxy) {
    return `/api/image-proxy?file=${encodeURIComponent(trimmed)}`;
  }

  return `${PUBLIC_TRUSTED_BY_BASE}${encodeStoragePath(trimmed)}`;
};

const buildFallbackLogos = (useProxy: boolean): Logo[] => {
  const src = buildLogoSource(FALLBACK_LOGO_FILE, useProxy);
  if (!src) return [];
  return [
    {
      name: "",
      src
    }
  ];
};

export default function LogoCarousel() {
  const [partnerLogos, setPartnerLogos] = useState<Logo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const { language, content } = useLanguage();

  const hexToRgba = (hex: string, alpha: number) => {
    let sanitized = hex.replace("#", "");
    if (sanitized.length === 3) {
      sanitized = sanitized
        .split("")
        .map((char) => char + char)
        .join("");
    }

    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const palette = useMemo(() => {
    const primary = isDark ? "#3A9C95" : "#50B7AF";
    const secondary = "#fb6a44";
    const surface = isDark ? "#101828" : "#ffffff";
    const sectionBg = isDark ? "#0f172a" : "#f8fafc";
    const border = isDark ? "rgba(148, 163, 184, 0.28)" : "rgba(15, 23, 42, 0.12)";

    return {
      primary,
      secondary,
      surface,
      sectionBg,
      border,
      glow: hexToRgba(primary, isDark ? 0.28 : 0.18),
      subtle: hexToRgba(primary, isDark ? 0.12 : 0.08)
    };
  }, [isDark]);

  const trustedUIText = useMemo(() => {
    const group = content?.ui?.trustedBy ?? {};
    const fallback = group?.ar ?? {};
    const localized = (group as Record<string, typeof fallback>)[language] ?? fallback;
    return { localized, fallback };
  }, [content, language]);
  const defaultTrustedUI = trustedUIText.fallback;
  const trustedUI = trustedUIText.localized;

  const sectionCopy = useMemo(
    () => ({
      eyebrow: trustedUI.eyebrow ?? defaultTrustedUI.eyebrow ?? '',
      title: trustedUI.title ?? defaultTrustedUI.title ?? '',
      description: trustedUI.description ?? defaultTrustedUI.description ?? ''
    }),
    [trustedUI, defaultTrustedUI]
  );
  const badgeLabel = trustedUI.badge ?? defaultTrustedUI.badge ?? '';
  const taglineLabel = trustedUI.tagline ?? defaultTrustedUI.tagline ?? '';
  const subheadingLabel = trustedUI.subheading ?? defaultTrustedUI.subheading ?? '';
  const ctaPrimaryLabel = trustedUI.ctaPrimary ?? defaultTrustedUI.ctaPrimary ?? '';
  const ctaSecondaryLabel = trustedUI.ctaSecondary ?? defaultTrustedUI.ctaSecondary ?? '';
  const carouselLabel = [sectionCopy.title, badgeLabel].find((value) => (value ?? '').toString().trim().length > 0) ?? '';

  useEffect(() => {
    if (!content) return;

    const useProxy =
      typeof window !== "undefined" ? shouldUseProxyForHost(window.location.hostname) : false;

    const entries: TrustedByEntry[] = Array.isArray(content?.trustedBy)
      ? (content?.trustedBy as TrustedByEntry[])
      : [];

    const logos = entries
      .map((entry: TrustedByEntry) => {
        if (!entry) return null;

        if (typeof entry === "string") {
          const src = buildLogoSource(entry, useProxy);
          if (!src) return null;
          return {
            name: "",
            src
          } satisfies Logo;
        }

        if (typeof entry === "object") {
          const explicitSrc = typeof entry.src === "string" ? entry.src.trim() : null;
          const file = typeof entry.file === "string" ? entry.file : typeof entry.path === "string" ? entry.path : null;
          const resolvedSrc = explicitSrc || (file ? buildLogoSource(file, useProxy) : null);
          if (!resolvedSrc) return null;
          return {
            name: typeof entry.name === "string" && entry.name.trim().length > 0 ? entry.name : "",
            src: resolvedSrc
          } satisfies Logo;
        }

        return null;
      })
  .filter((logo: Logo | null): logo is Logo => Boolean(logo));

    if (logos.length > 0) {
      setPartnerLogos(logos);
    } else {
      setPartnerLogos(buildFallbackLogos(useProxy));
    }

    setIsLoading(false);
  }, [content]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
    }
  };

  return (
    <section
      id="trusted-by"
      className="relative overflow-hidden py-16 sm:py-20"
      style={{ backgroundColor: palette.sectionBg }}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold tracking-wide text-white"
            style={{ backgroundColor: palette.secondary }}
          >
            <ShieldCheck className="h-4 w-4" />
            {String(sectionCopy.eyebrow)}
          </span>
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: isDark ? "#f8fafc" : "#0f172a" }}
          >
            {String(sectionCopy.title)}
          </h2>
          <p
            className="mt-4 text-base leading-relaxed sm:text-lg"
            style={{ color: isDark ? "#cbd5f5" : "#1f2937" }}
          >
            {String(sectionCopy.description)}
          </p>
        </div>

        <div
          className="relative rounded-3xl border px-4 py-10 sm:px-8"
          style={{
            backgroundColor: palette.surface,
            borderColor: palette.border,
            boxShadow: isDark
              ? "0 24px 50px rgba(15, 23, 42, 0.55)"
              : "0 20px 48px rgba(15, 23, 42, 0.12)"
          }}
        >
          <div className="absolute -top-6 right-6 hidden rounded-full px-4 py-2 text-sm font-medium text-white sm:flex"
            style={{ backgroundColor: palette.primary }}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {String(badgeLabel)}
          </div>

          {partnerLogos.length > 1 && (
            <>
              <button
                type="button"
                aria-label={String(carouselLabel) || undefined}
                onClick={() => scroll("left")}
                className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full p-2 transition-all sm:flex z-20"
                style={{
                  backgroundColor: palette.secondary,
                  color: "#ffffff",
                  boxShadow: `0 12px 24px ${hexToRgba(palette.secondary, 0.3)}`
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label={String(carouselLabel) || undefined}
                onClick={() => scroll("right")}
                className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full p-2 transition-all sm:flex z-20"
                style={{
                  backgroundColor: palette.secondary,
                  color: "#ffffff",
                  boxShadow: `0 12px 24px ${hexToRgba(palette.secondary, 0.3)}`
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className="flex items-center gap-6 overflow-x-auto px-2 py-2 sm:gap-10"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none"
            }}
          >
            {isLoading && partnerLogos.length === 0 ? (
              <div className="flex w-full justify-center gap-6 sm:gap-10">
                {[1, 2, 3, 4].map((placeholder) => (
                  <div
                    key={placeholder}
                    className="h-20 w-40 animate-pulse rounded-2xl"
                    style={{ backgroundColor: palette.subtle }}
                  />
                ))}
              </div>
            ) : partnerLogos.length === 1 ? (
              <div className="flex w-full justify-center">
                <div
                  className="flex h-24 w-48 items-center justify-center rounded-2xl border transition-transform duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: palette.surface,
                    borderColor: palette.border,
                    boxShadow: `0 18px 32px ${palette.glow}`
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={partnerLogos[0].src}
                    alt={partnerLogos[0].name}
                    className="max-h-16 max-w-[80%] object-contain"
                  />
                </div>
              </div>
            ) : (
              <div
                className={`flex items-center gap-6 sm:gap-10 ${partnerLogos.length > 0 ? "animate-scroll" : ""}`}
                style={{ minWidth: "max-content" }}
              >
                {[...Array(4)].map((_, setIndex) => (
                  <div key={`set-${setIndex}`} className="flex items-center gap-6 sm:gap-10">
                    {partnerLogos.map((logo, idx) => (
                      <div
                        key={`logo-${setIndex}-${idx}`}
                        className="flex h-24 w-48 flex-shrink-0 items-center justify-center rounded-2xl border transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl"
                        style={{
                          backgroundColor: palette.surface,
                          borderColor: palette.border,
                          boxShadow: `0 16px 32px ${palette.glow}`
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logo.src}
                          alt={logo.name}
                          className="max-h-16 max-w-[80%] object-contain"
                        />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em]" style={{ color: palette.primary }}>
                {String(taglineLabel)}
              </p>
              <h3 className="mt-2 text-xl font-semibold" style={{ color: isDark ? "#f8fafc" : "#0f172a" }}>
                {String(subheadingLabel)}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold text-white"
                style={{ backgroundColor: palette.secondary }}
              >
                {String(ctaPrimaryLabel)}
              </span>
              <span
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: hexToRgba(palette.primary, isDark ? 0.24 : 0.16),
                  color: isDark ? "#e2e8f0" : "#0f172a"
                }}
              >
                {String(ctaSecondaryLabel)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
