(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        API_URL: 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json',
        STORAGE_KEY: 'ebebek_carousel_products',
        FAVORITES_KEY: 'ebebek_favorites',
        CAROUSEL_TITLE: 'Beğenebileceğinizi düşündüklerimiz'
    };

    // State management
    let state = {
        products: [],
        favorites: [],
        currentIndex: 0,
        isLoaded: false
    };


    const init = () => {
        // Check if we're on the homepage
        if (!isHomePage()) {
            console.log('Wrong page');
            return;
        }

        // Build the carousel structure
        buildHTML();
        buildCSS();
        
        // Load products and render
        loadProducts();
        console.log('Carousel loaded successfully!');
    };

    // Check on the homepage
    const isHomePage = () => {
        const current = window.location.href;
        if (current.includes('e-bebek.com')) {
            return true;
        }
        return false;
    };  

    // Build HTML structure
    const buildHTML = () => {
        const container = document.createElement('div');
        container.className = 'carousel-container';
        container.innerHTML = `
            <div class="ebebek-carousel-container">
                <div class="ebebek-carousel-header">
                    <h2 class="ebebek-carousel-title">${CONFIG.CAROUSEL_TITLE}</h2>
                </div>
                <div class="ebebek-carousel-wrapper">
                    <button class="ebebek-carousel-nav ebebek-carousel-prev" aria-label="Previous products">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                    <div class="ebebek-carousel-track">
                        <div class="ebebek-carousel-items" id="carousel-items">
                            <!-- Products will be inserted here -->
                        </div>
                    </div>
                    <button class="ebebek-carousel-nav ebebek-carousel-next" aria-label="Next products">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        const target = document.querySelector('.ins-instory.ins-preview-mode') || document.body;
        target.insertAdjacentElement('afterend', container);
    };

    // Build CSS styles
    const buildCSS = () => {
        const css = `
            :root {
                --c-primaryColor: #f28e00;
                --c-secondaryColor: #ff6b35;
            }
            .ebebek-carousel-container {
                margin: 40px 0;
                padding: 0 20px;
                max-width: 1200px;
                margin-left: auto;
                margin-right: auto;
                display: block;
            }

            .ebebek-carousel-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .ebebek-carousel-title {
                font-size: 28px;
                font-weight: 700;
                color: var(--c-primaryColor);
                margin: 0;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: #fef6eb;
                padding: 10px 20px;
                border-radius: 8px;
                display: inline-block;
            }

            .ebebek-carousel-wrapper {
                position: relative;
                display: flex !important;
                flex-direction: row !important;
                align-items: center;
                gap: 20px;
                width: 100%;
            }

            .ebebek-carousel-track {
                flex: 1 ;
                overflow: hidden;
                position: relative;
                width: 100%;
                display: block;
            }

            .ebebek-carousel-items {
                display: flex !important;
                flex-direction: row !important;
                gap: 20px ;
                transition: transform 0.3s ease-in-out;
                padding: 10px 0;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-behavior: smooth;
                scrollbar-width: none; 
                -ms-overflow-style: none;
                white-space: nowrap;
                width: 100% ;
            }

            .ebebek-carousel-items::-webkit-scrollbar {
                display: none;
            }

            .ebebek-carousel-nav {
                width: 48px;
                height: 48px;
                border: none;
                border-radius: 50%;
                background: #fef6eb;
                color: #6c757d;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;
            }

            .ebebek-carousel-nav:hover {
                background: #f5e6d3;
                color: #495057;
                transform: scale(1.05);
            }

            .ebebek-carousel-nav:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .carousel-product-card {
                min-width: 280px;
                max-width: 280px;
                width: 280px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                overflow: hidden;
                transition: all 0.3s ease;
                position: relative;
                flex-shrink: 0;
                flex-grow: 0;
                display: block;
                float: none;
            }

            .carousel-product-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            }

            .carousel-product-image-container {
                position: relative;
                width: 100%;
                height: 200px;
                overflow: hidden;
                background: #f8f9fa;
            }

            .carousel-product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .carousel-product-badges {
                position: absolute;
                top: 12px;
                left: 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                z-index: 2;
            }

            .carousel-product-badge {
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 10px;
                font-weight: 600;
                color: white;
                text-transform: uppercase;
                display: flex;
                align-items: center;
                gap: 4px;
                max-width: 80px;
            }

            .carousel-product-badge.bestseller {
                background: #ff6b35;
            }

            .carousel-product-badge.star {
                background: #ffc107;
            }

            .carousel-product-badge.freeshipping {
                background: #28a745;
            }

            .carousel-product-favorite {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 32px;
                height: 32px;
                border: 2px solid #e9ecef;
                border-radius: 50%;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 2;
            }

            .carousel-product-favorite:hover {
                border-color: #ff6b35;
                transform: scale(1.1);
            }

            .carousel-product-favorite.active {
                background: #ff6b35;
                border-color: #ff6b35;
            }

            .carousel-product-favorite svg {
                width: 16px;
                height: 16px;
                fill: none;
                stroke: #6c757d;
                stroke-width: 2;
                transition: all 0.2s ease;
            }

            .carousel-product-favorite.active svg {
                fill: white;
                stroke: white;
            }

            .carousel-product-content {
                padding: 16px;
            }

            .carousel-product-name {
                font-size: 14px;
                font-weight: 500;
                color: #212529;
                line-height: 1.4;
                margin-bottom: 8px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                height: 40px;
            }

            .carousel-product-rating {
                display: flex;
                align-items: center;
                gap: 6px;
                margin-bottom: 8px;
            }

            .carousel-product-stars {
                display: flex;
                gap: 2px;
            }

            .carousel-product-star {
                width: 14px;
                height: 14px;
                fill: #ffc107;
            }

            .carousel-product-star.empty {
                fill: #e9ecef;
            }

            .carousel-product-reviews {
                font-size: 12px;
                color: #6c757d;
            }

            .carousel-product-price {
                margin-bottom: 8px;
            }

            .carousel-product-original-price {
                font-size: 12px;
                color: #6c757d;
                text-decoration: line-through;
                margin-bottom: 2px;
            }

            .carousel-product-current-price {
                font-size: 18px;
                font-weight: 700;
                color: #28a745;
            }

            .carousel-product-discount {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                padding: 2px 6px;
                background: #28a745;
                color: white;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                margin-left: 8px;
            }

            .carousel-product-offer {
                background: #e8f5e8;
                color: #28a745;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: 500;
                margin-bottom: 12px;
                text-align: center;
            }

            .carousel-product-button {
                width: 100%;
                padding: 12px;
                background: #fef6eb;
                color: var(--c-primaryColor);
                border: 2px solid var(--c-primaryColor);
                border-radius: 8px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .carousel-product-button:hover {
                background: var(--c-primaryColor);
                color: white;
                transform: translateY(-1px);
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .ebebek-carousel-container {
                    padding: 0 10px;
                }

                .ebebek-carousel-title {
                    font-size: 24px;
                }

                .ebebek-carousel-wrapper {
                    gap: 10px;
                }

                .ebebek-carousel-nav {
                    width: 40px;
                    height: 40px;
                }

                .carousel-product-card {
                    min-width: 240px ;
                    max-width: 240px ;
                    width: 240px ;
                }

                .carousel-product-image-container {
                    height: 160px;
                }

                .carousel-product-content {
                    padding: 12px;
                }

                .carousel-product-name {
                    font-size: 13px;
                    height: 36px;
                }

                .carousel-product-current-price {
                    font-size: 16px;
                }
            }

            @media (max-width: 480px) {
                .carousel-product-card {
                    min-width: 200px;
                    max-width: 200px;
                    width: 200px;
                }

                .carousel-product-image-container {
                    height: 140px;
                }

                .carousel-product-content {
                    padding: 10px;
                }

                .carousel-product-name {
                    font-size: 12px;
                    height: 32px;
                }

                .carousel-product-current-price {
                    font-size: 14px;
                }
            }
        `;

        // Inject CSS into head
        const styleElement = document.createElement('style');
        styleElement.className = 'ebebek-carousel-styles';
        styleElement.textContent = css;
        styleElement.setAttribute('data-ebebek-carousel', 'true');
        
        // Insert at the beginning of head
        if (document.head.firstChild) {
            document.head.insertBefore(styleElement, document.head.firstChild);
        } else {
            document.head.appendChild(styleElement);
        }
        
        console.log('CSS injected successfully');
    };

    // Load products - first try localStorage, then API
    const loadProducts = async () => {
        try {
            const storedProducts = localStorage.getItem(CONFIG.STORAGE_KEY);
            
            if (storedProducts) {
                state.products = JSON.parse(storedProducts);    
                renderCarousel();
            } else {
                console.log('Fetching products from API...');
                await fetchProductsFromAPI();
            }
        } catch (error) {
            console.error('Error loading products:', error);
        }
    };

    // Fetch products from API
    const fetchProductsFromAPI = async () => {
        try {
            const res = await fetch(CONFIG.API_URL);
            
            if (!res.ok) {
                throw new Error('API error');
            }
            
            const productsData = await res.json();
            state.products = productsData;
            
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(productsData)); 
            renderCarousel();
        } catch (error) {
            console.error('API fetch error:', error);
        }
    };

    // Render the carousel with products
    const renderCarousel = () => {
        const carouselItems = document.getElementById('carousel-items');
        if (!carouselItems) {
            console.error(' Carousel items container not found');
            return;
        }

        const allProductsHTML = state.products.map(product => createProductCard(product)).join('');
        carouselItems.innerHTML = allProductsHTML;
        
        state.isLoaded = true;
        console.log('Carousel rendered with', state.products.length, 'products');
    };

    // Create individual product card HTML
    const createProductCard = (product) => {
        const isFavorite = state.favorites.includes(product.id);
        const hasDiscount = product.price !== product.original_price;
        const discountPercentage = hasDiscount
             ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
             : 0;
        
        // Generate random rating
        const rating = Math.floor(Math.random() * 2) + 4; 
        const reviews = Math.floor(Math.random() * 200) + 1; 
        
        // Generate random badges
        const badges = [];
        if (Math.random() > 0.7) badges.push('bestseller');
        if (Math.random() > 0.8) badges.push('star');
        if (Math.random() > 0.6) badges.push('freeshipping');
   

        return `
            <div class="carousel-product-card" data-product-id="${product.id}">
                <div class="carousel-product-image-container">
                    <img src="${product.img}" alt="${product.name}" class="carousel-product-image" loading="lazy">
                    
                    ${badges.length > 0 ? `
                        <div class="carousel-product-badges">
                            ${badges.map(badge => `
                                <div class="carousel-product-badge ${badge}">
                                    ${badge === 'bestseller' ? 'ÇOK SATAN' : 
                                      badge === 'star' ? 'YILDIZ ÜRÜN' : 
                                      badge === 'freeshipping' ? 'KARGO BEDAVA' : ''}
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="carousel-product-favorite ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                        <svg viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                    </div>
                </div>
                
                <div class="carousel-product-content">
                    <h3 class="carousel-product-name">${product.name}</h3>
                    
                    <div class="carousel-product-rating">
                        <div class="carousel-product-stars">
                            ${Array.from({length: 5}, (_, i) => `
                                <svg class="carousel-product-star ${i < rating ? '' : 'empty'}" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                            `).join('')}
                        </div>
                        <span class="carousel-product-reviews">(${reviews})</span>
                    </div>
                    
                    <div class="carousel-product-price">
                        ${hasDiscount ? `
                            <div class="carousel-product-original-price">${product.original_price.toFixed(2)} TL</div>
                        ` : ''}
                        <div class="carousel-product-current-price">
                            ${product.price.toFixed(2)} TL
                            ${hasDiscount ? `
                                <span class="carousel-product-discount">
                                    %${discountPercentage}
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7 14l5-5 5 5z"/>
                                    </svg>
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    
                    <div class="carousel-product-offer">Farklı Ürünlerde 3 Al 2 Öde</div>
                    
                    
                    <button class="carousel-product-button">Sepete Ekle</button>
                </div>
            </div>
        `;
    };

    init();

})(); 