
    const products = [
            { id: 1, name: 'Premium Soap Bar', price: 120, img: 'SB' },
            { id: 2, name: 'Ultra Detergent 1kg', price: 450, img: 'UD' },
            { id: 3, name: 'Liquid Sraf 500ml', price: 320, img: 'LS' },
            { id: 4, name: 'Antibacterial Soap', price: 150, img: 'AS' },
            { id: 5, name: 'Dish Wash Pack', price: 280, img: 'DW' }
        ];

        let cart = [];
        let activeProduct = null;
        let editIdx = -1;

        function renderProducts(filter = "") {
            const grid = document.getElementById('productGrid');
            const filtered = products.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
            grid.innerHTML = filtered.map(p => `
                <div class="product-card" tabindex="2" onclick="openAddModal(${p.id})" onkeypress="if(event.key==='Enter') openAddModal(${p.id})">
                    <div class="product-img">${p.img}</div>
                    <div class="product-name">${p.name}</div>
                    <b style="color:var(--primary)">Rs ${p.price}</b>
                </div>
            `).join('');
        }

        function openAddModal(id) {
            editIdx = -1;
            activeProduct = products.find(p => p.id === id);
            showModal("qtyModal", "Add to Order", activeProduct.name, 1);
        }

        function openEditModal(idx) {
            editIdx = idx;
            const item = cart[idx];
            showModal("qtyModal", "Edit Quantity", item.name, item.qty);
        }

        function showModal(modalId, title, pName, qty) {
            if(modalId === "qtyModal") {
                document.getElementById('modalTitle').innerText = title;
                document.getElementById('modalPName').innerText = pName;
                document.getElementById('qtyInput').value = qty;
            }
            document.getElementById(modalId).classList.add('active');
            if(modalId === "qtyModal") setTimeout(() => document.getElementById('qtyInput').focus(), 100);
        }

        function handleConfirm() {
            const qty = parseInt(document.getElementById('qtyInput').value);
            if(qty < 1 || isNaN(qty)) return;

            if(editIdx > -1) {
                cart[editIdx].qty = qty;
            } else {
                const existing = cart.find(i => i.id === activeProduct.id);
                if(existing) existing.qty += qty;
                else cart.push({...activeProduct, qty});
            }
            
            closeModal('qtyModal');
            updateCart();
            document.getElementById('searchInput').focus();
            document.getElementById('searchInput').value = "";
            renderProducts();
        }

        function updateCart() {
            const list = document.getElementById('cartItems');
            list.innerHTML = cart.map((item, i) => `
                <div class="cart-item">
                    <div class="item-details">
                        <h4 style="font-size:0.85rem">${item.name}</h4>
                        <span style="font-size:0.75rem">${item.qty} x Rs ${item.price}</span>
                    </div>
                    <div class="item-actions">
                        <span class="btn-edit" onclick="openEditModal(${i})">Edit</span>
                        <span class="btn-delete" onclick="deleteItem(${i})">×</span>
                    </div>
                </div>
            `).join('');
            
            const total = cart.reduce((s, i) => s + (i.qty * i.price), 0);
            document.getElementById('total').innerText = `Rs ${total}`;
            document.getElementById('itemCount').innerText = cart.length;
        }

        function deleteItem(idx) {
            cart.splice(idx, 1);
            updateCart();
        }

        function openCheckoutModal() {
            if(cart.length === 0) return alert("Cart is empty!");
            const receipt = document.getElementById('receiptContent');
            receipt.innerHTML = cart.map(item => `
                <div style="display:flex; justify-content:space-between; font-size:0.85rem; margin-bottom:4px;">
                    <span>${item.name} x${item.qty}</span>
                    <span>Rs ${item.qty * item.price}</span>
                </div>
            `).join('');
            
            const total = cart.reduce((s, i) => s + (i.qty * i.price), 0);
            document.getElementById('modalTotal').innerText = `Rs ${total}`;
            showModal("checkoutModal");
        }

        function finalizeOrder() {
            cart = [];
            updateCart();
            closeModal('checkoutModal');
            document.getElementById('searchInput').focus();
        }

        function filterProducts() { renderProducts(document.getElementById('searchInput').value); }
        function closeModal(id) { document.getElementById(id).classList.remove('active'); }

        // Keyboard Logic
        window.onload = () => { renderProducts(); document.getElementById('searchInput').focus(); };
        window.addEventListener('keydown', (e) => {
            if(e.key === 'F10') openCheckoutModal();
            if(e.key === 'Escape') { closeModal('qtyModal'); closeModal('checkoutModal'); }
        });
        document.getElementById('qtyInput').addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleConfirm();
        });
