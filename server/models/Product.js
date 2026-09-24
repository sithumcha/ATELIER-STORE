// Product Database Model
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    summary: { type: String, default: '' },
    price: { type: Number, required: true },
    stock: { type: Number, default: 50 },
    badge: { type: String, default: 'Limited Edition' },
    badgeClass: { type: String, default: '' },
    img: { type: String, required: true },
    images: { type: Array, default: [] },
    studio: { type: String, default: 'Kyoto Studio' },
    edition: { type: String, default: 'EDITION 08 — ITEM 044' },
    editionName: { type: String, default: 'EDITION 08 — THE SOLITUDE WEAVES' },
    shuttle: { type: String, default: 'KYOTO WEAVE SHUTTLE NO. 4' },
    gsm: { type: String, default: '410 GSM RAW UNBLEACHED FLAX' },
    density: { type: String, default: '410 GSM density' },
    colors: { type: Array, default: [] },
    sizes: { type: Array, default: [] },
    provenance: { type: String, default: '' },
    loomOrigin: { type: String, default: '' },
    weavingSpeed: { type: String, default: '' },
    measurements: { type: Array, default: [] },
    careProtocol: { type: String, default: '' },
    passportInfo: { type: String, default: '' },
    finishes: { type: Array, default: [] },
    capacities: { type: Array, default: [] },
    craftProvenance: { type: String, default: '' },
    carePreservation: { type: String, default: '' },
  },
  {
    timestamps: true,
    strict: false,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;

