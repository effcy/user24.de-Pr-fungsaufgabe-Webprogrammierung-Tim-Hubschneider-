window.addEventListener("load", () => {
    /**------------------------------------------------------ 
     * Hier benötigte DOM-Objekte 
     * ------------------------------------------------------*/
        const homeNav = document.querySelector('#main-page-header a');
        const userContainerDiv = document.getElementById('user-container');
        const homeButton = document.getElementById('back-home');
        const userDetailDiv = document.getElementById('user-detail-container');
        const userPostsContainerDiv = document.querySelector('.user-posts-container');
    
    /**------------------------------------------------------ 
     * SPA-Router 
     * ------------------------------------------------------*/
    /**
     * Hilfsfunktion zum Umschalten des sichtbaren Inhalts
     *
     * @param {String} id HTML-ID des anzuzeigenden <main>-Elements
     * @param {String} title Neuer Titel für den Browser-Tab
     */
    const swapContent = (id, title) => {
        document.querySelectorAll('main').forEach(mainElement => {
            mainElement.classList.add("hidden");
        })

        let element = document.querySelector(`#${id}`);
        if (element) element.classList.remove("hidden");

        document.title = `${title} | user24`;
    }

    /**
     * Konfiguration des URL-Routers
     */
    const routes = [
        {
            //Startseite
            url: "^/$",
            show: () => {
                swapContent("start-page", "Startseite");
                const searchInformationDiv = document.getElementById('search-information');
                searchInformationDiv.innerHTML = "Hier können Sie nach Usern suchen.<br>Geben Sie dazu einfach ihre Informationen in die Suche ein.";
            }
        },{
            //Suche fehlgeschlagen
            url: "^/search-failed/$",
            show: () => {
                swapContent("start-page", "Startseite");
                const searchInformationDiv = document.getElementById('search-information');
                searchInformationDiv.innerHTML = "Es wurden leider keine passenden Ergebnisse gefunden ☹️.<br>Bitte erneut versuchen.";
            }
        },{
            //Suchergebnis leere Suche: Alle User anzeigen
            url: "^/search/$",
            show: () => {
                swapContent("search-results", "Suchergebnisse");
                searchUsers("", userContainerDiv);
            }
         },{
            //Suchergebnis mit Suchbegriff
            url: "^/search/(.+)$",
            show: (matches) => {
                let query = matches[1];
                swapContent("search-results", "Suchergebnisse");
                searchUsers(query, userContainerDiv);
            }
        },{
            //Userdetailseite anhand UserId
            url: "^/user/(\\d+)$",
            show: (matches) => {
                let userId = matches[1];
                swapContent("user-detail", "Useransicht");
                showUserDetail(userId, userDetailDiv, userPostsContainerDiv);
            }
        }
    ];

    const router = new Router(routes);
    router.start();

    /**------------------------------------------------------ 
     * Event-Listener
     * ------------------------------------------------------*/

    // Event-Listener für Header-Navigation auf Startseite
    homeNav.addEventListener("click", (event) => {
        //Router lädt Startseite
        window.location.hash = '#/';
    });

    // Event-Listener für Absenden einer Suche
    document.querySelectorAll('.search-form form').forEach(searchForm => {
        searchForm.addEventListener("submit", (event) => {
            const query = event.target.elements.q.value;
            //if else, um leere Suche zu erlauben
            if (query === "") {
                window.location.hash = "/search/";
            } else {
                window.location.hash = `/search/${query}`;
            }
        });
    });
    
    // Event-Listener für "Zurück zur Startseite"-Button auf Userdetailseite
    homeButton.addEventListener("click", () => {
        //Router lädt Startseite
        window.location.hash = "#/";}
    )
});