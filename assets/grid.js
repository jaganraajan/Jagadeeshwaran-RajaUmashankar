document.addEventListener('DOMContentLoaded', function() {
var popup = document.getElementById('product-popup');
var popupImage = document.getElementById('popup-product-image');
var popupTitle = document.getElementById('popup-product-title');
var popupDescription = document.getElementById('popup-product-description');
var popupColors = document.getElementById('popup-product-colors');
var popupSizes = document.getElementById('popup-product-sizes');
var popupPrice = document.getElementById('popup-product-price');
var popupClose = document.querySelector('.product-popup-close');
var addToCartButton = document.getElementById('add-to-cart-button');
var dropdownButton = document.querySelector('.dropdown-button');
var dropdown = document.querySelector('.dropdown');
var dropdownContent = document.querySelector('.dropdown-content');


// Function to show the product popup
window.showProductPopup = function(product) {
    popupImage.src = product.featured_image;
    popupImage.alt = product.title;
    popupTitle.textContent = product.title;
    popupDescription.innerHTML = product.description;
    popupPrice.textContent = (product.price / 100).toFixed(2)  + '€'; ; // Convert cents to euros and add euro symbol

    // Populate color options
    popupColors.innerHTML = '';
    var colors = [...new Set(product.variants.map(variant => variant.option2))];
    colors.slice(0, 2).forEach(function(color) {
    var colorOption = document.createElement('button');
    colorOption.className = 'color-option';
    var colorBox = document.createElement('span');
    colorBox.className = 'color-box';
    colorBox.setAttribute('style', 'background-color: ' + color.toLowerCase());
    var colorText = document.createElement('span');
    colorText.className = 'color-text';
    colorText.textContent = color;
    colorOption.appendChild(colorBox);
    colorOption.appendChild(colorText);
    popupColors.appendChild(colorOption);
    });

    // Handle color selection
    var colorOptions = document.querySelectorAll('.color-option');
    
    colorOptions.forEach(function(option) {
    option.addEventListener('click', function() {
        colorOptions.forEach(function(opt) { opt.classList.remove('selected'); });
        option.classList.add('selected');

        updatePrice(product);
    })});

    // Handle size selection
    popupSizes.addEventListener('change', function() {
    if (event.target.tagName === 'DIV') {
        var size = event.target.getAttribute('data-value');
        dropdownButton.textContent = size;
        updatePrice(product);
    }
    });


    // Handle add to cart
    addToCartButton.onclick = function() {
    addToCart(product);
    };

    popup.style.display = 'flex';
};

// Close popup on close button click
popupClose.addEventListener('click', function() {
    popup.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == popup) {
    popup.style.display = 'none';
    }
});

// Handle dropdown arrow direction
popupSizes.addEventListener('click', function() {
    popupSizes.classList.toggle('open');
    console.log('in dropdown click');
    console.log(event.target.tagName);
    console.log(event.target.getAttribute('data-value'));

    if (event.target.getAttribute('data-value')) {
        var size = event.target.getAttribute('data-value');
        dropdownButton.textContent = size;
        console.log(size);
    }
    if (popupSizes.classList.contains('open')) {
        dropdownContent.style.display = 'block'; // Or 'flex', 'grid', etc.
    } else {
        dropdownContent.style.display = 'none';
    }
    });

// Function to update the price based on selected options
function updatePrice(product) {
    var selectedColorElement = document.querySelector('.color-option.selected');
    var colorText = selectedColorElement.querySelector('.color-text');
    var selectedColor = colorText.textContent;
    var selectedSize = popupSizes.value;
    if (selectedColor && selectedSize) {
    var variant = product.variants.find(variant => 
        variant.option1 === selectedSize && variant.option2 === selectedColor.getAttribute('data-color')
    );
    if (variant) {
        popupPrice.textContent = (variant.price / 100).toFixed(2) + '€'; ; // Convert cents to euros and add euro symbol
    }
    }
}

// Function to add the selected product to the cart
function addToCart(product) {
    var selectedColorElement = document.querySelector('.color-option.selected');
    
    if(!selectedColorElement) {
    alert('Please select a valid color.');
    }

    var colorText = selectedColorElement.querySelector('.color-text'); 
    var selectedColor = colorText.textContent;
    var selectedSize = popupSizes.querySelector('.dropdown-button').textContent;

    // Add to cart only if the selected size and color are valid
    if (selectedColor && selectedSize && selectedSize.length < 3) {
    var variant = product.variants.find(variant => 
        variant.option1 === selectedSize && variant.option2 === selectedColor
    );
    // Add the selected variant to the cart
    if (variant) {
        fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: variant.id,
            quantity: 1
        })
        })
        .then(response => {
        if (response.ok) {
            // Open the cart notification
            var cartNotification = document.querySelector('cart-notification');
            if (cartNotification) {
            cartNotification.open();
            }
            // Add “Soft Winter Jacket” to cart when any product with variant options Black and Medium is added 
            if (selectedSize === 'M' && selectedColor === 'Black') {
            console.log('adding new item');
            addSoftWinterJacketItemToCart();
            } else {
            popup.style.display = 'none';
            }
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
        })
        .catch(error => {
        console.error('Error:', error);
        alert('Failed to add to cart.');
        });
    } else {
        alert('Please select a valid variant.');
    }
    } else {
    alert('Please select a color and size.');
    }
}

function addSoftWinterJacketItemToCart() {
    fetch('/cart/add.js', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: 44759342645380,
        quantity: 1
    })
    })
    .then(response => {
    if (response.ok) {
        // Open the cart notification
        var cartNotification = document.querySelector('cart-notification');
        if (cartNotification) {
        cartNotification.open();
        }
        popup.style.display = 'none';
    } else {
        return response.text().then(text => { throw new Error(text); });
    }
    })
    .catch(error => {
    console.error('Error:', error);
    alert('Failed to add Soft Winter Jacket item to cart.');
    });
}
});