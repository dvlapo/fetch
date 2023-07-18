const form = document.querySelector("form");
const responseMain = document.querySelector(".response__main");
const statusEl = document.querySelector("#status");
const messageEl = document.querySelector("#message");
const responseEl = document.querySelector(".response");
const errorEl = document.querySelector(".error-msg");
const loadingEl = document.querySelector(".loading");

const reqBodyText = document.querySelector("#req-body");
reqBodyText.setAttribute(
    "placeholder",
    JSON.stringify({ name: "De Gea", password: 1234 }, null, 2)
);

form.addEventListener("submit", handleSubmit);

async function handleSubmit(event) {
    event.preventDefault();
    clearPrevResponse();
    loadingEl.innerHTML = "Loading...";
    errorEl.innerHTML = "";

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
    loadingEl.innerHTML = "";
    responseEl.style.display = "block";
    messageEl.innerHTML = res.statusText;
    statusEl.innerHTML = res.status;
    const json = await res.json();
    const jsonStr = JSON.stringify(json, undefined, 2);
    responseMain.innerHTML = jsonStr;
}
function clearPrevResponse() {
    errorEl.innerHTML = "";
    responseEl.style.display = "none";
    messageEl.innerHTML = "";
    statusEl.innerHTML = "";
    responseMain.innerHTML = "";
}

const api = {
    handleGet: async (url, token) => {
        let res;
        try {
            if (token) {
                res = await fetch(url, {
                    // mode: "no-cors",
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                res = await fetch(url);
            }
        } catch (error) {
            errorEl.innerHTML = error;
        }

        const resClone = res.clone();
        await saveRequest({
            url,
            res: await resClone.json(),
            resStatus: res.status,
            statusText: res.statusText,
            method: "get",
        });
        loadingEl.innerHTML = "";

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
            // mode: "no-cors",
            body: JSON.stringify(bodyJSON),
            headers: headers,
        });
        loadingEl.innerHTML = "";

        const resClone = res.clone();
        await saveRequest({
            url,
            body: bodyJSON,
            res: await resClone.json(),
            resStatus: res.status,
            statusText: res.statusText,
            method: "post",
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
        loadingEl.innerHTML = "";

        const resClone = res.clone();
        await saveRequest({
            url,
            body: bodyJSON,
            res: await resClone.json(),
            resStatus: res.status,
            statusText: res.statusText,
            method: "put",
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
        loadingEl.innerHTML = "";

        const resClone = res.clone();
        await saveRequest({
            url,
            body: bodyJSON,
            res: await resClone.json(),
            resStatus: res.status,
            statusText: res.statusText,
            method: "delete",
        });

        updateUI(res);
    },
};

// DB Functions
async function openDB() {
    return await idb.openDB("f-storage", 1, {
        async upgrade(db) {
            await db.createObjectStore("requests", {
                keyPath: "req",
                autoIncrement: true,
            });
        },
    });
}

(async function () {
    await openDB();
    const db = await openDB();
    const savedRequests = await db.getAll("requests");
    updateRequestHistoryUI(savedRequests);
})();

function updateRequestHistoryUI(historyList) {
    const ul = document.querySelector("#history-list");
    ul.innerHTML = "";

    historyList
        .reverse()
        .splice(0, 5)
        .forEach((req) => {
            const html = `<small>${req.method}</small>
        <p>${req.url}</p>`;
            const li = document.createElement("li");
            li.innerHTML = html;

            li.setAttribute("role", "button");
            li.setAttribute("data-id", req.req);
            li.setAttribute("class", "req-item");
            ul.appendChild(li);
        });

    addHistoryListFn();
}

let reqInHistory;

function addHistoryListFn() {
    reqInHistory = document.querySelectorAll(".req-item");

    reqInHistory.forEach((req) => {
        req.addEventListener("click", async () => {
            const id = req.getAttribute("data-id");
            const db = await openDB();
            const savedRequests = await db.getAll("requests");

            const targ = savedRequests.find((req) => req.req === +id);
            // Update UI
            if (targ.resStatus === 200 || targ.resStatus === 201) {
                statusEl.classList.add("success");
                statusEl.classList.remove("error");
            } else {
                statusEl.classList.add("error");
                statusEl.classList.remove("success");
            }

            const url = document.querySelector(".url");

            // 🍝
            loadingEl.innerHTML = "";
            responseEl.style.display = "block";
            messageEl.innerHTML = targ.statusText;
            statusEl.innerHTML = targ.resStatus;
            targ.body
                ? (reqBodyText.value = JSON.stringify(targ.body, undefined, 2))
                : (reqBodyText.value = "");
            url.value = targ.url;
            responseMain.innerHTML = JSON.stringify(targ.res, undefined, 2);
        });
    });
}

window.addEventListener("DOMContentLoaded", addHistoryListFn);

async function saveRequest(obj) {
    try {
        const db = await openDB();
        await db.add("requests", obj);
        const savedRequests = await db.getAll("requests");
        updateRequestHistoryUI(savedRequests);
    } catch (error) {
        console.log(error);
    }
}
