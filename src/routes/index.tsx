import { createFileRoute } from "@tanstack/react-router";
import { EditorialHome } from "@/components/site/EditorialHome";

const ORGANIZATION_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Great Couples International Trust",
  alternateName: "Great Couples",
  description:
    "Christian faith-based organization offering couples counselling, marriage counselling, pre-marital counselling, marriage guidance and marriage advice through outreach and seminars across Africa and beyond.",
  keywords:
    "couples, marriage, marriage counselling, pre-marital counselling, marriage guidance, marriage advice, relationship guidance",
  email: "greatcouplestrust@gmail.com",
  sameAs: ["https://youtube.com/@greatcouples", "https://www.tiktok.com/@greatcouplestrust"],
});

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Great Couples International Trust — Building & Promoting Marriage Foundations" },
      {
        name: "description",
        content:
          "Christian faith-based marriage counselling, pre-marital counselling and community outreach across Africa. Book your session with Great Couples International Trust.",
      },
      {
        name: "keywords",
        content:
          "couples, marriage, marriage counselling, couples counselling, marriage guidance, marriage advice, pre-marital counselling, relationship guidance, relationship advice",
      },
      { property: "og:title", content: "Great Couples International Trust" },
      {
        property: "og:description",
        content: "Building & Promoting Marriage Foundations across Africa and beyond.",
      },
    ],
    scripts: [{ type: "application/ld+json", children: ORGANIZATION_JSON_LD }],
  }),
  component: Home,
});

function Home() {
  return <EditorialHome />;
}
