import React from 'react';
import Hero from '../components/Hero';
import MaterialDisciplines from '../components/MaterialDisciplines';
import ProductDrop from '../components/ProductDrop';
import Philosophy from '../components/Philosophy';
import Testimonials from '../components/Testimonials';
import PatronsGallery from '../components/PatronsGallery';

export default function HomePage({ onExploreShop, onReadAbout, onAddToCart, onToggleWishlist, wishlistIds }) {
  return (
    <div className="flex flex-col w-full">
      {/* Editorial Hero Banner */}
      <Hero
        onExplore={onExploreShop}
        onReadEditorial={onReadAbout}
      />

      {/* Curated Category Quad Bento */}
      <MaterialDisciplines
        onSelectDiscipline={() => {
          onExploreShop();
        }}
      />

      {/* Seasonal Release Product Drops */}
      <div id="items-section">
        <ProductDrop
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          wishlistIds={wishlistIds}
        />
      </div>

      {/* Philosophy Banner */}
      <Philosophy />

      {/* Editorial Testimonials */}
      <Testimonials />

      {/* Community Patron Gallery */}
      <PatronsGallery />
    </div>
  );
}
