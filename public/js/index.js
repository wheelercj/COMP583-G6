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
        createShortLink(longLinkInput.value, shortLinkInput.value);
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
        shortLinkError.innerHTML = "The custom link can be empty or contain only letters, numbers, underscores, and/or dashes. It must be 30 characters or less.";
        shortLinkError.style.height = "auto";
        return false;
    }
}

function createShortLink(longLink, optionalShortLink) {
    longLinkInput.value = "";
    shortLinkInput.value = "";
    postLink(longLink, optionalShortLink).catch((error) => {
        console.log(error);
        if (error.response !== undefined && error.response.status === 409) {
            alert("Custom link already in use. Please choose a different one.");
            return;
        }
        alert("An error occurred. Please try again.");
    });
}

async function postLink(longLink, optionalShortLink) {
    let json = {
        "url": longLink,
    };
    if (optionalShortLink !== undefined && optionalShortLink !== "") {
        json["custom"] = optionalShortLink;
    }

    const response = await axios.post(`${baseUrl}/v1/url`, json);
    const shortLink = response.data;
    window.location.href = `/new-link?new=${shortLink}&original=${longLink}`;
}
