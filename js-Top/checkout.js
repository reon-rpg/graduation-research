document.addEventListener('DOMContentLoaded', () => {
    const orderReviewDiv = document.querySelector('.order-review');
    
    let cartData = [];
    try {
        const storedData = localStorage.getItem('fraiseCartData');
        if (storedData) {
            cartData = JSON.parse(storedData);
        }
    } catch (e) {
        console.error("LocalStorageからのデータ読み込みに失敗しました。", e);
    }

    if (cartData.length === 0) {
        orderReviewDiv.innerHTML = '<p style="color: #c9003c;">カート情報が取得できませんでした。カートに戻ってやり直してください。</p>';
        return;
    }

    let totalAmount = 0;
    let itemsHtml = '';
    let totalItemsCount = 0;

    cartData.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalAmount += subtotal;
        totalItemsCount += item.quantity;

        itemsHtml += `
            <div class="review-item">
                商品名: ${item.name} | 数量: ${item.quantity} | 価格: ¥${subtotal.toLocaleString()}
            </div>
        `;
    });

    const shippingFee = totalAmount >= 10000 ? 0 : 500;
    const grandTotal = totalAmount + shippingFee;

    const reviewContent = `
        <h3>商品明細 (${totalItemsCount}点)</h3>
        ${itemsHtml}
        <div class="review-summary">
            <p>商品小計: ¥ ${totalAmount.toLocaleString()}</p>
            <p>送料: ¥ ${shippingFee.toLocaleString()}</p>
            <p><strong>合計（税込）: ¥ ${grandTotal.toLocaleString()}</strong></p>
        </div>
    `;

    orderReviewDiv.innerHTML = reviewContent;
});
