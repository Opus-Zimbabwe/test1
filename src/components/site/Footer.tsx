import BeamWordmarkFooter from "@/components/ui/beam-wordmark-footer";
export function Footer() {
  return (
    <BeamWordmarkFooter
      brand="Great Couples"
      wordmark="Great Couples"
      company="Great Couples International Trust"
      background="#211027"
      accent="#e81957"
      ink="#fff9fc"
      muted="#b5a4be"
      wordTop="#763f8b"
      wordFoot="#28112f"
      wordWeight={900}
      fontSans="Nunito, Arial, sans-serif"
      cut={0.03}
      className="gc-beam-footer"
      socials={[
        {
          label: "Facebook",
          href: "https://www.facebook.com/share/1DMYvcv24u/?mibextid=wwXIfr",
          icon: <image href="/images/brands/facebook.svg" width="24" height="24" />,
        },
        {
          label: "YouTube",
          href: "https://youtube.com/@greatcouples",
          icon: <image href="/images/brands/youtube.svg" width="24" height="24" />,
        },
        {
          label: "TikTok",
          href: "https://www.tiktok.com/@greatcouplestrust",
          icon: <image href="/images/brands/tiktok.svg" width="24" height="24" />,
        },
        {
          label: "Instagram",
          href: "https://instagram.com/great.couplestrust",
          icon: <image href="/images/brands/instagram.svg" width="24" height="24" />,
        },
      ]}
      credits={[
        { label: "Building & Promoting Marriage Foundations." },
        { lead: "Designed & developed by ", label: "Opus Zimbabwe" },
      ]}
      columns={[
        {
          title: "Explore",
          links: [
            { label: "Our story", href: "#about" },
            { label: "Values", href: "#values" },
            { label: "Counselling", href: "#services" },
            { label: "Gallery", href: "#gallery" },
            { label: "Announcements", href: "#announcements" },
            { label: "Bookshop", href: "/store" },
          ],
        },
        {
          title: "Connect",
          links: [
            { label: "Podcast", href: "#podcast" },
            { label: "Social videos", href: "#videos" },
            { label: "WhatsApp groups", href: "#community" },
            { label: "Book a session", href: "#contact" },
            { label: "+263 777 308 726", href: "tel:+263777308726" },
            { label: "Email Great Couples", href: "mailto:greatcouplestrust@gmail.com" },
            { label: "15 Norwich Road, Eastlea, Harare", href: "#contact" },
          ],
        },
      ]}
    />
  );
}
