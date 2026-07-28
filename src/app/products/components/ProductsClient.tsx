'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const ALL_PRODUCTS = [
  { id: 1, name: 'Linen Blazer — Oat', price: 200, originalPrice: 240, rating: 4.8, reviews: 312, badge: 'Bestseller', category: 'Women', inStock: true, sizes: ['XS', 'S', 'M', 'L'], colors: ['Oat', 'Black'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_1532036f0-1772156814358.png", alt: 'Cream linen blazer on a wooden hanger, soft natural light' },
  { id: 2, name: 'Merino Crew Knit', price: 95, originalPrice: null, rating: 4.6, reviews: 184, badge: 'New', category: 'Men', inStock: true, sizes: ['S', 'M', 'L', 'XL'], colors: ['Navy', 'Grey', 'Oat'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a357bb65-1772068050775.png", alt: 'Navy merino crewneck sweater folded on light wood, clean studio' },
  { id: 3, name: 'Canvas Mini Dress', price: 128, originalPrice: 160, rating: 4.7, reviews: 97, badge: 'Sale', category: 'Women', inStock: false, sizes: ['XS', 'S', 'M'], colors: ['Beige', 'White'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_101604cc4-1772977891450.png", alt: 'Woman in beige canvas mini dress in sunlit studio' },
  { id: 4, name: 'Kids Stripe Tee Set', price: 48, originalPrice: null, rating: 4.9, reviews: 221, badge: 'Popular', category: 'Children', inStock: true, sizes: ['2T', '3T', '4T', '5T'], colors: ['Multi'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_164ae6a30-1783930456471.png", alt: "Colorful striped children\'s tee and shorts on white background" },
  { id: 5, name: 'Tailored Chino', price: 115, originalPrice: null, rating: 4.5, reviews: 143, badge: null, category: 'Men', inStock: true, sizes: ['28', '30', '32', '34', '36'], colors: ['Khaki', 'Navy', 'Olive'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f83aa4fa-1764678418915.png", alt: 'Slim-fit khaki chino trousers flat-laid on white surface' },
  { id: 6, name: 'Silk Slip Skirt', price: 142, originalPrice: 185, rating: 4.8, reviews: 76, badge: 'Sale', category: 'Women', inStock: true, sizes: ['XS', 'S', 'M', 'L'], colors: ['Ivory', 'Black', 'Blush'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_171ac4b1c-1772176293324.png", alt: 'Ivory silk midi slip skirt on minimalist rack, soft studio lighting' },
  { id: 7, name: 'Oversized Oxford Shirt', price: 82, originalPrice: null, rating: 4.4, reviews: 209, badge: null, category: 'Women', inStock: true, sizes: ['XS', 'S', 'M', 'L', 'XL'], colors: ['White', 'Blue', 'Pink'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_18bc962c1-1772686419505.png", alt: 'White oversized oxford button-up shirt hanging against white wall' },
  { id: 8, name: 'Wool Overcoat', price: 345, originalPrice: 420, rating: 4.9, reviews: 88, badge: 'Bestseller', category: 'Men', inStock: false, sizes: ['S', 'M', 'L', 'XL'], colors: ['Camel', 'Charcoal'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d64d754b-1772159270750.png", alt: 'Camel wool overcoat on wooden hanger against warm-toned wall' },
  { id: 9, name: 'Kids Puffer Jacket', price: 64, originalPrice: null, rating: 4.7, reviews: 156, badge: 'New', category: 'Children', inStock: true, sizes: ['2T', '3T', '4T', '5T', '6'], colors: ['Red', 'Blue', 'Yellow'], image: "https://images.unsplash.com/photo-1612172897925-ae0e55670dfb", alt: "Bright red children's puffer jacket on white background, cheerful" },
  { id: 10, name: 'Satin Cami Top', price: 58, originalPrice: 75, rating: 4.6, reviews: 134, badge: 'Sale', category: 'Women', inStock: true, sizes: ['XS', 'S', 'M', 'L'], colors: ['Champagne', 'Black', 'Sage'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_19a4c2324-1772324673218.png", alt: 'Champagne satin cami top on minimalist white hanger, elegant studio' },
  { id: 11, name: 'Denim Trucker Jacket', price: 135, originalPrice: null, rating: 4.5, reviews: 198, badge: null, category: 'Men', inStock: true, sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: ['Indigo', 'Black'], image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b01a0cd9-1772686417649.png", alt: 'Classic indigo denim trucker jacket on a rack, bright studio' },
  { id: 12, name: 'Kids Floral Dress', price: 52, originalPrice: 65, rating: 4.8, reviews: 93, badge: 'Sale', category: 'Children', inStock: false, sizes: ['2T', '3T', '4T', '5T'], colors: ['Pink', 'Yellow'], image: "https://images.unsplash.com/photo-1517840035140-2d32eeb59190", alt: "Colorful floral children's dress on white background, bright and cheerful" }
];

const CATEGORIES = ['All', 'Women', 'Men', 'Children'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Top Rated', value: 'rating' }
];

const badgeColors: Record<string, string> = {
  Bestseller: 'bg-accent text-white',
  New: 'bg-primary text-white',
  Sale: 'bg-red-500 text-white',
  Popular: 'bg-emerald-600 text-white'
};

interface CartToast { id: number; name: string; }

export default function ProductsClient() {
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [priceMax, setPriceMax] = useState(500);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState<CartToast | null>(null);

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (category !== 'All') list = list.filter((p) => p.category === category);
    if (search.trim()) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    list = list.filter((p) => p.price <= priceMax);
    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, search, priceMax]);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const addToCart = (product: typeof ALL_PRODUCTS[0]) => {
    if (!product.inStock) return;
    setCart((prev) => [...prev, product.id]);
    setToast({ id: product.id, name: product.name });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="mb-8 animate-in">
        <span className="label-tag text-accent mb-2 block">ThreadHaus</span>
        <h1 className="text-4xl font-bold text-foreground tracking-tight">Shop All</h1>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-in-delay-1">
        <div className="relative flex-1">
          <Icon name="MagnifyingGlassIcon" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search styles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10" />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field w-full sm:w-48">
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <button
          onClick={() => setFiltersOpen(!filtersOpen)}
          className="btn-outline flex-shrink-0">
          <Icon name="AdjustmentsHorizontalIcon" size={16} />
          Filters
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1 animate-in-delay-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              category === cat
                ? 'bg-accent text-white' :'bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}>
            {cat}
          </button>
        ))}
        <span className="label-tag text-muted-foreground ml-auto flex-shrink-0">
          {filtered.length} results
        </span>
      </div>

      <div className="flex gap-6">
        {/* Filter Sidebar */}
        {filtersOpen && (
          <aside className="w-56 flex-shrink-0 space-y-6 animate-slide-in-left">
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-foreground text-sm">Price Range</h3>
              <div>
                <input
                  type="range"
                  min={20}
                  max={500}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-accent" />
                <div className="flex justify-between label-tag text-muted-foreground mt-1">
                  <span>$20</span>
                  <span>${priceMax}</span>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-foreground text-sm">Category</h3>
              {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={category === cat}
                    onChange={() => setCategory(category === cat ? 'All' : cat)}
                    className="accent-accent" />
                  <span className="text-sm text-foreground">{cat}</span>
                </label>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-foreground text-sm">Availability</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-accent" />
                <span className="text-sm text-foreground">In Stock Only</span>
              </label>
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div key={product.id} className="group relative bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col">
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Link href={`/product-detail?id=${product.id}`}>
                  <AppImage
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                </Link>

                {/* Out of Stock Overlay */}
                {!product.inStock && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-foreground text-primary-foreground text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                      Out of Stock
                    </span>
                  </div>
                )}

                {product.badge && (
                  <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase z-20 ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </span>
                )}

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full glass-card flex items-center justify-center z-20 hover:scale-110 transition-transform">
                  <Icon
                    name="HeartIcon"
                    variant={wishlist.includes(product.id) ? 'solid' : 'outline'}
                    size={14}
                    className={wishlist.includes(product.id) ? 'text-red-500' : 'text-foreground'} />
                </button>
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="label-tag text-muted-foreground mb-0.5">{product.category}</p>
                <Link href={`/product-detail?id=${product.id}`}>
                  <h3 className="font-semibold text-foreground text-sm leading-snug mb-1 hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="StarIcon" variant="solid" size={9}
                      className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
                  ))}
                  <span className="text-[9px] text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-foreground text-sm">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-[11px] text-muted-foreground line-through">${product.originalPrice}</span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-1.5">
                  {product.inStock ? (
                    <>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-[10px] font-semibold hover:bg-accent hover:text-white hover:border-accent transition-all">
                          <Icon name="ShoppingBagIcon" size={11} />
                          Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                            wishlist.includes(product.id)
                              ? 'bg-red-50 border-red-200 text-red-500' :'border-border text-muted-foreground hover:border-red-300 hover:text-red-400'
                          }`}>
                          <Icon name="HeartIcon" variant={wishlist.includes(product.id) ? 'solid' : 'outline'} size={11} />
                        </button>
                      </div>
                      <Link
                        href={`/checkout?buy=${product.id}`}
                        className="flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-accent text-white text-[10px] font-bold uppercase tracking-wider hover:bg-accent-dark transition-all">
                        <Icon name="BoltIcon" size={11} />
                        Buy Now
                      </Link>
                    </>
                  ) : (
                    <button
                      disabled
                      className="w-full py-1.5 rounded-lg bg-muted border border-border text-muted-foreground text-[10px] font-semibold cursor-not-allowed">
                      Out of Stock
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="bg-foreground text-primary-foreground px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Icon name="CheckCircleIcon" size={18} className="text-accent" />
            <span className="text-sm font-medium">{toast.name} added to cart</span>
          </div>
        </div>
      )}
    </div>
  );
}
