import { ArrowUpRight } from "lucide-react";
import { PHOTOS } from "./assets";
import faceToFace from "@/assets/gc/service-facetoface.jpg.asset.json";
const services = [
  {
    title: "Marriage Counselling",
    body: "Private, judgement-free support to reconnect, rebuild trust and enjoy your marriage.",
    img: PHOTOS[3],
    alt: "A couple at a Great Couples gathering",
  },
  {
    title: "Pre-Marital Counselling",
    body: "Practical, biblical preparation for the life you’re about to build together.",
    img: PHOTOS[1],
    alt: "Great Couples community members celebrating together",
  },
  {
    title: "Face to Face & Online",
    body: "In person at our Harare HQ or online — wherever you are, we meet you there.",
    img: faceToFace.url,
    alt: "A comfortable space for conversation and support",
  },
];
export function Services() {
  return (
    <section id="services" className="gc-reference-services">
      <div className="gc-services-heading">
        <h2>Care for every season.</h2>
      </div>
      <div className="gc-reference-grid">
        {services.map((service) => (
          <article className="gc-reference-card" key={service.title}>
            <div className="gc-card-title">
              <h3>{service.title}</h3>
              <a href="#contact" aria-label={`Enquire about ${service.title}`}>
                <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="gc-card-photo">
              <img src={service.img} alt={service.alt} loading="lazy" />
              <div className="gc-card-description">
                <p>{service.body}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <a className="gc-services-contact" href="tel:+263777308726">
        Book your session · +263 777 308 726
      </a>
    </section>
  );
}
