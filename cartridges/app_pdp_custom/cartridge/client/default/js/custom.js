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
        updateQuantity()
    }
})

quantity_minus_button.addEventListener("click", () => {
    if (getChosenValue > 1){
        getChosenValue--
        updateQuantity()
    }
})

function updateQuantity() {
    quantity_select.value = getChosenValue;
}
});