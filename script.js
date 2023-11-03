window.addEventListener("load", () => {
    /**------------------------------------------------------ 
     * DOM-Objekte 
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
    router.start();

    /**------------------------------------------------------ 
     * Event-Listener
     * ------------------------------------------------------*/

    // Event-Listener für Header-Navigation auf Startseite
    homeNav.addEventListener("click", (event) => {
        window.location.hash = '#/';
    });

    // Event-Listener für Absenden einer
    document.querySelectorAll('.search-form form').forEach(searchForm => {
        searchForm.addEventListener("submit", (event) => {
            const query = event.target.elements.q.value;
            if (query === "") {
                window.location.hash = "/search/";
            } else {
                window.location.hash = `/search/${query}`;
            }
        });
    });
    

    // Event-Listener für "Zurück zur Startseite"-Button
    homeButton.addEventListener("click", () => {
        window.location.hash = "#/";}
    )
});

/**------------------------------------------------------ 
 * Hilfsfunktionen
 * ------------------------------------------------------*/

const fetchData = (url) => {
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Fehler beim fetchen von URL: ${url}`);
        }
        return response.json();
    });
};
  

searchUsers = (query, userContainerDiv) => {
    // Alle aktuell angezeigten User löschen
    userContainerDiv.innerHTML = "";

    const resultsInput = document.getElementById('results-input');
    resultsInput.placeholder = query;


    fetchData(`https://dummyjson.com/users/search?q=${query}&select=id,image,username&limit=100`)
        .then(data => {

            //wenn mind. 1 Datenpunkt ankommt, dann...
            if (data.users && data.users.length > 0) { 
                data.users.forEach(user => {
                    //UserDiv
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user');
                    userDiv.classList.add('userOverview');

                    //image in UserDiv
                    const img = document.createElement('img');
                    img.src = user.image;
                    userDiv.appendChild(img);

                    //Span für Username in UserDiv
                    const usernameSpan = document.createElement('span');
                    usernameSpan.textContent = user.username;
                    userDiv.appendChild(usernameSpan);

                    // Hinzufügen des Click-Listeners zum userDiv
                    userDiv.addEventListener("click", () => {
                        window.location.hash = `/user/${user.id}`;
                    });

                    userContainerDiv.appendChild(userDiv);
                });
            //wenn kein Datenpunkt ankommt...
            } else {
                window.location.hash = "#/search-failed/";
            }
        });
}


showUserDetail = (id, userDetailDiv, userPostsContainerDiv) => {

    userDetailDiv.innerHTML = "";

    fetchData(`https://dummyjson.com/users/filter?key=id&value=${id}`)
        .then(data => {

            //wenn mind. 1 Datenpunkt ankommt, dann...
            if (data.users && data.users.length > 0) {
                data.users.forEach(user => {
                    //UserDiv
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user');
                    userDiv.classList.add('userDetail');

                    //image in imgDiv in UserDiv
                    const imgDiv = document.createElement('div');
                    const img = document.createElement('img');
                    img.src = user.image;
                    imgDiv.appendChild(img);

                    //featuresDiv für folgende Eigenschaften
                    const featuresDiv = document.createElement('div');

                    //username in UserDiv
                    const usernameDiv = document.createElement('div');
                    usernameDiv.classList.add('user-features');
                    const usernameSpan = document.createElement('span');
                    usernameSpan.textContent = 'username';
                    usernameSpan.classList.add('user-characteristics');
                    const usernameValueSpan = document.createElement('span');
                    usernameValueSpan.textContent = user.username;
                    usernameDiv.appendChild(usernameSpan);
                    usernameDiv.appendChild(usernameValueSpan);
                    featuresDiv.appendChild(usernameDiv);

                    //first name in UserDiv
                    const firstNameDiv = document.createElement('div');
                    firstNameDiv.classList.add('user-features');
                    const firstNameSpan = document.createElement('span');
                    firstNameSpan.textContent = 'first name';
                    firstNameSpan.classList.add('user-characteristics');
                    const firstNameValueSpan = document.createElement('span');
                    firstNameValueSpan.textContent = user.firstName;
                    firstNameDiv.appendChild(firstNameSpan);
                    firstNameDiv.appendChild(firstNameValueSpan);
                    featuresDiv.appendChild(firstNameDiv);

                    //last name in UserDiv
                    const lastNameDiv = document.createElement('div');
                    lastNameDiv.classList.add('user-features');
                    const lastNameSpan = document.createElement('span');
                    lastNameSpan.textContent = 'last name';
                    lastNameSpan.classList.add('user-characteristics');
                    const lastNameValueSpan = document.createElement('span');
                    lastNameValueSpan.textContent = user.lastName;
                    lastNameDiv.appendChild(lastNameSpan);
                    lastNameDiv.appendChild(lastNameValueSpan);
                    featuresDiv.appendChild(lastNameDiv);

                    //age in UserDiv
                    const ageDiv = document.createElement('div');
                    ageDiv.classList.add('user-features');
                    const ageSpan = document.createElement('span');
                    ageSpan.textContent = 'age';
                    ageSpan.classList.add('user-characteristics');
                    const ageValueSpan = document.createElement('span');
                    ageValueSpan.textContent = user.age;
                    ageDiv.appendChild(ageSpan);
                    ageDiv.appendChild(ageValueSpan);
                    featuresDiv.appendChild(ageDiv);

                    //gender in UserDiv
                    const genderDiv = document.createElement('div');
                    genderDiv.classList.add('user-features');
                    const genderSpan = document.createElement('span');
                    genderSpan.textContent = 'gender';
                    genderSpan.classList.add('user-characteristics');
                    const genderValueSpan = document.createElement('span');
                    genderValueSpan.textContent = user.gender;
                    genderDiv.appendChild(genderSpan);
                    genderDiv.appendChild(genderValueSpan);
                    featuresDiv.appendChild(genderDiv);

                    //imgDiv und featuresDiv an userDiv hängen
                    userDiv.appendChild(imgDiv);
                    userDiv.appendChild(featuresDiv);

                    //userDiv an userDetailDiv hängen
                    userDetailDiv.appendChild(userDiv);

                    //Posts des Users abrufen
                    showUserPosts(id, userPostsContainerDiv);
                });
            }
        });
}

showUserPosts = (id, userPostsContainerDiv) => {

    userPostsContainerDiv.innerHTML = "";

    fetchData(`https://dummyjson.com/posts/user/${id}`)
        .then(data => {            

            //wenn mind. 1 Datenpunkt ankommt, dann...
            if (data.posts && data.posts.length > 0) {
                data.posts.forEach(post => {
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