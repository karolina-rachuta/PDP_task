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
