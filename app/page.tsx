/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import { ArrowUpRight } from "lucide-react";
import TimeTravelButton from "@/components/time-travel-button";

// Lightweight inline markdown renderer to avoid depending on `react-markdown` typings
function SimpleMarkdown({ children }: { children: string }) {
  return (
    <div>
      {children.split("\n\n").map((para, idx) => (
        <p key={idx} className="m-0">
          {para.split("\n").reduce((acc: any[], line, i) => {
            if (i > 0) acc.push(<br key={i} />);
            acc.push(line);
            return acc;
          }, [])}
        </p>
      ))}
    </div>
  );
}

const BLUR_FADE_DELAY = 0.04;

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w) && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

const rowClass = "flex items-center gap-x-3 justify-between group";

// Only wrap the row in a link when there's somewhere to go — an empty href
// with target="_blank" just opens a blank copy of the page.
function EducationRow({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={rowClass}>{children}</div>;
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" className={rowClass}>
      {children}
    </Link>
  );
}

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <TimeTravelButton />
      {/* HERO */}
      <section id="hero">
        <div className="mx-auto w-full max-w-4xl space-y-8">
          <div className="gap-2 gap-y-6 flex flex-col md:flex-row justify-between">
            <div className="gap-2 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-4xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[600px] md:text-lg lg:text-xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
            </div>

            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-24 md:size-32 border rounded-full shadow-lg ring-4 ring-muted">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <SimpleMarkdown>{DATA.summary}</SimpleMarkdown>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* WORK */}
      <section id="work">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 5}>
            <h2 className="text-xl font-bold">Work Experience</h2>
          </BlurFade>

          <BlurFade delay={BLUR_FADE_DELAY * 6}>
            <WorkSection />
          </BlurFade>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-y-6">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <h2 className="text-xl font-bold">Education</h2>
          </BlurFade>

          <div className="flex flex-col gap-8">
            {DATA.education.map((education, index) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 8 + index * 0.05}
              >
                <EducationRow href={education.href}>
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    {education.logoUrl ? (
                      <img
                        src={education.logoUrl}
                        alt={education.school}
                        className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none"
                      />
                    ) : (
                      <div className="size-8 md:size-10 border rounded-full shadow ring-2 ring-border bg-muted flex-none flex items-center justify-center text-[10px] md:text-xs font-semibold text-muted-foreground">
                        {initialsOf(education.school)}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {education.school}
                        {education.href && (
                        <ArrowUpRight
                          className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                          aria-hidden
                        />
                        )}
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {education.degree}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                    <span>
                      {education.start} - {education.end}
                    </span>
                  </div>
                </EducationRow>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills">
        <div className="mx-auto w-full max-w-4xl flex flex-col gap-y-4">
          <BlurFade delay={BLUR_FADE_DELAY * 9}>
            <h2 className="text-xl font-bold">Skills</h2>
          </BlurFade>

          <div className="flex flex-wrap gap-2">
            {DATA.skills.map((skill, id) => (
              <BlurFade
                key={skill.name}
                delay={BLUR_FADE_DELAY * 10 + id * 0.05}
              >
                <div className="border bg-background border-border ring-2 ring-border/20 rounded-xl h-8 w-fit px-4 flex items-center gap-2">
                  {skill.icon && (
                    <skill.icon className="size-4 rounded overflow-hidden object-contain" />
                  )}
                  <span className="text-foreground text-sm font-medium">
                    {skill.name}
                  </span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects">
        <div className="mx-auto w-full max-w-4xl">
          <BlurFade delay={BLUR_FADE_DELAY * 11}>
            <ProjectsSection />
          </BlurFade>
        </div>
      </section>

      {/* HACKATHONS — only rendered once there are entries in DATA.hackathons */}
      {DATA.hackathons.length > 0 && (
        <section id="hackathons">
          <div className="mx-auto w-full max-w-4xl">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <HackathonsSection />
            </BlurFade>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact">
        <div className="mx-auto w-full max-w-2xl">
          <BlurFade delay={BLUR_FADE_DELAY * 16}>
            <ContactSection />
          </BlurFade>
        </div>
      </section>
    </main>

  );
}
