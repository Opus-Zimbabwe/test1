import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ArrowDown, Plus, Eye, EyeOff, Loader2, ExternalLink } from "lucide-react";
import { useSiteExperience } from "@/lib/use-site-experience";
import {
  DEFAULT_EXPERIENCE,
  heroShapes,
  siteExperienceSchema,
  type HeroSlide,
  type SiteExperience,
} from "@/lib/site-experience";
import { saveSiteExperience } from "@/lib/site-admin.functions";
import { HERO_PATHS } from "./hero-shapes";
import "./admin-experience.css";
const shapeNames = {
  embrace: "Interlocking diagonals",
  diagonal: "Sweeping diagonal",
  arch: "Architectural cut",
  ribbon: "Folded diagonal",
};
export function AdminExperience() {
  const { data, settings, refetch } = useSiteExperience();
  const save = useServerFn(saveSiteExperience);
  const cache = useQueryClient();
  const [draft, setDraft] = useState<SiteExperience | null>(null);
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<"hero" | "availability">("hero");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [recovery, setRecovery] = useState<SiteExperience | null>(null);
  const [localStatus, setLocalStatus] = useState("");
  const value = draft || settings;
  const slide = value.heroSlides[Math.min(selected, value.heroSlides.length - 1)]!;
  const available = !!data?.available;
  useEffect(() => {
    try {
      const raw = localStorage.getItem("gc-experience-draft-v1");
      if (raw) {
        const parsed = siteExperienceSchema.safeParse(JSON.parse(raw));
        if (parsed.success) setRecovery(parsed.data);
      }
    } catch {
      /* Device storage is optional. */
    }
  }, []);
  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("gc-experience-draft-v1", JSON.stringify(draft));
        setLocalStatus("Draft saved on this device.");
      } catch {
        setLocalStatus("Device draft storage is unavailable.");
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [draft]);
  const updateSlide = (changes: Partial<HeroSlide>) => {
    setDraft({
      ...value,
      heroSlides: value.heroSlides.map((item, i) =>
        i === selected ? { ...item, ...changes } : item,
      ),
    });
    setNotice("");
  };
  const move = (index: number, direction: number) => {
    const next = [...value.heroSlides];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target]!, next[index]!];
    setDraft({ ...value, heroSlides: next });
    setSelected(target);
  };
  async function publish(
    next: SiteExperience,
    section: "hero" | "availability" | "message" = "hero",
  ) {
    setError("");
    setNotice("");
    const parsed = siteExperienceSchema.safeParse(next);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || "Check the slide fields.");
      return;
    }
    setBusy(true);
    try {
      await save({
        data: {
          passcode: sessionStorage.getItem("gc_site_admin") || "",
          settings: parsed.data,
          section,
        },
      });
      await cache.invalidateQueries({ queryKey: ["site-experience"] });
      setDraft(null);
      try {
        localStorage.removeItem("gc-experience-draft-v1");
      } catch {
        /* Device storage is optional. */
      }
      setLocalStatus("");
      setNotice("Website settings saved. Public pages refresh within 30 seconds.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save website settings.");
    } finally {
      setBusy(false);
    }
  }
  const switchAvailability = async (enabled: boolean) => {
    if (
      !confirm(
        enabled
          ? "Turn off the entire public test website, including checkout and receipts? Protected admin recovery stays available."
          : "Restore public access to the test website?",
      )
    )
      return;
    await publish(
      {
        ...settings,
        maintenance: { ...settings.maintenance, message: value.maintenance.message, enabled },
      },
      "availability",
    );
  };
  return (
    <section className="gc-experience-admin">
      <div className="gc-admin-video-heading">
        <div>
          <h2>Website controls</h2>
          <p>Your opening story and the availability of this test website.</p>
        </div>
        <a className="gc-admin-refresh" href="/" target="_blank" rel="noopener noreferrer">
          View website <ExternalLink size={17} />
        </a>
      </div>
      <div className="gc-experience-tabs" role="group" aria-label="Website control section">
        <button aria-pressed={tab === "hero"} onClick={() => setTab("hero")}>
          Hero carousel
        </button>
        <button aria-pressed={tab === "availability"} onClick={() => setTab("availability")}>
          Site availability
        </button>
      </div>
      {data && !available && (
        <div className="gc-admin-video-warning" role="status">
          <strong>Controls are waiting for database setup.</strong>
          <p>
            The new site_experience migration must be applied before changes can be published. Your
            drafts remain on this device. Public access has not been changed.
          </p>
          <button onClick={() => refetch()}>Recheck setup</button>
        </div>
      )}
      {error && (
        <p className="gc-admin-video-warning" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="gc-admin-video-notice" role="status">
          {notice}
        </p>
      )}
      {recovery && (
        <div className="gc-experience-recovery">
          A saved draft is available.
          <button
            onClick={() => {
              setDraft(recovery);
              setRecovery(null);
              setSelected(0);
            }}
          >
            Restore draft
          </button>
          <button onClick={() => setRecovery(null)}>Dismiss</button>
        </div>
      )}
      {tab === "hero" ? (
        <>
          <div className="gc-experience-editor">
            <div className="gc-experience-slide-list" aria-label="Hero slides">
              {value.heroSlides.map((item, i) => (
                <div className={selected === i ? "selected" : ""} key={item.id}>
                  <button
                    className="gc-experience-slide-select"
                    aria-pressed={selected === i}
                    onClick={() => setSelected(i)}
                  >
                    <img src={item.image} alt="" />
                    <span>
                      {item.title}
                      <small>{item.active ? "Visible" : "Hidden"}</small>
                    </span>
                  </button>
                  <div className="gc-experience-slide-tools">
                    <button
                      aria-label={`Move slide ${i + 1} up`}
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                    >
                      <ArrowUp size={17} />
                    </button>
                    <button
                      aria-label={`Move slide ${i + 1} down`}
                      disabled={i === value.heroSlides.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      <ArrowDown size={17} />
                    </button>
                    <button
                      aria-label={`${item.active ? "Hide" : "Show"} slide ${i + 1}`}
                      onClick={() =>
                        setDraft({
                          ...value,
                          heroSlides: value.heroSlides.map((entry, j) =>
                            i === j ? { ...entry, active: !entry.active } : entry,
                          ),
                        })
                      }
                    >
                      {item.active ? <Eye size={17} /> : <EyeOff size={17} />}
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="gc-admin-refresh"
                disabled={value.heroSlides.length >= 10}
                onClick={() => {
                  setDraft({
                    ...value,
                    heroSlides: [
                      ...value.heroSlides,
                      {
                        ...DEFAULT_EXPERIENCE.heroSlides[0]!,
                        id: crypto.randomUUID(),
                        title: "Your next story",
                        emphasis: "story",
                      },
                    ],
                  });
                  setSelected(value.heroSlides.length);
                }}
              >
                <Plus size={18} />
                Add slide
              </button>
            </div>
            <div className="gc-experience-slide-form">
              <div className="gc-experience-preview" aria-label="Selected hero slide preview">
                <svg viewBox="0 0 1 1" preserveAspectRatio="none" width="0" height="0">
                  <defs>
                    <clipPath id="gc-settings-preview-clip" clipPathUnits="objectBoundingBox">
                      <path d={HERO_PATHS[slide.shape]} />
                    </clipPath>
                  </defs>
                </svg>
                <img
                  src={slide.image}
                  alt=""
                  style={{ clipPath: "url(#gc-settings-preview-clip)" }}
                />
                <strong>{slide.title}</strong>
              </div>
              <label>
                Heading
                <textarea
                  aria-label="Heading"
                  rows={2}
                  maxLength={100}
                  value={slide.title}
                  onChange={(e) => updateSlide({ title: e.target.value })}
                />
              </label>
              <label>
                Textured words
                <input
                  aria-label="Textured words"
                  value={slide.emphasis}
                  onChange={(e) => updateSlide({ emphasis: e.target.value })}
                />
              </label>
              <label>
                Description
                <textarea
                  aria-label="Hero description"
                  rows={3}
                  maxLength={250}
                  value={slide.body}
                  onChange={(e) => updateSlide({ body: e.target.value })}
                />
              </label>
              <label>
                Photograph URL
                <input
                  aria-label="Photograph URL"
                  value={slide.image}
                  onChange={(e) => updateSlide({ image: e.target.value })}
                />
              </label>
              <label>
                Shape
                <select
                  aria-label="Hero shape"
                  value={slide.shape}
                  onChange={(e) => updateSlide({ shape: e.target.value as HeroSlide["shape"] })}
                >
                  {heroShapes.map((shape) => (
                    <option key={shape} value={shape}>
                      {shapeNames[shape]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="gc-experience-save">
            <p role="status">{localStatus || "Changes stay in draft until you publish."}</p>
            <button
              className="gc-admin-primary"
              disabled={!available || busy || !draft}
              onClick={() => publish({ ...settings, heroSlides: value.heroSlides })}
            >
              {busy ? <Loader2 className="animate-spin" size={17} /> : null}Publish hero changes
            </button>
          </div>
        </>
      ) : (
        <div className="gc-site-availability">
          <div className={settings.maintenance.enabled ? "is-offline" : "is-online"}>
            <span />
            <strong>
              {settings.maintenance.enabled
                ? "Public website is turned off"
                : "Public website is available"}
            </strong>
          </div>
          <p>
            This turns off every public page of the test website, including checkout and receipts.
            Only protected administration stays available.
          </p>
          <label>
            Message visitors will see
            <textarea
              rows={3}
              maxLength={300}
              value={value.maintenance.message}
              onChange={(e) =>
                setDraft({
                  ...value,
                  maintenance: { ...value.maintenance, message: e.target.value },
                })
              }
            />
          </label>
          <div className="gc-availability-preview">
            <h3>We’ll be back soon.</h3>
            <p>{value.maintenance.message}</p>
          </div>
          <button
            className="gc-admin-refresh"
            disabled={
              !available || busy || value.maintenance.message === settings.maintenance.message
            }
            onClick={() =>
              publish(
                {
                  ...settings,
                  maintenance: { ...settings.maintenance, message: value.maintenance.message },
                },
                "message",
              )
            }
          >
            Save visitor message
          </button>
          <button
            className={settings.maintenance.enabled ? "gc-admin-primary" : "gc-maintenance-danger"}
            disabled={!available || busy}
            onClick={() => switchAvailability(!settings.maintenance.enabled)}
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : null}
            {settings.maintenance.enabled ? "Turn website back on" : "Turn off public website"}
          </button>
          <p className="gc-admin-draft-status">
            A confirmation is required. Nothing is deleted, and the original website is unaffected.
          </p>
        </div>
      )}
    </section>
  );
}
