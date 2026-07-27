'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const product = {
  id: 1,
  name: 'Linen Blazer — Oat',
  price: 189,
  originalPrice: 240,
  rating: 4.8,
  reviews: 312,
  category: 'Women',
  description: 'Cut from a premium European linen blend, this blazer combines structure with a relaxed, lived-in feel. The unlined construction keeps it breathable for warm-weather dressing, while the clean shoulder line and single-button fastening give it a polished edge. Wear it over a silk cami for evening or thrown over a white tee on weekends.',
  details: ['100% European Linen', 'Unlined construction', 'Single-button fastening', 'Two flap pockets', 'Dry clean recommended', 'Model is 5\'9" wearing size S'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: [
  { name: 'Oat', hex: '#D4C5A9' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Sage', hex: '#8FAF8A' }],

  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1532036f0-1772156814358.png", alt: 'Cream linen blazer front view on wooden hanger, soft natural daylight' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1922b3057-1772086951470.png", alt: 'Woman wearing linen blazer in sunlit interior, warm neutral tones' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_16c73f3ba-1772187682609.png", alt: 'Close-up of blazer fabric texture and lapel detail, natural light' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_12cd3d94a-1778627190983.png", alt: 'Woman in blazer walking in a bright outdoor setting, editorial style' }]

};

const reviews = [
{ name: 'Meredith K.', rating: 5, date: 'July 2026', text: 'Absolutely obsessed. The linen is so much nicer than I expected — drapes beautifully and isn\'t stiff at all.', verified: true },
{ name: 'Priya S.', rating: 5, date: 'June 2026', text: 'Runs true to size. Wore it to a summer wedding and got so many compliments. The Oat color is stunning in person.', verified: true },
{ name: 'James T.', rating: 4, date: 'May 2026', text: 'Bought for my wife — she loves it. Only minor note is that the sleeves could be slightly longer.', verified: true }];


const relatedProducts = [
{ id: 3, name: 'Canvas Mini Dress', price: 128, image: "https://img.rocket.new/generatedImages/rocket_gen_img_101604cc4-1772977891450.png", alt: 'Woman in beige canvas mini dress in sunlit studio' },
{ id: 6, name: 'Silk Slip Skirt', price: 142, image: "https://img.rocket.new/generatedImages/rocket_gen_img_101673a3b-1773139451918.png", alt: 'Ivory silk midi slip skirt on minimalist rack' },
{ id: 10, name: 'Satin Cami Top', price: 58, image: "https://img.rocket.new/generatedImages/rocket_gen_img_1b8c507ae-1772393116567.png", alt: 'Champagne satin cami top on minimalist white hanger' },
{ id: 7, name: 'Oversized Oxford Shirt', price: 82, image: "https://images.unsplash.com/photo-1549675585-8f1f440a2ecf", alt: 'White oversized oxford shirt hanging against white wall' }];


