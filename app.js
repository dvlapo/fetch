const button = document.querySelector("button");
const body = document.body;

button.addEventListener("click", function () {
    body.classList.toggle("dark-mode");
});

const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
).matches;

if (prefersDarkMode) {
    body.classList.add("dark-mode");
}

window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches }) => {
        if (matches) {
            body.classList.add("dark-mode");
        } else {
            body.classList.remove("dark-mode");
        }
    });
