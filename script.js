window.addEventListener("load", () => {
    /**------------------------------------------------------ 
     * Globale DOM-Objekte 
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

    // Event-Listener für Absenden einer
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

/**------------------------------------------------------ 
 * Funktionen
 * ------------------------------------------------------*/

// Funktion "fetchData" nimmt eine URL entgegen, sendet eine Anfrage an den entsprechender Server und wirft
// entweder einen Error oder gibt den Inhalt als json zurück
const fetchData = (url) => {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fehler beim fetchen von URL: ${url}`);
        }
        return response.json();
    });
};

// Funktion "fillUserContainerDiv" nimmt user und das entsprechende Div entgegen,
// in welchem das Suchergebnis des Users dargestellt wird
const fillUserContainerDiv = (user, userContainerDiv) => {
    //UserDiv
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.classList.add('userOverview');

    //image in UserDiv
    const img = document.createElement('img');
    img.src = user.image;
    userDiv.appendChild(img);

    //span für Username in UserDiv
    const usernameSpan = document.createElement('span');
    usernameSpan.textContent = user.username;
    userDiv.appendChild(usernameSpan);

    // Hinzufügen des Click-Listeners zum userDiv
    userDiv.addEventListener("click", () => {
        window.location.hash = `/user/${user.id}`;
    });

    userContainerDiv.appendChild(userDiv);
}
  
// Funktion "searchUsers" nimmt einen Suchbegriff sowie das Div, in welches die Suchergebnisse eingefügt werden entgegen.
// Im angegebenen Div werden dann alle Suchergebnisse als UserDivs eingefügt.
searchUsers = (query, userContainerDiv) => {
    // Alle aktuell angezeigten User löschen
    userContainerDiv.innerHTML = "";

    // Suchbegriff in Suchleiste schreiben
    const resultsInput = document.getElementById('results-input');
    resultsInput.placeholder = query;

    // Alle zur Suche passenden User abfragen
    fetchData(`https://dummyjson.com/users/search?q=${query}&select=id,image,username&limit=100`)
        .then(data => {

            //wenn mind. 1 Datenpunkt ankommt, dann...
            if (data.users && data.users.length > 0) { 
                data.users.forEach(user => {
                    // Gefundenen User im userContainerDiv darstellen
                    fillUserContainerDiv(user, userContainerDiv);
                });
            // wenn kein Datenpunkt ankommt...
            } else {
                // Router lädt "Suche fehlgeschlagen"-Seite 
                window.location.hash = "#/search-failed/";
            }
        });
}

// Funktion "fillUserPostsContainerDiv" nimmt einen Post des users entgegen und stellt diesen
// im userPostsContainerDiv dar
const fillUserPostsContainerDiv = (post, userPostsContainerDiv) => {
    //postTitleDiv
    const postTitleDiv = document.createElement('div');
    postTitleDiv.classList.add('postTitle');
    postTitleDiv.textContent = post.title;

    //postBodyDiv
    const postBodyDiv = document.createElement('div');
    postBodyDiv.classList.add('postBody');
    postBodyDiv.textContent = post.body;

    userPostsContainerDiv.appendChild(postTitleDiv);
    userPostsContainerDiv.appendChild(postBodyDiv);
}

// Funktion "showUserPosts" bekommt die userId sowie den Div-Container übergeben, in welchem
// die Posts des Users dargestellt werden.
showUserPosts = (userId, userPostsContainerDiv) => {
    //Posts des Users abfragen
    fetchData(`https://dummyjson.com/posts/user/${userId}`)
        .then(data => {            

            //wenn mind. 1 Datenpunkt ankommt, dann...
            if (data.posts && data.posts.length > 0) {
                data.posts.forEach(post => {
                    // Posts des Users im UserPostsContainerDiv darstellen
                    fillUserPostsContainerDiv(post, userPostsContainerDiv);
                });
            //wenn kein Datenpunkt ankommt...    
            } else {
                const postInformationDiv = document.createElement('div');
                postInformationDiv.classList.add('postInformation');
                postInformationDiv.textContent = "Dieser User hat bisher keine Posts verfasst.";

                userPostsContainerDiv.appendChild(postInformationDiv);
            }
        });
}

// Funktion "addFeature" nimmt den Darstellnamen des features, den Attributnamen beim user-Objekt,
// das user-Objekt selbst und das featuresDiv entgegen, in welches die entsprechenden HTML-Elemente zur Darstellung
// der Usereigenschaft eingefügt werden.
const addFeature = (featureName, attributeName, user, featuresDiv) => {
    const featureDiv = document.createElement('div');
    featureDiv.classList.add('user-features');
    
    const featureSpan = document.createElement('span');
    featureSpan.classList.add('user-characteristics');
    featureSpan.textContent = featureName;
    featureDiv.appendChild(featureSpan);
    
    const featureValueSpan = document.createElement('span');
    featureValueSpan.textContent = user[attributeName];
    featureDiv.appendChild(featureValueSpan);
    
    featuresDiv.appendChild(featureDiv);
}

// Funktion "fillUserDetailDiv" erzeugt alle benötigten HTML Elemente zur Darstellung der Eigenschaften
// der Users im userDetailDiv
const fillUserDetailDiv = (user, userDetailDiv) => {
    //UserDiv erzeugen (alle Informationen kommen hier rein)
    const userDiv = document.createElement('div');
    userDiv.classList.add('user');
    userDiv.classList.add('userDetail');

    //image in imgDiv in UserDiv
    const imgDiv = document.createElement('div');
    const img = document.createElement('img');
    img.src = user.image;
    imgDiv.appendChild(img);

    //featuresDiv als Container für die Eigenschaften
    const featuresDiv = document.createElement('div');

    //Eigenschaften mit Anzeigename und Attributname des users ins featuresDiv einfügen 
    addFeature('username', 'username', user, featuresDiv);
    addFeature('first name', 'firstName', user, featuresDiv);
    addFeature('last name', 'lastName', user, featuresDiv);
    addFeature('age', 'age', user, featuresDiv);
    addFeature('gender', 'gender', user, featuresDiv);

    //imgDiv und featuresDiv an userDiv hängen
    userDiv.appendChild(imgDiv);
    userDiv.appendChild(featuresDiv);
    //userDiv an userDetailDiv hängen
    userDetailDiv.appendChild(userDiv);
}

// Funktion "showUserDetail" bekommt die userId übergeben. Dazu auch zwei Divs.
// In das erste kommt der Detailinhalt zum User. Ins zweite Div kommen die Posts
// des entsprechenden User oder der Hinweis, dass der User bisher keine Posts verfasst hat.
showUserDetail = (userId, userDetailDiv, userPostsContainerDiv) => {
    // Entsprechende Divs leeren, falls vorher anderer User angezeigt wurde
    userDetailDiv.innerHTML = "";
    userPostsContainerDiv.innerHTML = "";

    // Detailinformationen des Users abfragen
    fetchData(`https://dummyjson.com/users/filter?key=id&value=${userId}`)
        .then(data => {
            // Wenn genau ein Datenpunkt (ausgewählter User) ankommt, dann
            if (data.users && data.users.length === 1) {
                data.users.forEach(user => {
                    // UserDetailDiv mit Detailinformationen des Users füllen
                    fillUserDetailDiv(user, userDetailDiv);

                    // Posts des Users abrufen
                    showUserPosts(userId, userPostsContainerDiv);
                });
            } else {
                throw new Error();
            }
        })
        .catch(error => {
            console.error(error.message);
            console.log("Bei der Abfrage der Userdetailinfos ist etwas schiefgelaufen");
        });
}

//test