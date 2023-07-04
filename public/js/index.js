const baseUrl = "https://makemeshort.buzz";  // change to "http://localhost:3306" for local testing
const linkForm = document.getElementById("linkForm");
const longLinkInput = document.getElementById("longLinkInput");
const shortLinkInput = document.getElementById("shortLinkInput");
const shortLinkError = document.getElementById("shortLinkError");

longLinkInput.focus();

shortLinkInput.onkeyup = () => {
    validateShortUrl();
};
linkForm.onsubmit = (event) => {
    event.preventDefault();
    if (validateShortUrl() && longLinkInput.value.length > 0) {
        createShortUrl();
    }
};

function validateShortUrl() {
    if (isValidShortUrl(shortLinkInput.value) || shortLinkInput.value.length === 0) {
        shortLinkInput.style.border = "solid 1px gray";
        shortLinkError.innerHTML = "";
        shortLinkError.style.height = "0";
        return true;
    } else {
        shortLinkInput.style.border = "2px solid red";
        shortLinkError.innerHTML = "The custom link can be empty or contain only letters, numbers, underscores, and/or dashes.";
        shortLinkError.style.height = "auto";
        return false;
    }
}

function createShortUrl() {
    // TODO
    // if (validInput) {
    //   // TODO: give the possibly empty short link to the postUrl function.
    //   postUrl(longLinkInput.value).then((data) => {
    //     // TODO: display the short URL and a QR code on a new page.
    //     `<a href="https://makemeshort.buzz/${data}">makemeshort.buzz/${data}</a>`;
    //     longLinkInput.value = "";
    //     shortLinkInput.value = "";
    //   }).catch((error) => {
    //     console.log(error);
    //   });
    // }
}

async function postUrl(originalUrl, userId) {
    // userId is not required so users not logged in can create short links.
    const json = {
        "url": originalUrl,
        "userId": userId,
    }

    try {
        const response = await axios.post(`${baseUrl}/v1/url`, json);
        console.log(`status: ${response.status}`);
        if (response.status >= 200 && response.status < 300) {
            console.log(`data: ${response.data}`);
            return response.data;
        } else {
            console.log(`status: ${response.status}`);
        }
    } catch (error) {
        console.log(error);
    }
}
