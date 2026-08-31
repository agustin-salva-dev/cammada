import { siteConfig } from "@/config/site";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TiktokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

interface SocialChannel {
  id: string;
  Icon: React.FC<{ size?: number }>;
  title: string;
  description: string;
  handle: string;
  url: string;
  isPrimary?: boolean;
}

const channels: SocialChannel[] = [
  {
    id: "instagram",
    Icon: InstagramIcon,
    title: "Instagram",
    description:
      "Seguinos en Instagram para ver fotos, videos de peleas, resultados en vivo y todo el detrás de escena de cada edición.",
    handle: "@cammada_fight_session",
    url: siteConfig.socialLinks.instagram,
    isPrimary: true,
  },
  {
    id: "youtube",
    Icon: YoutubeIcon,
    title: "YouTube",
    description:
      "Mirá las peleas completas, highlights y todo sobre cada edición de Cammada Fight Session en nuestro canal.",
    handle: "@cammadafightsession",
    url: siteConfig.socialLinks.youtube,
  },
  {
    id: "tiktok",
    Icon: TiktokIcon,
    title: "TikTok",
    description:
      "Clips cortos, momentos destacados y contenido exclusivo de nuestros eventos en formato TikTok.",
    handle: "@cammada24",
    url: siteConfig.socialLinks.tiktok,
  },
];

export function ContactInfoCards() {
  return (
    <section aria-label="Redes sociales de Cammada Fight Session">
      <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-2">
        Seguinos en redes
      </h2>
      <p className="text-sm text-muted-foreground mb-6">
        La forma más rápida de contactarnos es a través de nuestro Instagram.
        También podés encontrarnos en YouTube y TikTok.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const { Icon } = channel;
          return (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${channel.title} de Cammada Fight Session — ${channel.handle}`}
              className={`group flex flex-col gap-3 p-5 rounded-xl border transition-all duration-200 ${
                channel.isPrimary
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 sm:col-span-1"
                  : "border-border/50 bg-white/2 hover:bg-white/4 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    channel.isPrimary
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon size={16} />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold text-foreground">
                    {channel.title}
                  </h3>
                  {channel.isPrimary && (
                    <span className="text-[10px] font-medium text-primary uppercase tracking-wider">
                      Contacto principal
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {channel.description}
              </p>
              <span className="text-xs text-primary font-medium group-hover:underline transition-colors">
                {channel.handle}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
