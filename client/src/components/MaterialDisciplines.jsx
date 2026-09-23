import React from 'react';

export default function MaterialDisciplines({ onSelectDiscipline }) {
  return (
    <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-space-md">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
            Curated Ensembles
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Material Disciplines
          </h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Objects categorized by their foundational earthly material: unglazed clay, hand-loomed flax, cast brass, and charred ash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg">
        {/* Tile 1: Ceramics (7 cols) */}
        <div
          onClick={() => onSelectDiscipline && onSelectDiscipline('ceramics')}
          className="group relative md:col-span-7 h-[460px] rounded-xl overflow-hidden bg-surface-container-high flex flex-col justify-end p-space-xl card-hover-lift cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD-6e1ROmMJ6XVCbPmMl_5mv_5-gDFx6mPy5S_7xZAOvR3An838eW97XKL57n5n8NNzgcAuTSnhD_4Sv7QlN09BZWh929EF9q3NuRdRIDYjjUC76YKvXZCjvplqZ30pMuuWYJ79W7YeXW2Cez11fyHTMPiLw3zHC5cmHHoVr4RfHrHUTv4G1yP9AvfNNIl5UaZQOvHVvhtlu1texxbBtuFEmt8CA-Mh-d_JZ-2d4gaGAxP42G8mC08')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="relative z-10 text-surface-container-lowest flex items-end justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-surface-container-high block mb-1">
                Discipline 01
              </span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-1 group-hover:text-secondary-fixed transition-colors">
                Ceramics &amp; Vessels
              </h3>
              <p className="font-body-sm text-body-sm text-surface-container text-opacity-90 max-w-sm">
                Wood-fired stoneware and unglazed tea ware shaped in Shigaraki.
              </p>
            </div>
            <span className="w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-surface-container-lowest group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300 shadow-md">
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Tile 2: Interior Textiles (5 cols) */}
        <div
          onClick={() => onSelectDiscipline && onSelectDiscipline('linen')}
          className="group relative md:col-span-5 h-[460px] rounded-xl overflow-hidden bg-surface-container-high flex flex-col justify-end p-space-xl card-hover-lift cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAthd8vSxGxGODpmd2-_If77IJII9NagTzPVDZhNmkHrM8yVBbqTSfQ85X6fdGB7g7gxzz9ZxLYGstZu0gwHtDqBRiOCOKEfUHN-rR63wWWef4ClaMzS7B4xqkK3he11Z-Hxm08bTF_fqpjj881USTJc78illHUPNBigWnahODSE8hUuihUm7urwt_Zw2wNLNkoKEisppEgEtptrHW2E21fxq_3jclunIKrU-j0URDY3qECtiNLvXs')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="relative z-10 text-surface-container-lowest flex items-end justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-surface-container-high block mb-1">
                Discipline 02
              </span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-1 group-hover:text-secondary-fixed transition-colors">
                Interior Textiles &amp; Drapes
              </h3>
              <p className="font-body-sm text-body-sm text-surface-container text-opacity-90 max-w-xs">
                Unbleached European flax throws, table drapes, and cushion covers.
              </p>
            </div>
            <span className="w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-surface-container-lowest group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300 shadow-md">
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Tile 3: Architectural Lighting (5 cols) */}
        <div
          onClick={() => onSelectDiscipline && onSelectDiscipline('lighting')}
          className="group relative md:col-span-5 h-[460px] rounded-xl overflow-hidden bg-surface-container-high flex flex-col justify-end p-space-xl card-hover-lift cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMgqJpWKGQ2mWK5uu5YxyqC2H0HLnvIcUu8vEvl99icC8RHY30IcVrl7ASgdZJrg-RUSXivyBkl5uRvw68fZbsqYrtVR3He62uFserOiNrBG2sVIJ2Uvh9JoOTzUi5gkrViUu06izL2qL9EMBkiIMZJqUmfSmXCYOPwdq5cBAVL5A6WqF8OiSlPLVrFbJ-p6tadEIYUnpwu0m9FVFd-l_457vAtTym0E7NwgozEtQpzY3PZ6nkwxk')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="relative z-10 text-surface-container-lowest flex items-end justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-surface-container-high block mb-1">
                Discipline 03
              </span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-1 group-hover:text-secondary-fixed transition-colors">
                Architectural Lighting
              </h3>
              <p className="font-body-sm text-body-sm text-surface-container text-opacity-90 max-w-xs">
                Mulberry washi paper fixtures casting calm, diffused luminescence.
              </p>
            </div>
            <span className="w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-surface-container-lowest group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300 shadow-md">
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
            </span>
          </div>
        </div>

        {/* Tile 4: Sculptural Furniture (7 cols) */}
        <div
          onClick={() => onSelectDiscipline && onSelectDiscipline('furniture')}
          className="group relative md:col-span-7 h-[460px] rounded-xl overflow-hidden bg-surface-container-high flex flex-col justify-end p-space-xl card-hover-lift cursor-pointer"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAlQAz7BQ9_Bm3auw-jbIhPV--EEbfdNX4NN7O5xJChZI3NsaEWcxew_howubHslS3o0ZgipMFcDKZeKSdUw-NSbxXak9-qLmrv3gksOqsCDfZsX8jNhm17tkaM-rjvCss-gZl8CJ1uVkpH3pXJP6oRDCb54ktCYq9BJnZS7EQIyYIMJeGLyDB_o22AbQltPGojlUREJiNLoiWEtAQDFJ6b79WM1vUrXW2fhUvfBIVJ_a0IqHdEYoU')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
          <div className="relative z-10 text-surface-container-lowest flex items-end justify-between">
            <div>
              <span className="font-label-caps text-label-caps uppercase tracking-widest text-surface-container-high block mb-1">
                Discipline 04
              </span>
              <h3 className="font-headline-md text-headline-md text-surface-container-lowest mb-1 group-hover:text-secondary-fixed transition-colors">
                Sculptural Furniture
              </h3>
              <p className="font-body-sm text-body-sm text-surface-container text-opacity-90 max-w-sm">
                Danish joinery meets Japanese proportions in sustainably felled timber.
              </p>
            </div>
            <span className="w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md flex items-center justify-center text-surface-container-lowest group-hover:bg-secondary group-hover:text-on-secondary transition-all duration-300 shadow-md">
              <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:translate-x-0.5">arrow_forward</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
