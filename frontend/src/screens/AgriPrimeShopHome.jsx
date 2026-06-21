import React from 'react';

export default function AgriPrimeShopHome() {
  return (
    <>
      
{/* TopNavBar */}
{/* nav removed – handled by App shell */}
{/* Hero Section */}
<header className="relative min-h-[870px] flex items-center overflow-hidden px-8">
<div className="absolute inset-0 z-0">
<img className="w-full h-full object-cover" data-alt="breathtaking aerial view of a vibrant green sustainable organic farm valley at sunrise with morning mist rolling over the hills" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2m8TmsXVZeVyayN_aId-iP_sJueJNvihq3zAJCorlV44aT4YY1rVgsG0zWbNBe0ZWuf2BHJechbAwhj-KTfTA58a-rF7aGE8UayTbq0QqmHrdL5P1NKkZpnnmg2rTf0wUrVOD3_1pp_ilPRwn0P9BedSIdAG_CCvLgJaIWcvngbszcYtb1Okxs5TE5ZQCmkbfwcbIT8WMFal7_gRIGoCeuaqGllZENgdrN8W621LaemwZIgvxQsi7anDkptC691A8LS51W0iEG38"/>
<div className="absolute inset-0 bg-gradient-to-r from-[#f5fced]/90 via-[#f5fced]/40 to-transparent"></div>
</div>
<div className="relative z-10 max-w-2xl">
<span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-primary-fixed text-on-primary-fixed rounded-full font-label">Agrezen Certified</span>
<h1 className="text-6xl md:text-7xl font-extrabold font-headline text-on-surface tracking-tight leading-[1.1] mb-6">
                Purely Organic, From Our <span className="text-primary italic">Farm</span> to Your Table
            </h1>
<p className="text-lg md:text-xl text-on-surface-variant max-w-xl mb-10 leading-relaxed">
                Experience the Vitality of Agrezen-certified livestock and dairy products. Cultivated with respect for the earth and your health.
            </p>
<div className="flex flex-wrap gap-4">
<button className="px-10 py-4 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full shadow-lg hover:shadow-primary-container/20 transition-all hover:scale-105 active:scale-95">
                    Shop Now
                </button>
<button className="px-10 py-4 border-2 border-primary/20 text-primary font-bold rounded-full hover:bg-surface-container-low transition-all">
                    Our Process
                </button>
</div>
</div>
</header>
{/* Featured Categories */}
<section className="py-24 px-8 max-w-screen-2xl ">
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Category Card 1 */}
<div className="glass-card p-10 rounded-[2rem] flex flex-col items-center text-center group cursor-pointer hover:bg-surface-container-low transition-all duration-500">
<div className="w-20 h-20 mb-6 bg-tertiary-fixed rounded-3xl flex items-center justify-center text-on-tertiary-fixed transition-transform duration-500 group-hover:rotate-12">
<span className="material-symbols-outlined text-4xl" data-icon="water_drop">water_drop</span>
</div>
<h3 className="text-2xl font-bold font-headline text-on-surface mb-2">Dairy</h3>
<p className="text-on-surface-variant text-sm">Fresh, non-homogenized milk and artisanal cheeses from pasture-raised cattle.</p>
</div>
{/* Category Card 2 */}
<div className="glass-card p-10 rounded-[2rem] flex flex-col items-center text-center group cursor-pointer hover:bg-surface-container-low transition-all duration-500">
<div className="w-20 h-20 mb-6 bg-primary-fixed rounded-3xl flex items-center justify-center text-on-primary-fixed transition-transform duration-500 group-hover:rotate-12">
<span className="material-symbols-outlined text-4xl" data-icon="pets">pets</span>
</div>
<h3 className="text-2xl font-bold font-headline text-on-surface mb-2">Livestock</h3>
<p className="text-on-surface-variant text-sm">Ethically raised, grass-fed heritage breeds for superior nutritional density.</p>
</div>
{/* Category Card 3 */}
<div className="glass-card p-10 rounded-[2rem] flex flex-col items-center text-center group cursor-pointer hover:bg-surface-container-low transition-all duration-500">
<div className="w-20 h-20 mb-6 bg-secondary-container rounded-3xl flex items-center justify-center text-on-secondary-container transition-transform duration-500 group-hover:rotate-12">
<span className="material-symbols-outlined text-4xl" data-icon="eco">eco</span>
</div>
<h3 className="text-2xl font-bold font-headline text-on-surface mb-2">Organic Feed</h3>
<p className="text-on-surface-variant text-sm">Pure, GMO-free grains and forage harvested from our pesticide-free fields.</p>
</div>
</div>
</section>
{/* Product Grid */}
<section className="py-24 bg-surface-container-low px-8">
<div className="max-w-screen-2xl ">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
<div>
<h2 className="text-4xl md:text-5xl font-black font-headline text-on-surface tracking-tight mb-4">Harvest Fresh Selection</h2>
<p className="text-on-surface-variant text-lg">Directly from the fields to your doorstep within 24 hours of processing.</p>
</div>
<a className="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all" href="#">
                    View Catalog <span className="material-symbols-outlined">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
{/* Product 1 */}
<div className="flex flex-col bg-surface-container-lowest rounded-[2rem] overflow-hidden group">
<div className="relative h-72 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="a vintage glass milk bottle filled with fresh organic milk standing on a rustic wooden table in a sunlit kitchen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5oXn2Y-BZyVh636BF9iv3LlO0PGs3vKVTbkfBa4pcXXhE7lK-9j5CzhppoEUWXbyiKZOmpctsorsNbicKCaS2eXvHcHrrskqzOqP1s0pRQS6OQvH5kDu2p4lkZ0HbHtoXU5SY_3JUO2pSqsCRWvvBGZe6en0J4BkGDi6-i4xSp0S0YgwEijjrF0hDKmSe70RRA5FlXaK4AwOSdVxh77Sa3i4_vEkQDSaELrkdzoQ2aZluYBwmRQzjEStKW_KZtQYzaqHaPhu6gN8"/>
<div className="absolute top-4 right-4 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary font-label">Bestseller</div>
</div>
<div className="p-8 flex-1 flex flex-col">
<h4 className="text-xl font-bold font-headline text-on-surface mb-2">Premium Whole Milk</h4>
<p className="text-on-surface-variant text-sm mb-6 flex-1">Creamy, rich, and full of natural nutrients from grass-fed cows.</p>
<div className="flex items-center justify-between mt-auto">
<span className="text-2xl font-black text-secondary">₨4.50</span>
<button className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:bg-primary-container transition-colors shadow-lg active:scale-90">
<span className="material-symbols-outlined" data-icon="add_shopping_cart">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product 2 */}
<div className="flex flex-col bg-surface-container-lowest rounded-[2rem] overflow-hidden group">
<div className="relative h-72 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="a high-quality cut of raw Angus beef steak with marbleized texture on a dark slate board with rosemary sprigs" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6qpZmaAvPjf_32JQ7JFYD3VT5GpiP8SldjYQL5QyQCB2oOQcmjBdOSBCFHxUcBgP_-wx5R-L-hJbH_ustAmdKCPUYj4bwRwWZADh9RxuiYl2DLCM4ess0Mggae3bhTbKNdjgQMaJlI4j_j1gWpeVODlTwqzt9A33-hBhLHsZq_l48JQhmCg6guIHmKxjuQPbwsyWYuK-XoGMwEwa59dHY5laxgEV_y-VMiFfgsOD0Cm3_CKsp_r-1O1-oS9vTpcsXDiBoaPCYt8M"/>
</div>
<div className="p-8 flex-1 flex flex-col">
<h4 className="text-xl font-bold font-headline text-on-surface mb-2">Organic Angus Beef (500g)</h4>
<p className="text-on-surface-variant text-sm mb-6 flex-1">Prime cut steak with exceptional marbling and deep, natural flavor.</p>
<div className="flex items-center justify-between mt-auto">
<span className="text-2xl font-black text-secondary">₨22.00</span>
<button className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:bg-primary-container transition-colors shadow-lg active:scale-90">
<span className="material-symbols-outlined" data-icon="add_shopping_cart">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product 3 */}
<div className="flex flex-col bg-surface-container-lowest rounded-[2rem] overflow-hidden group">
<div className="relative h-72 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="a wedge of artisan aged farmhouse cheese on a wooden board surrounded by grapes and walnuts with warm lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN-YdsRJJ1uKCj6Z7PFOAmLfEBBuL5lgqrn7kKNH-VXG5Eo-s7VGRXA_xaHMxlfz5kNRdqGYq6SLLTcBavk6rj6HeLZbNeMsODtrubpSdljqWu6wjA0DVWQxOwBJi42mjtEIz-jFshtgbYfaF6MiIWXmLIbWmknohwbWzmyDqEo6UF4RFi4YgC-Wl7lNHoi0lT5J4VHii0-2aptxIKtQlGGe_U_9DEApmW_HtJBdRWKTenTH49UxX3k_p6IWaRGcLC5VJnq_UovLg"/>
</div>
<div className="p-8 flex-1 flex flex-col">
<h4 className="text-xl font-bold font-headline text-on-surface mb-2">Artisan Farmhouse Cheese</h4>
<p className="text-on-surface-variant text-sm mb-6 flex-1">Hand-crafted and aged for 6 months to achieve a sharp, earthy finish.</p>
<div className="flex items-center justify-between mt-auto">
<span className="text-2xl font-black text-secondary">₨12.00</span>
<button className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:bg-primary-container transition-colors shadow-lg active:scale-90">
<span className="material-symbols-outlined" data-icon="add_shopping_cart">add_shopping_cart</span>
</button>
</div>
</div>
</div>
{/* Product 4 */}
<div className="flex flex-col bg-surface-container-lowest rounded-[2rem] overflow-hidden group">
<div className="relative h-72 overflow-hidden">
<img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="succulent heritage breed lamb chops seasoned with herbs and salt on a rustic iron skillet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRlthe7Ovf9xPDSeFIb3Gp-xU4qK6vocNaNftaHKTjxHDJ_JCmm_2SDi1iRCBaNiQHlr6tK82wuV57_xbmVn0q57M40D_so5wiEvVXEL6CegxmJIrjP24wNcn_tzBw9sxlNg8sK50z0ReExZ63cwFlER06SiEQGdb8CTn7qcLmNW4LJ_r8xlbRYOTCOsZSV4-YXbvIHkzLRYj--x9NfSgwd1YC_3-vMUx8U6oanyzaPPtclppZhXq26H-Rl2QJgq_AzAXdU599-po"/>
</div>
<div className="p-8 flex-1 flex flex-col">
<h4 className="text-xl font-bold font-headline text-on-surface mb-2">Heritage Breed Lamb</h4>
<p className="text-on-surface-variant text-sm mb-6 flex-1">Pasture-raised lamb known for its tender texture and mild, sweet taste.</p>
<div className="flex items-center justify-between mt-auto">
<span className="text-2xl font-black text-secondary">₨18.50</span>
<button className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center hover:bg-primary-container transition-colors shadow-lg active:scale-90">
<span className="material-symbols-outlined" data-icon="add_shopping_cart">add_shopping_cart</span>
</button>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Footer */}
<footer className="bg-[#eff6e7] dark:bg-stone-900 w-full mt-auto">
<div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full max-w-screen-2xl ">
<div className="mb-8 md:mb-0">
<span className="font-manrope font-bold text-[#006e1c] text-xl block mb-2">AgriPrime</span>
<p className="font-inter text-xs uppercase tracking-widest text-[#3f4a3c] dark:text-stone-400">© 2024 AgriPrime. Cultivating Sustainable Futures.</p>
</div>
<div className="flex gap-8">
<a className="font-inter text-xs uppercase tracking-widest text-[#3f4a3c] hover:text-[#006e1c] underline-offset-4 hover:underline transition-all opacity-100 hover:opacity-80" href="#">Privacy Policy</a>
<a className="font-inter text-xs uppercase tracking-widest text-[#3f4a3c] hover:text-[#006e1c] underline-offset-4 hover:underline transition-all opacity-100 hover:opacity-80" href="#">Terms of Service</a>
<a className="font-inter text-xs uppercase tracking-widest text-[#3f4a3c] hover:text-[#006e1c] underline-offset-4 hover:underline transition-all opacity-100 hover:opacity-80" href="#">Shipping Info</a>
</div>
</div>
</footer>

    </>
  );
}
