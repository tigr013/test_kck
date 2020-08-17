import * as $ from 'jquery' // указываем абсолютный путь т.к. библиотеку берем из node_modules
import './assets/jquery.maskedinput.min.js' // маска для номера

$('body').on('click', '.delivery, .pickup', function() {
    $(this).siblings().removeClass('active')
    $(this).addClass('active')
})

$('[name="cyrillic"]').on('input', function() {
    this.value = this.value.replace(/[^а-яё]/i, '');
})

$('[name="phone"]').mask('+7(999) 999-9999')