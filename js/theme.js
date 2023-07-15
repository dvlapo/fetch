const colorThemeToggleButton = document.querySelector(".color-theme-btn");
const body = document.body;

colorThemeToggleButton.addEventListener("click", function () {
    if (!body.classList.contains("dark-mode")) {
        body.classList.add("dark-mode");
        localStorage.setItem("f-theme", "dark");
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("f-theme", "light");
    }
});

// Check user theme preference
const prefersDarkMode = window.matchMedia(
    "(prefers-color-scheme: dark)"
).matches;

const localTheme = localStorage.getItem("f-theme");
if (localTheme === "dark") {
    body.classList.add("dark-mode");
} else if (localTheme === "light") {
    body.classList.remove("dark-mode");
} else if (prefersDarkMode) {
    body.classList.add("dark-mode");
}

// Change theme when user changes preference
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({ matches }) => {
        if (matches) {
            body.classList.add("dark-mode");
            localStorage.setItem("f-theme", "dark");
        } else {
            body.classList.remove("dark-mode");
            localStorage.removeItem("f-theme");
        }
    });

// Grain background
const grainBg = document.querySelector(".grain");
const grainContainer = document.querySelector(".grain-container");

function setGrainBgDimensions() {
    window.scrollTo(0, 0);
    const html = document.documentElement;
    const { height } = html.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    grainContainer.style.height = `${height + 300}px`;
    grainBg.setAttribute("viewBox", `0 0 ${windowWidth} ${height + 300}`);
}

setGrainBgDimensions();
window.addEventListener("resize", setGrainBgDimensions);
