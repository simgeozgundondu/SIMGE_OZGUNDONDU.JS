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

        // Load favorites from localStorage
        loadFavorites();

        // Build the carousel structure
        buildHTML();
        buildCSS();

        // Load products and render
        loadProducts();

        // Set up event listeners
        setEvents();

        console.log('Carousel loaded successfully!');
    };

    // Check on the homepage
    const isHomePage = () => {
        const current = window.location.href;
        const url = new URL(current);
        const pathname = url.pathname;

        // Check if we're on the homepage (root path or index.html)
        if (url.hostname === 'www.e-bebek.com' && (pathname === '/' || pathname === '')) {
            return true;
        }
        return false;
    };

    // Load favorites from localStorage
    const loadFavorites = () => {
        try {
            const stored = localStorage.getItem(CONFIG.FAVORITES_KEY);
            state.favorites = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading favorites:', error);
            state.favorites = [];
        }
    };

    // Save favorites to localStorage
    const saveFavorites = () => {
        try {
            localStorage.setItem(CONFIG.FAVORITES_KEY, JSON.stringify(state.favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    };

    // Build HTML structure
    const buildHTML = () => {
        // Add Font Awesome CDN
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const fontAwesomeLink = document.createElement('link');
            fontAwesomeLink.rel = 'stylesheet';
            fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
            document.head.appendChild(fontAwesomeLink);
        }

        const container = document.createElement('div');
        container.className = 'carousel-container';
        container.innerHTML = `
            <div class="ebebek-carousel-container">
                <button class="carousel-nav carousel-prev" aria-label="Previous products">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <div class="carousel-header">
                    <h2 class="carousel-title">${CONFIG.CAROUSEL_TITLE}</h2>
                </div>
                <div class="carousel-wrapper">
                    <div class="carousel-track">
                        <div class="carousel-items" id="carousel-items">
                            <!-- Products will be inserted here -->
                        </div>
                    </div>
                </div>
                <button class="carousel-nav carousel-next" aria-label="Next products">
                    <i class="fas fa-chevron-right"></i>
                </button>
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
                --c-secondaryColor: #fef6eb;
            }
            .ebebek-carousel-container {
                position: relative;
                margin: 40px 0;
                padding: 0 60px;
                max-width: 1280px;
                margin-left: auto;
                margin-right: auto;
                display: block;
            }

            .ins-preview-wrapper .carousel-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background-color: var(--c-secondaryColor);
                padding: 25px 67px;
                border-top-left-radius: 35px !important;
                border-top-right-radius: 35px !important;
            }

            .carousel-title {
                font-family: Quicksand-Bold;
                font-size: 3rem;
                font-weight: 600;
                line-height: 1.11;
                color: var(--c-primaryColor);
                margin: 0;
            }

            .ins-preview-wrapper .carousel-wrapper {
                position: relative;
                display: flex !important;
                flex-direction: row !important;
                align-items: center;
                width: 100%;
                padding-bottom: 16px;
                border-bottom-left-radius: 35px !important;
                border-bottom-right-radius: 35px !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }


            .carousel-track {
                flex: 1 ;
                overflow: hidden;
                position: relative;
                width: 100%;
                display: block;
            }

            .carousel-items {
                display: flex !important;
                flex-direction: row !important;
                gap: clamp(8px, 2vw, 20px);
                transition: transform 0.3s ease-in-out;
                padding: 10px 0;
                overflow-x: auto;
                overflow-y: hidden;
                scroll-behavior: smooth;
                scrollbar-width: none;
                -ms-overflow-style: none;
                width: 100% ;
            }

            .carousel-items::-webkit-scrollbar {
                display: none;
            }

            .carousel-nav {
                position: absolute;
                top: 50%;
                width: 48px;
                height: 48px;
                border: 2px solid transparent;
                border-radius: 50%;
                background: var(--c-secondaryColor);
                color: var(--c-primaryColor);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .carousel-nav i {
                font-size: 20px;
                font-weight: 900;
            }

            .carousel-nav:hover {
                color: var(--c-primaryColor);
                border-color: var(--c-primaryColor);
                background: #fff;
            }



            .carousel-nav:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .carousel-prev {
                left: 0px;
            }

            .carousel-next {
                right: 0px;
            }

            .ins-preview-wrapper .carousel-product-card {
                min-width: 242px;
                max-width: 242px;
                width: 242px;
                background: white;
                border-radius: 12px !important;
                border: 1px solid rgb(225, 225, 225);
                overflow: hidden;
                position: relative;
                flex-shrink: 0;
                flex-grow: 0;
                display: block;
                float: none;
            }

            .carousel-product-card:hover {
                border: 2px solid var(--c-primaryColor);
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
                z-index: 2;
            }

            .badge-icon {
                width: 55px;
                height: 55px;
                margin-right: 4px;
            }

            .ins-preview-wrapper .carousel-product-favorite {
                position: absolute;
                top: 12px;
                right: 12px;
                width: 50px;
                height: 50px;
                border-radius: 50% !important;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s ease;
                z-index: 2;
                box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                overflow: hidden;
            }

            .carousel-product-favorite:hover {
                border-color: var(--c-primaryColor);
                background: #fff;
                transform: scale(1.1);
            }

            .carousel-product-favorite.active {
                background: #fff;
                border-color: var(--c-primaryColor);
            }

            .carousel-product-favorite i {
                font-size: 25px;
                color: var(--c-primaryColor);
                transition: all 0.2s ease;
            }

            .carousel-product-favorite.active i {
                color: var(--c-primaryColor);
            }

            .carousel-product-favorite.active .far {
                display: none !important;
            }

            .carousel-product-favorite.active .fas {
                display: inline-block !important;
            }

            .carousel-product-content {
                padding: 16px;
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .carousel-product-name {
                font-size: 12px;
                line-height: 1.4;
                margin-bottom: 8px;
                display: block;
                min-height: 40px;
                word-wrap: break-word;
                overflow-wrap: break-word;
                white-space: normal;
                word-break: break-word;
                max-width: 100%;
                overflow: hidden;
            }

            .carousel-product-name {
                display: block;
                height: 45px;
                white-space: normal;
                max-width: 100%;
                margin-bottom: 8px;
                line-height: 1.3;
                white-space: normal;
                word-wrap: break-word;
                overflow: hidden;
            }

            .carousel-product-brand {
                color:rgb(95, 103, 111);
                font-weight: 700;
            }

            .carousel-product-name-text {
                color:rgb(145, 148, 150);
                font-weight: 500;
            }

            .carousel-product-rating {
                align-items: center;
                gap: 6px;
                margin-bottom: 14px;
                padding: 5px 0 15px;
            }

            .carousel-product-stars {
                gap: 2px;
            }

            .carousel-product-star {
                font-size: 14px;
                color: #ffc107;
            }

            .carousel-product-star.empty {
                color: #e9ecef;
            }

            .carousel-product-reviews {
                font-size: 12px;
                color: #6c757d;
            }

            .carousel-product-price {
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .carousel-product-original-price {
                font-size: 12px;
                color: #6c757d;
                text-decoration: line-through;
            }

            .carousel-product-current-price {
                font-size: 18px;
                font-weight: 700;
                color: #28a745;
            }

            .carousel-product-current-price.no-discount {
                color: #6c757d;
                margin-top: 38px;
            }

            .carousel-product-discount {
                display: inline-flex;
                align-items: center;
                gap: 4px;
                color: #28a745;
                font-size: 14px;
                font-weight: 700;
            }

            .ins-preview-wrapper .carousel-product-offer {
                background: #e8f5e8;
                color: #28a745;
                padding: 4px 8px;
                border-radius: 12px !important;
                font-size: 11px;
                font-weight: 500;
                margin-bottom: 12px;
                text-align: center;
                margin-top: auto;
            }

            .carousel-product-button {
                width: 100%;
                padding: 12px;
                background: var(--c-secondaryColor);
                color: var(--c-primaryColor);
                border-radius: 38px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-top: auto;
            }

            .carousel-product-button:hover {
                background: var(--c-primaryColor);
                color: white;
                transform: translateY(-1px);
            }

            /* Responsive Design */
            @media (min-width: 1480px) {
                .ebebek-carousel-container {
                    max-width: 1400px;
                }
                .carousel-product-card {
                    min-width: 242px;
                    max-width: 242px;
                    width: 242px;
                }
            }

            @media (max-width: 1479px) and (min-width: 1280px) {
                .ebebek-carousel-container {
                    max-width: 1280px;
                }
                .carousel-product-card {
                    min-width: 272px;
                    max-width: 272px;
                    width: 272px;
                }
            }

            @media (max-width: 1279px) and (min-width: 1024px) {
                .ebebek-carousel-container {
                    max-width: 1000px;
                }
                .carousel-product-card {
                    min-width: 296px;
                    max-width: 296px;
                    width: 296px;
                }
            }

            @media (max-width: 1023px) and (min-width: 768px) {
                .ebebek-carousel-container {
                    max-width: 800px;
                }
                .carousel-product-card {
                    min-width: 240px;
                    max-width: 240px;
                    width: 240px;
                }
            }

            @media (max-width: 767px) and (min-width: 480px) {
                .ebebek-carousel-container {
                    max-width: 600px;
                }
                .carousel-product-card {
                    min-width: 200px;
                    max-width: 200px;
                    width: 200px;
                }
            }

            @media (max-width: 479px) {
                .ebebek-carousel-container {
                    max-width: 400px;
                    padding: 0 20px;
                }
                .carousel-product-card {
                    min-width: 158px !important;
                    max-width: 190px !important;
                    width: 190px !important;
                }
                .carousel-nav {
                    display: none;
                }
                .carousel-wrapper {
                    box-shadow: none !important;
                }
                .carousel-header {
                    background: transparent !important;
                    padding: 0 10px !important;
                }
                .carousel-title {
                    font-size: 18px !important;
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
        const isProductInFavorites = state.favorites.includes(product.id);

        const hasProductDiscount = product.price !== product.original_price;

        // Calculate discount percentage if product has discount
        let discountPercentage = 0;
        if (hasProductDiscount) {
            const priceDifference = product.original_price - product.price;
            const discountCalculation = (priceDifference / product.original_price) * 100;
            discountPercentage = Math.round(discountCalculation);
        }

        // Generate random rating
        const randomRatingNumber = Math.floor(Math.random() * 2);
        const productRating = randomRatingNumber + 4;

        // Generate random review
        const randomReviewNumber = Math.floor(Math.random() * 200);
        const productReviews = randomReviewNumber + 1;

        // Generate random badges
        const productBadges = [];

        // 30% chance to add bestseller badge
        const bestsellerRandom = Math.random();
        if (bestsellerRandom > 0.7) {
            productBadges.push('bestseller');
        }

        // 20% chance to add star product badge
        const starRandom = Math.random();
        if (starRandom > 0.8) {
            productBadges.push('star');
        }

        // 40% chance to add free shipping badge
        const shippingRandom = Math.random();
        if (shippingRandom > 0.6) {
            productBadges.push('freeshipping');
        }

        // Create badges HTML section
        let badgesHTML = '';
        if (productBadges.length > 0) {
            badgesHTML = '<div class="carousel-product-badges">';

            for (let i = 0; i < productBadges.length; i++) {
                const currentBadge = productBadges[i];
                let badgeImageHTML = '';

                if (currentBadge === 'bestseller') {
                    badgeImageHTML = '<img src="https://www.e-bebek.com/assets/images/cok-satan@2x.png" alt="Çok Satan" class="badge-icon">';
                } else if (currentBadge === 'star') {
                    badgeImageHTML = '<img src="https://www.e-bebek.com/assets/images/yildiz-urun@2x.png" alt="Yıldız Ürün" class="badge-icon">';
                } else if (currentBadge === 'freeshipping') {
                    badgeImageHTML = '<img src="https://www.e-bebek.com/assets/images/kargo-bedava@2x.png" alt="Kargo Bedava" class="badge-icon">';
                }

                badgesHTML += `<div class= "${currentBadge}">${badgeImageHTML}</div>`;
            }

            badgesHTML += '</div>';
        }

        // Create stars HTML section
        let starsHTML = '<span class="carousel-product-stars">';
        for (let i = 0; i < 5; i++) {
            const isStarFilled = i < productRating;
            const starClass = isStarFilled ? 'fas fa-star carousel-product-star' : 'fas fa-star carousel-product-star empty';
            starsHTML += `<i class="${starClass}"></i>`;
        }
        starsHTML += '</span>';

        // Create price HTML section
        let priceHTML = '<div class="carousel-product-price">';

        if (hasProductDiscount) {
            priceHTML += '<div class="carousel-product-original-price">';
            priceHTML += product.original_price.toFixed(2) + ' TL';
            priceHTML += '<span class="carousel-product-discount">%' + discountPercentage;
            priceHTML += '<i class="fas fa-chevron-down"></i></span></div>';
        }

        const currentPriceClass = hasProductDiscount ? 'carousel-product-current-price' : 'carousel-product-current-price no-discount';
        priceHTML += '<div class="' + currentPriceClass + '">' + product.price.toFixed(2) + ' TL</div>';
        priceHTML += '</div>';

        // Create the product card HTML
        const productCardHTML = `
            <div class="carousel-product-card" data-product-id="${product.id}">
                <div class="carousel-product-image-container">
                    <img src="${product.img}" alt="${product.name}" class="carousel-product-image" loading="lazy">

                    ${badgesHTML}

                    <div class="carousel-product-favorite ${isProductInFavorites ? 'active' : ''}" data-product-id="${product.id}">
                        <i class="far fa-heart"></i>
                        <i class="fas fa-heart" style="display: none;"></i>
                    </div>
                </div>

                <div class="carousel-product-content">
                    <div class="carousel-product-name">
                        <span class="carousel-product-brand">${product.brand || 'Marka'}</span> - <span class="carousel-product-name-text">${product.name}</span>
                    </div>

                    <div class="carousel-product-rating">
                        ${starsHTML}
                        <span class="carousel-product-reviews">(${productReviews})</span>
                    </div>

                    ${priceHTML}

                    <div class="carousel-product-offer">Farklı Ürünlerde 3 Al 2 Öde</div>

                    <button class="carousel-product-button">Sepete Ekle</button>
                </div>
            </div>
        `;

        return productCardHTML;
    };

    //Set up event listeners
    const setEvents = () => {
        // Navigation buttons
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateCarousel('prev'));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateCarousel('next'));
        }

        document.addEventListener('click', handleGlobalClick);
    };

    // Handle global click events for carousel interactions
    const handleGlobalClick = (event) => {
        const clickedElement = event.target;

        // Check if user clicked on a favorite button (heart icon)
        const favoriteButtonElement = clickedElement.closest('.carousel-product-favorite');
        if (favoriteButtonElement) {
            const productIdFromButton = favoriteButtonElement.getAttribute('data-product-id');
            const productIdAsNumber = parseInt(productIdFromButton);

            toggleFavorite(productIdAsNumber, favoriteButtonElement);
        }

        // Check if user clicked on a product card
        const productCardElement = clickedElement.closest('.carousel-product-card');
        if (productCardElement) {
            const productIdFromCard = productCardElement.getAttribute('data-product-id');
            const productIdAsNumber = parseInt(productIdFromCard);

            const isFavoriteButtonClick = clickedElement.closest('.carousel-product-favorite');
            const isAddToCartButtonClick = clickedElement.closest('.carousel-product-button');

            if (!isFavoriteButtonClick && !isAddToCartButtonClick) {
                openProductPage(productIdAsNumber);
            }
        }
    };

    //Toggle favorite status
    const toggleFavorite = (productId, buttonElement) => {
        const isCurrentlyFavorite = state.favorites.includes(productId);

        if (isCurrentlyFavorite) {
            // Remove from favorites
            state.favorites = state.favorites.filter(id => id !== productId);
            buttonElement.classList.remove('active');
        } else {
            // Add to favorites
            state.favorites.push(productId);
            buttonElement.classList.add('active');
        }

        saveFavorites();
    };

    //Open product page in new tab
    const openProductPage = (productId) => {
        const product = state.products.find(p => p.id === productId);
        if (product && product.url) {
            window.open(product.url, '_blank');
        }
    };

      // Navigate carousel
    const navigateCarousel = (direction) => {
        const carouselItems = document.getElementById('carousel-items');
        if (!carouselItems) return;

        const scrollAmount = 260; // Fixed scroll amount
        const currentScroll = carouselItems.scrollLeft || 0;
        const maxScroll = carouselItems.scrollWidth - carouselItems.clientWidth;
        
        let newScroll;
        if (direction === 'prev') {
            newScroll = Math.max(0, currentScroll - scrollAmount);
        } else {
            newScroll = Math.min(maxScroll, currentScroll + scrollAmount);
        }
        
        // Use smooth scrolling with scrollLeft
        carouselItems.scrollLeft = newScroll;
    };

    init();

})();