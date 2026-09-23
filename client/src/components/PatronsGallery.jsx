import React from 'react';

export default function PatronsGallery() {
  const images = [
    {
      handle: '@nordic_kyoto',
      alt: 'Sunlit morning tea setup with steam rising gently from a raw ceramic matcha chawan on a rustic raw wood windowsill overlooking a calm garden.',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD15GPmYKfw5Jw6y45g56OPI4vKFAdrMSeMC_qMGqHGt8DuN2AOrQjWekAFvcGwFF_wGuXU0U2qBSaSMVekR8uMgvdwqHlT3SOrJhSnU_ZsR0HjUuXkpZji80Ca3bZmXpiHvVrBUwbp_IoQCBO9OWwvjCzhhSITbfSWaaPfdoj5peF1NifAE7sducOQ3sx7EspJuzMylpCXRFLNEVNhB6EduOxqrg5m94oXyAquhrQX_EoLsOtQ1Dk',
      colSpan: '',
    },
    {
      handle: '@solstice.home',
      alt: 'A tranquil bedroom with washed natural flax sheets, soft sunlight through curtains, and a single sculptural stoneware vase on a floating oak nightstand.',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB72jVdKkHb7mdKJ8-Du65x00OoScMjXMMitWPZhIe0Z-LMHXC_bnICPeB62_cqBpq39AE11MS6T1z9YuiIKOkNbaVf1YoooRWb8oX-vkwY1WGPSWUMLGHokG7YboSnnqf6rzj_U6pvVz8pfwR9eTd1ZkbHDhj_n346IQWmIEc3Cj-z0-T2xUH4NzdjWqjNhBsthAN1VFKHPQoi1D1SnTEKRfrHyube-hTQXKudxg-t6T60ytP9Jj4',
      colSpan: '',
    },
    {
      handle: '@atelier_arch',
      alt: 'Danish modern dining table bathed in soft afternoon light, set with minimalist ceramic bowls, brass chopsticks, and an ikebana blossom arrangement.',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDr4h8IhuR8PKD9278ZdynOCbc9KM8eJBCyBvt9NeXXc-4snNj3TZ0NSu-HDbrYaXhUDuuXHqou0Dzyadls4dmStl96MTBwmSUQIHP7HYxU4yoyB29yQD_9YZGjUw3uFwX7RhGG5UEoC__rG-X3O1GPju4BRKvzH4YwBwnjWP-61a67t3Ry4Df2GX9GeaF0TuQESv9I3-tzsojrro1D9M7PklBqiYUSG-y6xhyR41UwUzAtzQv6_-Q',
      colSpan: '',
    },
    {
      handle: '@quietspaces',
      alt: 'Minimalist hinoki wood bathroom with natural gray river stone details and hanging linen waffle towels in soft ambient natural light.',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5KoRiPYuOu8YWxvIMuW50_vAbs5jVeFDC_Lm_EXt-WOhM2AN3bf4HugrFFfedi0I8WmVV2N4Ehu2V2hH5hkfqqild6tm7GtJspc16Zt0dHu14YdWpK21fnWB6ptyLsQyJm6-aqOaxEJw5x4muh-DJensbyEXTE7b5aV3GL5QOzrCVEF2Jkegl3DfBR0_zCXPi7NYndKyQKNwtXCLiUxpzJkv0_SYYLqADB5rkNwU3-oXmA12nqj0',
      colSpan: '',
    },
    {
      handle: '@matsuda_studio',
      alt: 'Sculptural paper lantern glowing in a darkened library room with dark timber bookshelves, casting rhythmic shadows on tatami mats.',
      src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDsgOZ2st_lqOEbBs-P0eWxx8Bd1XioMLXMty4S4Lur0Cb1x0YKb9xAXX2WKkGQFc3EVf5wthBNX0owLd5XQcxKrjV5EobHOJ2mSYkf9zqGwlS4x7PSsK_P4g-dr_6c5BC4mbdLT4AvVKwl0QvrTuHd7vtp5gcaNRRn5h4ULDyokBnCUOteueE1Q5TtSSqRXgwQ9dWFtrte4aE3S9oN0NPi4wTpPgPK9zVMPo_riCexvaBk3jwbZM',
      colSpan: 'col-span-2 md:col-span-1',
    },
  ];

  return (
    <section className="w-full max-w-max-width-editorial mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-space-3xl pb-space-2xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-space-xl">
        <div>
          <span className="font-label-caps text-label-caps uppercase text-secondary tracking-widest block mb-space-xxs">
            Sanctuaries &amp; Spaces
          </span>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Curated by our Patrons
          </h2>
        </div>
        <a
          className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-space-xs mt-space-xs sm:mt-0"
          href="https://instagram.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          @kurastudio.archive
          <span className="material-symbols-outlined text-[16px]">north_east</span>
        </a>
      </div>

      {/* 5-column Photo Mosaic Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-space-md">
        {images.map((item, idx) => (
          <div
            key={idx}
            className={`relative aspect-square rounded-lg overflow-hidden group bg-surface-container ${item.colSpan}`}
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              data-alt={item.alt}
              src={item.src}
              alt={item.handle}
            />
            <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-surface-container-lowest">
              <span className="font-label-caps text-[10px] tracking-widest uppercase">
                {item.handle}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