export default function ProductDetailClient() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState(false);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const handleAddToCart = () => {
    if (!selectedSize) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 label-tag text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <Icon name="ChevronRightIcon" size={12} />
        <Link href="/products" className="hover:text-foreground transition-colors">Women</Link>
        <Icon name="ChevronRightIcon" size={12} />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-20">
        {/* Image Gallery */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
            {product.images.map((img, i) =>
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
              selectedImage === i ? 'border-accent' : 'border-border'}`
              }>
              
                <AppImage src={img.src} alt={img.alt} fill className="object-cover" sizes="64px" />
              </button>
            )}
          </div>

          {/* Main Image */}
          <div className="flex-1 relative aspect-[3/4] rounded-3xl overflow-hidden order-1 sm:order-2">
            <AppImage
              src={product.images[selectedImage].src}
              alt={product.images[selectedImage].alt}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw" />
            
            <button
              onClick={() => setWishlist(!wishlist)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card flex items-center justify-center">
              
              <Icon
                name="HeartIcon"
                variant={wishlist ? 'solid' : 'outline'}
                size={20}
                className={wishlist ? 'text-red-500' : 'text-foreground'} />
              
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <span className="label-tag text-accent mb-2 block">{product.category}</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) =>
                <Icon key={i} name="StarIcon" variant="solid" size={14}
                className={i < Math.round(product.rating) ? 'star-filled' : 'star-empty'} />
                )}
              </div>
              <span className="text-sm font-medium text-foreground">{product.rating}</span>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">${product.price}</span>
            {product.originalPrice &&
            <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
            }
            {product.originalPrice &&
            <span className="badge-premium">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
              </span>
            }
          </div>

          {/* Color */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">
              Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
            </p>
            <div className="flex items-center gap-3">
              {product.colors.map((color) =>
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                selectedColor === color.name ? 'border-accent scale-110' : 'border-border'}`
                }
                style={{ backgroundColor: color.hex }} />

              )}
            </div>
          </div>

          {/* Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground">Size</p>
              <button className="label-tag text-accent hover:underline">Size Guide</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) =>
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${
                selectedSize === size ?
                'border-primary bg-primary text-primary-foreground' :
                'border-border bg-card text-foreground hover:border-foreground'}`
                }>
                
                  {size}
                </button>
              )}
            </div>
            {!selectedSize &&
            <p className="text-xs text-muted-foreground mt-2">Please select a size</p>
            }
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-border rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-muted transition-colors">
                
                <Icon name="MinusIcon" size={16} className="text-foreground" />
              </button>
              <span className="px-4 py-2 font-semibold text-foreground min-w-[3rem] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-4 py-2 hover:bg-muted transition-colors">
                
                <Icon name="PlusIcon" size={16} className="text-foreground" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`btn-primary flex-1 justify-center ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}>
              
              {added ?
              <>
                  <Icon name="CheckIcon" size={16} />
                  Added to Cart
                </> :

              <>
                  <Icon name="ShoppingBagIcon" size={16} />
                  Add to Cart
                </>
              }
            </button>
            <Link href="/checkout" className="btn-outline justify-center">
              Buy Now
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
            {[
            { icon: 'TruckIcon', label: 'Free shipping $75+' },
            { icon: 'ArrowPathIcon', label: '60-day returns' },
            { icon: 'ShieldCheckIcon', label: 'Secure checkout' }].
            map((badge) =>
            <div key={badge.label} className="flex flex-col items-center gap-1 text-center">
                <Icon name={badge.icon as any} size={18} className="text-accent" />
                <span className="text-[10px] text-muted-foreground font-medium">{badge.label}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews */}
      <div className="mb-16">
        <div className="flex border-b border-border mb-8">
          {(['description', 'reviews'] as const).map((tab) =>
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-semibold capitalize transition-colors border-b-2 -mb-px ${
            activeTab === tab ?
            'border-foreground text-foreground' :
            'border-transparent text-muted-foreground hover:text-foreground'}`
            }>
            
              {tab === 'reviews' ? `Reviews (${product.reviews})` : tab}
            </button>
          )}
        </div>

        {activeTab === 'description' &&
        <div className="max-w-2xl space-y-6">
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <button
            onClick={() => setDetailsOpen(!detailsOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-foreground">
            
              Product Details
              <Icon name={detailsOpen ? 'ChevronUpIcon' : 'ChevronDownIcon'} size={16} />
            </button>
            {detailsOpen &&
          <ul className="space-y-2 animate-scale-in">
                {product.details.map((d) =>
            <li key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="CheckIcon" size={14} className="text-accent flex-shrink-0" />
                    {d}
                  </li>
            )}
              </ul>
          }
          </div>
        }

        {activeTab === 'reviews' &&
        <div className="space-y-6 max-w-2xl">
            {reviews.map((review) =>
          <div key={review.name} className="bg-card border border-border rounded-2xl p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{review.name}</p>
                    <p className="label-tag text-muted-foreground">{review.date}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) =>
                <Icon key={i} name="StarIcon" variant="solid" size={12}
                className={i < review.rating ? 'star-filled' : 'star-empty'} />
                )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                {review.verified &&
            <div className="flex items-center gap-1">
                    <Icon name="CheckBadgeIcon" size={14} className="text-emerald-600" />
                    <span className="text-[10px] text-emerald-600 font-medium">Verified Purchase</span>
                  </div>
            }
              </div>
          )}
          </div>
        }
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedProducts.map((p) =>
          <Link key={p.id} href={`/product-detail?id=${p.id}`} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 product-img-zoom">
                <AppImage src={p.image} alt={p.alt} fill className="object-cover" sizes="25vw" />
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">{p.name}</h3>
              <p className="text-sm font-bold text-foreground mt-0.5">${p.price}</p>
            </Link>
          )}
        </div>
      </div>
    </div>);

}