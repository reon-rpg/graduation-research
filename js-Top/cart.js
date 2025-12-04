const POINT_RATE = 0.03;

window.addDemoItem = (id, name, price, quantity, imagePath) => {
    let cartItems = JSON.parse(localStorage.getItem('fraiseCartData') || '[]');
    const existingItem = cartItems.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cartItems.push({ id, name, price, quantity, imagePath });
    }
    localStorage.setItem('fraiseCartData', JSON.stringify(cartItems));
    alert(`[デモ] ${name}をカートに追加しました。ページをリロードして確認してください。`);
};

document.addEventListener('DOMContentLoaded', () => {
    const itemContainer = document.getElementById('cart-items-container');
    const messageDisplay = document.getElementById('cart-message');
    const itemCountSpan = document.getElementById('item-count');
    const subtotalLabelSpan = document.getElementById('summary-label');
    const subtotalAmountSpan = document.getElementById('subtotal-amount');
    const shippingAmountSpan = document.getElementById('shipping-amount');
    const grandtotalAmountSpan = document.getElementById('grandtotal-amount');
    const emptyMessageDiv = document.getElementById('empty-cart-message');
    const checkoutButton = document.getElementById('checkout-button');
    const gainedPointsAmountSpan = document.getElementById('gained-points-amount');
    
    function displayMessage(msg, type = 'success') {
        if (!messageDisplay) return;

        messageDisplay.textContent = msg;
        messageDisplay.style.display = 'block';

        if (type === 'success') {
            messageDisplay.style.borderColor = '#4CAF50';
            messageDisplay.style.backgroundColor = '#e8f5e9';
            messageDisplay.style.color = '#388E3C';
        } else if (type === 'error') {
            messageDisplay.style.borderColor = '#c9003c';
            messageDisplay.style.backgroundColor = '#ffe0e0';
            messageDisplay.style.color = '#c9003c';
        }

        setTimeout(() => {
            messageDisplay.style.display = 'none';
        }, 3000);
    }

    function loadCartFromLocalStorage() {
        try {
            const storedData = localStorage.getItem('fraiseCartData');
            return storedData ? JSON.parse(storedData) : [];
        } catch (e) {
            console.error("LocalStorageからのデータ読み込みに失敗しました。", e);
            return [];
        }
    }

    function saveCartToLocalStorage(cartData) {
        try {
            localStorage.setItem('fraiseCartData', JSON.stringify(cartData));
        } catch (e) {
            console.error("LocalStorageへの保存に失敗しました。", e);
        }
    }
    
    function initializeCart() {
        if (itemContainer) {
            itemContainer.addEventListener('change', handleQuantityChange);
            itemContainer.addEventListener('click', handleRemoveItem);
        }
        
        if (checkoutButton) {
            checkoutButton.addEventListener('click', () => {
                saveCartToLocalStorage(loadCartFromLocalStorage());
            });
        }
        
        const cartItems = loadCartFromLocalStorage();
        renderCart(cartItems);
    }

    function renderCart(cartItems) {
        itemContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            emptyMessageDiv.style.display = 'block';
            itemContainer.appendChild(emptyMessageDiv);
            updateCartSummary(0, 0); 
            checkoutButton.style.opacity = '0.5';
            checkoutButton.style.pointerEvents = 'none';
            return;
        }

        emptyMessageDiv.style.display = 'none';
        checkoutButton.style.opacity = '1';
        checkoutButton.style.pointerEvents = 'auto';

        let totalSubtotal = 0;
        let totalItems = 0;

        cartItems.forEach(item => {
            const subtotal = item.price * item.quantity;
            totalSubtotal += subtotal;
            totalItems += item.quantity;
            
            const itemHtml = createCartItemElement(item, subtotal);
            itemContainer.appendChild(itemHtml);
        });

        updateCartSummary(totalItems, totalSubtotal);
    }

    function createCartItemElement(item, subtotal) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.dataset.itemId = item.id;

        div.innerHTML = `
            <div class="item-image-area">
                <img src="${item.imagePath || 'image/placeholder.jpg'}" alt="${item.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-price-data" style="display: none;">${item.price}</p>
                <p class="item-price">¥ ${item.price.toLocaleString()} (税込)</p>
                <div class="item-quantity-controls">
                    <label for="quantity-${item.id}">数量:</label>
                    <input type="number" id="quantity-${item.id}" name="quantity-${item.id}" value="${item.quantity}" min="1" max="10" class="item-quantity">
                    <button class="remove-button">削除</button>
                </div>
                <p class="item-subtotal">小計: ¥ ${subtotal.toLocaleString()}</p>
            </div>
        `;
        return div;
    }

    function updateCartSummary(totalItems, totalSubtotal) {
        const gainedPoints = Math.floor(totalSubtotal * POINT_RATE);
        const shippingFee = totalSubtotal >= 10000 ? 0 : 500;
        const grandTotal = totalSubtotal + shippingFee; 
        
        itemCountSpan.textContent = totalItems;
        subtotalLabelSpan.textContent = `商品合計 (${totalItems}点)`;
        subtotalAmountSpan.textContent = `¥ ${totalSubtotal.toLocaleString()}`;
        gainedPointsAmountSpan.textContent = `${gainedPoints.toLocaleString()} pt`;
        shippingAmountSpan.textContent = `¥ ${shippingFee.toLocaleString()}`;
        grandtotalAmountSpan.textContent = `¥ ${grandTotal.toLocaleString()}`;
    }

    function handleQuantityChange(event) {
        if (event.target.classList.contains('item-quantity')) {
            const quantityInput = event.target;
            const newQuantity = parseInt(quantityInput.value);
            const itemId = quantityInput.id.replace('quantity-', '');

            let cartItems = loadCartFromLocalStorage();
            const item = cartItems.find(i => i.id === itemId);

            if (!item || newQuantity < 1) {
                displayMessage('数量は1以上を設定してください。', 'error');
                if(item) quantityInput.value = item.quantity;
                return;
            }
            
            updateCartItemAPI(itemId, newQuantity)
                .then(response => {
                    if (response.success) {
                        item.quantity = newQuantity;
                        saveCartToLocalStorage(cartItems);
                        renderCart(cartItems);
                        displayMessage(`商品ID ${itemId}の数量を${newQuantity}に変更しました。`);
                    } else {
                        displayMessage(response.message || '数量の変更に失敗しました。', 'error');
                        quantityInput.value = item.quantity;
                    }
                })
                .catch(error => {
                    console.error('通信エラー:', error);
                    displayMessage('通信エラーが発生しました。', 'error');
                });
        }
    }

    function handleRemoveItem(event) {
        if (event.target.classList.contains('remove-button')) {
            const itemElement = event.target.closest('.cart-item');
            if (!itemElement) return;

            const itemId = itemElement.dataset.itemId;
            
            deleteCartItemAPI(itemId)
                .then(response => {
                    if (response.success) {
                        let cartItems = loadCartFromLocalStorage();
                        cartItems = cartItems.filter(item => item.id !== itemId);
                        saveCartToLocalStorage(cartItems);
                        
                        renderCart(cartItems);
                        displayMessage(`商品ID ${itemId}をカートから削除しました。`);
                    } else {
                        displayMessage(response.message || '商品の削除に失敗しました。', 'error');
                    }
                })
                .catch(error => {
                    console.error('通信エラー:', error);
                    displayMessage('通信エラーが発生しました。', 'error');
                });
        }
    }

    function updateCartItemAPI(itemId, quantity) {
        return new Promise(resolve => {
            setTimeout(() => {
                if (Math.random() > 0.1) { 
                    resolve({ success: true, newSubtotal: quantity * 3500 }); 
                } else {
                    resolve({ success: false, message: '在庫切れのため、数量を変更できませんでした。' });
                }
            }, 300);
        });
    }

    function deleteCartItemAPI(itemId) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ success: true });
            }, 300);
        });
    }

    initializeCart();
});

/**
 * 注文完了時にカートの内容をクリアする関数
 * この関数は、thankyou-page-main が読み込まれたときに実行されるべきです。
 */
function clearCartAfterOrder() {
    // 注文番号が表示されている要素（.order-number）があるかを確認し、
    // 注文完了ページであることを判定します。
    const orderNumberElement = document.querySelector('.order-number');

    if (orderNumberElement) {
        // カートの内容を localStorage から削除
        // キー名 'cartItems' を 'fraiseCartData' に修正
        localStorage.removeItem('fraiseCartData'); 
        
        console.log('注文完了ページが読み込まれたため、カートの中身をクリアしました。');
    }
}

// ページが完全に読み込まれた後に、クリア処理を実行
document.addEventListener('DOMContentLoaded', clearCartAfterOrder);