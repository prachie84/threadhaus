'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const FEATURED = [
{
  id: 1,
  name: 'Linen Blazer — Oat',
  price: 189,
  originalPrice: 240,
  rating: 4.8,
  reviews: 312,
  badge: 'Bestseller',
  category: 'Women',
  inStock: true,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1532036f0-1772156814358.png",
  alt: 'Cream linen blazer on a wooden hanger, soft natural light'
},
{
  id: 2,
  name: 'Merino Crew Knit',
  price: 95,
  originalPrice: null,
  rating: 4.6,
  reviews: 184,
  badge: 'New',
  category: 'Men',
  inStock: true,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a357bb65-1772068050775.png",
  alt: 'Navy merino crewneck sweater folded on light wood, clean studio'
},
{
  id: 3,
  name: 'Canvas Mini Dress',
  price: 128,
  originalPrice: 160,
  rating: 4.7,
  reviews: 97,
  badge: 'Sale',
  category: 'Women',
  inStock: false,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_101604cc4-1772977891450.png",
  alt: 'Woman in beige canvas mini dress in sunlit studio'
},
{
  id: 4,
  name: 'Kids Stripe Tee Set',
  price: 48,
  originalPrice: null,
  rating: 4.9,
  reviews: 221,
  badge: 'Popular',
  category: 'Children',
  inStock: true,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_164ae6a30-1783930456471.png",
  alt: "Colorful striped children\'s tee and shorts on white background"
},
{
  id: 5,
  name: 'Kids Zip-Up Hoodie',
  price: 62,
  originalPrice: 78,
  rating: 4.8,
  reviews: 143,
  badge: 'New',
  category: 'Children',
  inStock: true,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f4340726-1772098967910.png",
  alt: "Child wearing a soft pastel zip-up hoodie with front pockets, casual style"
},
{
  id: 6,
  name: 'Mini Bear Hoodie',
  price: 55,
  originalPrice: null,
  rating: 4.9,
  reviews: 189,
  badge: 'Popular',
  category: 'Children',
  inStock: true,
  image: "https://images.unsplash.com/photo-1655136060260-21df3014301b",
  alt: "Cute children's hoodie with bear ear details on hood, cozy knit fabric in warm tone"
}];


const badgeColors: Record<string, string> = {
  Bestseller: 'bg-green-600 text-white',
  New: 'bg-primary text-white',
  Sale: 'bg-red-500 text-white',
  Popular: 'bg-emerald-600 text-white'
};

interface CartToast {
  id: number;
  name: string;
}

export default function FeaturedSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<number[]>([]);
  const [toast, setToast] = useState<CartToast | null>(null);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = section.querySelectorAll('.feat-card');
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-in'), i * 100);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer?.observe(section);
    return () => observer?.disconnect();
  }, []);

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const addToCart = (product: typeof FEATURED[0]) => {
    if (!product.inStock) return;
    setCart((prev) => [...prev, product.id]);
    setToast({ id: product.id, name: product.name });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="label-tag text-green-600 mb-2 block">Curated For You</span>
            <h2 className="section-title text-foreground">
              Featured<br />
              <span className="text-gradient-gold">Pieces</span>
            </h2>
          </div>
          <Link href="/products" className="btn-outline self-start sm:self-auto">
            Shop All
            <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {FEATURED.map((product) =>
          <div
            key={product.id}
            className="feat-card opacity-100 group relative bg-card rounded-2xl overflow-hidden border border-border card-hover flex flex-col">
              
              {/* Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Link href={`/product-detail?id=${product.id}`}>
                  <AppImage
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                </Link>

                {/* Out of Stock Overlay */}
                {!product.inStock &&
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-foreground text-primary-foreground text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full">
                      Out of Stock
                    </span>
                  </div>
              }

                {/* Badge */}
                {product.badge &&
              <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase z-20 ${badgeColors[product.badge]}`}>
                    {product.badge}
                  </span>
              }

                {/* Wishlist */}
                <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full glass-card flex items-center justify-center z-20 transition-transform hover:scale-110">
                  <Icon
                  name="HeartIcon"
                  variant={wishlist.includes(product.id) ? 'solid' : 'outline'}
                  size={14}
                  className={wishlist.includes(product.id) ? 'text-red-500' : 'text-foreground'} />
                </button>
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <p className="label-tag text-muted-foreground mb-1">{product.category}</p>
                <Link href={`/product-detail?id=${product.id}`}>
                  <h3 className="font-semibold text-foreground text-sm leading-snug mb-2 hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) =>
                <Icon key={i} name="StarIcon" variant="solid" size={9}
                className={i < Math.round(product.rating) ? 'text-green-500' : 'star-empty'} />
                )}
                  <span className="text-[9px] text-muted-foreground ml-1">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-bold text-foreground">${product.price}</span>
                  {product.originalPrice &&
                <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                }
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-2">
                  {product.inStock ?
                <>
                      <div className="flex gap-2">
                        <button
                      onClick={() => addToCart(product)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-secondary border border-border text-foreground text-xs font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all duration-200">
                          <Icon name="ShoppingBagIcon" size={13} />
                          Add to Cart
                        </button>
                        <button
                      onClick={() => toggleWishlist(product.id)}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
                      wishlist.includes(product.id) ?
                      'bg-red-50 border-red-200 text-red-500' : 'border-border text-muted-foreground hover:border-red-300 hover:text-red-400'}`
                      }>
                          <Icon name="HeartIcon" variant={wishlist.includes(product.id) ? 'solid' : 'outline'} size={13} />
                        </button>
                      </div>
                      <Link
                    href={`/checkout?buy=${product.id}`}
                    className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-green-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-green-700 transition-all duration-200">
                        <Icon name="BoltIcon" size={13} />
                        Buy Now
                      </Link>
                    </> :

                <button
                  disabled
                  className="w-full py-2 px-3 rounded-xl bg-muted border border-border text-muted-foreground text-xs font-semibold cursor-not-allowed">
                      Out of Stock
                    </button>
                }
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toast notification */}
      {toast &&
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scale-in">
          <div className="bg-foreground text-primary-foreground px-5 py-3 rounded-2xl flex items-center gap-3 shadow-xl">
            <Icon name="CheckCircleIcon" size={18} className="text-green-400" />
            <span className="text-sm font-medium">{toast.name} added to cart</span>
          </div>
        </div>
      }
    </section>);

}