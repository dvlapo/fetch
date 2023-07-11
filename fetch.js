const form = document.querySelector("form");
const outputMain = document.querySelector(".response__main");
const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const responseEl = document.querySelector(".response");

form.addEventListener("submit", handleSubmit);

// https://jsonplaceholder.typicode.com/todos/1

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const method = data.get("method");
    const url = data.get("url");

    if (method === "get") {
        const res = await api.handleGet(url);
        const json = await res.json();
        const jsonStr = JSON.stringify(json);
        outputMain.innerHTML = jsonStr;

        if (res.status === 200 || res.status === 201) {
            statusEl.classList.add("success");
            statusEl.classList.remove("error");
        } else {
            statusEl.classList.add("error");
            statusEl.classList.remove("success");
        }
    } else {
        throw new Error("Please use a valid method");
    }

    return;
}

const api = {
    handleGet: async (url) => {
        const res = await fetch(url);
        // console.log(res);
        responseEl.style.display = "block";
        messageEl.innerHTML = res.statusText;
        statusEl.innerHTML = res.status;
        return res;
    },
};
