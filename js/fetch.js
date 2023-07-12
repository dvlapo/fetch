const form = document.querySelector("form");
const outputMain = document.querySelector(".response__main");
const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const responseEl = document.querySelector(".response");
const errorEl = document.querySelector(".error-msg");

const reqBodyText = document.querySelector("#req-body");
reqBodyText.setAttribute("placeholder", '{"name": "De Gea", "password": 1234}');

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const method = data.get("method");
    const url = data.get("url");
    const req_body = data.get("req-body");
    const token = data.get("req-token");

    errorEl.innerHTML = "";

    if (method === "get") {
        api.handleGet(url, token);
    } else if (method === "post") {
        api.handlePost(url, req_body, token);
    }

    return;
}

async function updateUI(res) {
    if (res.status === 200 || res.status === 201) {
        statusEl.classList.add("success");
        statusEl.classList.remove("error");
    } else {
        statusEl.classList.add("error");
        statusEl.classList.remove("success");
    }
    responseEl.style.display = "block";
    messageEl.innerHTML = res.statusText;
    statusEl.innerHTML = res.status;
    const json = await res.json();
    const jsonStr = JSON.stringify(json);
    outputMain.innerHTML = jsonStr;
}

const api = {
    handleGet: async (url, token) => {
        let res;
        if (token) {
            res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } else {
            res = await fetch(url);
        }
        updateUI(res);
        return res;
    },
    handlePost: async (url, body, token) => {
        let res;
        let bodyJSON;
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        try {
            bodyJSON = JSON.parse(body);
        } catch (error) {
            errorEl.innerHTML = "Please enter the request body in JSON format";
        }

        if (token) {
            res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(bodyJSON),
                headers: headers,
            });
        } else {
            res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(bodyJSON),
                headers: headers,
            });
        }
        updateUI(res);
    },
};
