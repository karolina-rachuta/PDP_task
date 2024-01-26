var btn_toggle = document.getElementsByClassName("btn_toggle")[0];
var p_short_Description = document.getElementsByClassName("p_short_Description")[0];
var p_long_Description = document.getElementsByClassName("p_long_Description")[0];

btn_toggle.addEventListener("click", () => {

    if (p_short_Description.style.display === "block") {
        p_short_Description.style.display = "none";
        p_long_Description.style.display = "block";
    } else if (p_short_Description.style.display === "none") {
        p_long_Description.style.display = "none";
        p_short_Description.style.display = "block";
    }
});
document.addEventListener("DOMContentLoaded", function () {
    var quantity_plus_button = document.querySelector(".quantity_plus_button");
    var quantity_minus_button = document.querySelector(".quantity_minus_button");
    var quantity_select = document.querySelector(".quantity_select");

var getChosenValue = parseInt(quantity_select.value);

quantity_plus_button.addEventListener("click", () => {
    if (getChosenValue < 10){
        getChosenValue++
        quantity_select.value = getChosenValue;
    }
})

quantity_minus_button.addEventListener("click", () => {
    if (getChosenValue > 1){
        getChosenValue--
        quantity_select.value = getChosenValue;
    }
})
});


    var delivery_button = document.querySelector(".delivery_button");
    var custom_delivery_info = document.querySelector(".custom_delivery_info");
    var minus_sign_delivery = document.querySelector(".minus_sign_delivery");
    var plus_sign_delivery = document.querySelector(".plus_sign_delivery");

    delivery_button.addEventListener("click", () => {
        if (custom_delivery_info.style.display === 'none') {
            custom_delivery_info.style.display = 'block';
            minus_sign_delivery.style.display = 'none'
            plus_sign_delivery.style.display = 'inline'

        } else if (custom_delivery_info.style.display === 'block') {
            custom_delivery_info.style.display = 'none';
            minus_sign_delivery.style.display = 'inline'
            plus_sign_delivery.style.display = 'none'
        }
    });