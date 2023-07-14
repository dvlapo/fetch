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
    clearUI();

    const data = new FormData(event.target);
    const method = data.get("method");
    const url = data.get("url");
    const req_body = data.get("req-body");
    const token = data.get("req-token");

    if (method === "get") {
        api.handleGet(url, token);
    } else if (method === "post") {
        api.handlePost(url, req_body, token);
    } else if (method === "put") {
        api.handlePut(url, req_body, token);
    } else if (method === "delete") {
        api.handleDelete(url, req_body, token);
    }
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
function clearUI() {
    errorEl.innerHTML = "";
    responseEl.style.display = "none";
    messageEl.innerHTML = "";
    statusEl.innerHTML = "";
    outputMain.innerHTML = "";
}

const api = {
    handleGet: async (url, token) => {
        let res;
        try {
            if (token) {
                res = await fetch(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                res = await fetch(url);
            }
        } catch (error) {
            errorEl.innerHTML = error;
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

        if (body) {
            try {
                bodyJSON = JSON.parse(body);
            } catch (error) {
                errorEl.innerHTML =
                    "Please enter the request body in JSON format";
            }
        }

        res = await fetch(url, {
            method: "POST",
            body: JSON.stringify(bodyJSON),
            headers: headers,
        });

        updateUI(res);
    },
    handlePut: async (url, body, token) => {
        let res;
        let bodyJSON;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        if (body) {
            try {
                bodyJSON = JSON.parse(body);
            } catch (error) {
                errorEl.innerHTML =
                    "Please enter the request body in JSON format";
            }
        }

        res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify(bodyJSON),
            headers: headers,
        });

        updateUI(res);
    },
    handleDelete: async (url, body, token) => {
        let res;
        let bodyJSON;

        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };

        if (body) {
            try {
                bodyJSON = JSON.parse(body);
            } catch (error) {
                errorEl.innerHTML =
                    "Please enter the request body in JSON format";
            }
        }

        res = await fetch(url, {
            method: "DELETE",
            body: JSON.stringify(bodyJSON),
            headers: headers,
        });

        updateUI(res);
    },
};
