

// Массив для корзины
let cart = [];

// Функция для добавления товара в корзину
function addToCart(product, pricePerKg, weight) {
    const totalWeight = parseFloat(weight); // Конвертируем вес в число
    if (isNaN(totalWeight) || totalWeight <= 0) {
        alert("Будь ласка, введіть коректну вагу!");
        return;
    }
    const totalPrice = totalWeight * pricePerKg; // Рассчитываем стоимость

    // Проверяем, есть ли уже этот товар в корзине
    const existingItem = cart.find(item => item.product === product);
    if (existingItem) {
        // Если товар уже есть, увеличиваем количество и пересчитываем стоимость
        existingItem.weight += totalWeight;
        existingItem.totalPrice += totalPrice;
    } else {
        // Если товара еще нет, добавляем новый элемент
        cart.push({ product, pricePerKg, weight: totalWeight, totalPrice });
    }
    updateCart();
}

// Функция для обновления отображения корзины
function updateCart() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = ''; // Очищаем список
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.product} - ${item.weight.toFixed(3)} кг - ${item.totalPrice.toFixed(2)} грн`;
        cartList.appendChild(li);
    });
}

// Функция для открытия модального окна
function openModal() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}

// Обработка отправки формы
document.getElementById('orderForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Останавливаем стандартное отправление формы
    
    // Получаем данные с формы
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    
    // Создаем строку с данными для Telegram
    let message = `Замовлення отримано!\n`;
    message += `Ім'я: ${name}\nТелефон: ${phone}\nАдреса: ${address}\n\n`;
    message += `Товари в корзині:\n`;
    cart.forEach(item => {
        message += `${item.product} - ${item.weight.toFixed(3)} кг - ${item.totalPrice.toFixed(2)} грн\n`;
    });

    // Отправляем сообщение в Telegram-бот
    sendToTelegram(message);

    // Очищаем корзину
    clearCart();

    // Показываем подтверждение
    alert(`Замовлення підтверджено!\nІм'я: ${name}\nТелефон: ${phone}\nАдреса: ${address}`);
    
    // Закрытие модального окна после отправки формы
    closeModal();
});

// Функция для очистки корзины
function clearCart() {
    cart = []; // Очищаем массив корзины
    updateCart(); // Обновляем отображение корзины
}

// Функция для отправки сообщения в Telegram
function sendToTelegram(message) {
    const token = '7621599012:AAECLnmZ21hINqFw0NJoi_uB6ctOxpP_CzA'; // Ваш токен Telegram бота
    const chat_id = '1374284770'; // Ваш chat_id
    
    // URL API Telegram для отправки сообщений
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    
    // Создаем объект с параметрами для запроса
    const params = {
        chat_id: chat_id,
        text: message
    };
    
    // Используем fetch для отправки POST-запроса
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Message sent to Telegram', data);
    })
    .catch(error => {
        console.error('Error sending message to Telegram', error);
    });
}
