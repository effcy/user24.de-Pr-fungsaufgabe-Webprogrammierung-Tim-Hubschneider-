/**
 * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
 *
 * @param {String} id HTML-ID des anzuzeigenden <main>-Elements
 * @param {String} title Neuer Titel für den Browser-Tab
 */
export const swapContent = (id, title) => {
    document.querySelectorAll("main").forEach(mainElement => {
        mainElement.classList.add("hidden");
    })

    let element = document.querySelector(`#${id}`);
    if (element) element.classList.remove("hidden");

    document.title = `${title} | user24`;
}

/**
 * Konfiguration des URL-Routers
 */
export const routes = [
    {
        url: "^/$",
        show: () => {
            swapContent("start-page", "Startseite");
            const searchInformationDiv = document.getElementById('search-information');
            searchInformationDiv.innerHTML = "Hier können Sie nach Usern suchen.<br>Geben Sie dazu einfach ihre Informationen in die Suche ein.";
        }
    },{
        url: "^/search-failed/$",
        show: () => {
            swapContent("start-page", "Startseite");
            const searchInformationDiv = document.getElementById('search-information');
            searchInformationDiv.innerHTML = "Es wurden leider keine passenden Ergebnisse gefunden ☹️.<br>Bitte erneut versuchen.";
        }
    },{
        url: "^/search/$",
        show: () => {
            swapContent("search-results", "Suchergebnisse");
            searchUsers("", userContainerDiv);
        }
        },{
        url: "^/search/(.+)$",
        show: (matches) => {
            let query = matches[1];
            swapContent("search-results", "Suchergebnisse");
            searchUsers(query, userContainerDiv);
        }
    },{
        url: "^/user/(\\d+)$",
        show: (matches) => {
            let userId = matches[1];
            swapContent("user-detail", "Useransicht");
            showUserDetail(userId, userDetailDiv, userPostsContainerDiv);
        }
    }
];

const router = new Router(routes);
