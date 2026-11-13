import { useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Expand, X } from "lucide-react";
import { clipEmbed, clipLink, type MediaClip } from "./media";
export function VideoDialog({ clip, onClose }: { clip: MediaClip | null; onClose: () => void }) {
  const player = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  return (
    <Dialog.Root
      open={!!clip}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setMessage("");
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="gc-dialog-overlay" />
        <Dialog.Content className="gc-dialog gc-cinema-dialog">
          <div className="gc-cinema-toolbar">
            <Dialog.Title>{clip?.title || "Great Couples video"}</Dialog.Title>
            <div>
              <button
                onClick={async () => {
                  try {
                    await player.current?.requestFullscreen();
                  } catch {
                    setMessage(
                      "Fullscreen is unavailable in this browser. Continue watching here.",
                    );
                  }
                }}
                aria-label="Fullscreen video"
              >
                <Expand size={19} />
              </button>
              <Dialog.Close aria-label="Close video player">
                <X size={22} />
              </Dialog.Close>
            </div>
          </div>
          <Dialog.Description className="sr-only">
            Watch here, or use the original video link if playback is unavailable.
          </Dialog.Description>
          <div
            ref={player}
            className={`gc-player ${clip?.platform === "tiktok" ? "gc-player-portrait" : ""}`}
          >
            {clip && (
              <iframe
                title={clip.title}
                src={clipEmbed(clip)}
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
          {clip && (
            <a
              className="gc-player-fallback"
              href={clipLink(clip)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open original video if playback is unavailable ↗
            </a>
          )}
          {message && <p role="status">{message}</p>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
