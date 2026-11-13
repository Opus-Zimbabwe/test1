export type BrandName = "facebook" | "youtube" | "tiktok" | "whatsapp" | "instagram";
export function BrandLogo({
  brand,
  className = "",
  size = 28,
}: {
  brand: BrandName;
  className?: string;
  size?: number;
}) {
  return (
    <img
      className={`gc-brandmark ${className}`}
      src={`/images/brands/${brand}.svg`}
      width={size}
      height={size}
      alt={`${brand === "tiktok" ? "TikTok" : brand === "youtube" ? "YouTube" : brand === "whatsapp" ? "WhatsApp" : brand[0]!.toUpperCase() + brand.slice(1)} logo`}
    />
  );
}
