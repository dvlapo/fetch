const btnBody = document.querySelector(".btn-body");
const btnAuth = document.querySelector(".btn-auth");

const reqBodyForm = document.querySelector(".req-body");
const reqAuthForm = document.querySelector(".req-auth");

btnBody.addEventListener("click", (event) => {
    event.preventDefault();
    reqBodyForm.classList.replace("hide", "show");
    reqAuthForm.classList.add("hide");
});

btnAuth.addEventListener("click", (event) => {
    event.preventDefault();
    reqAuthForm.classList.replace("hide", "show");
    reqBodyForm.classList.add("hide");
});
