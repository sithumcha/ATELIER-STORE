import React from 'react';

export default function Hero({ onExplore, onReadEditorial }) {
  return (
    <section className="relative -mt-[116px] pt-[116px] w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-surface-container-low">
      {/* Background Cinematic Image with Subtle Parallax/Zoom */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out hover:scale-105"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBQjJaZbuuh0cdPj9n7SLQozd5AqsEn9oism6vFpYa6i5UcfNjUFoBIbLBSOHGXGZUmNCCURBNl8tHnOdzbZMfrM6-ji5DJpy0Zep5MF7g_fJ1wgN75o8i1bEoHj9oj7Lzp8TJbhMauesMa7aPMGXjgZZJV6VQ4CxarOFv-LmVSX_U9Vpq0Bs241lLwWMQFWgNnoiSgCTkDeiK-3ceL77auCIaZlEQybff-Vsx0cO1MVA3k9W_jqI8')",
        }}
      />

      {/* Scrim & Texture Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface/80 via-surface/20 to-transparent" />

      <div className="relative z-10 w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-3xl flex flex-col justify-end min-h-[80vh]">
        <div className="max-w-2xl flex flex-col items-start animate-fade-in-up">
          <div className="inline-flex items-center gap-space-xs px-3.5 py-1.5 rounded-full glass-panel shadow-sm mb-space-md animate-float">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="font-label-caps text-label-caps text-on-surface uppercase tracking-widest">
              Release 09 — Autumnal Solitude Home Decor
            </span>
          </div>

          <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-on-surface tracking-tight leading-[1.05] mb-space-md font-normal">
            Ceremonial Living <br className="hidden sm:inline" />
            <span className="italic font-normal font-display-hero text-secondary">&amp; Quiet Form</span>
          </h1>

          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-space-xl leading-relaxed">
            Tactile wabi-sabi simplicity harmonized with Scandinavian functional warmth. Sculptural ceramic vessels, washi lighting, and Hinoki wood decor crafted for quiet sanctuary.
          </p>

          <div className="flex flex-wrap items-center gap-space-md">
            <button
              onClick={onExplore}
              className="h-13 px-9 rounded-lg bg-primary text-on-primary font-label-md text-label-md tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all duration-300 hover:bg-secondary hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            >
              <span>Explore Collection</span>
              <span className="material-symbols-outlined text-lg transition-transform duration-300 group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
            <button
              onClick={onReadEditorial}
              className="h-13 px-8 rounded-lg glass-panel text-on-surface font-label-md text-label-md tracking-wider uppercase inline-flex items-center justify-center backdrop-blur-md transition-all duration-300 hover:bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Read Atelier Story
            </button>
          </div>
        </div>

        {/* Quick Scroll Indicator / Meta */}
        <div className="mt-space-3xl pt-space-lg flex items-center justify-between font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest border-t border-surface-variant/40">
          <div className="flex items-center gap-space-sm">
            <span className="w-8 h-[1px] bg-secondary" />
            <span>Kyoto · Stockholm · Copenhagen</span>
          </div>
          <div className="hidden sm:flex items-center gap-space-xs text-secondary font-bold">
            <span className="material-symbols-outlined text-sm animate-bounce">expand_more</span>
            <span>Scroll To Discover</span>
          </div>
        </div>
      </div>
    </section>
  );
}
