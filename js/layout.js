const toggleLayoutBtn = document.querySelector("#toggle-layout");
const block = document.querySelector(".bottom");

toggleLayoutBtn.addEventListener("change", () => {
    block.classList.toggle("stack");
});
