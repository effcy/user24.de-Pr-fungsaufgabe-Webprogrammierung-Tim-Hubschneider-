window.addEventListener("load", () => {
    /**------------------------------------------------------ 
     * DOM-Objekte 
     * ------------------------------------------------------*/
        const homeLink = document.querySelector('.main-page-header a');
        const searchForm = document.querySelector('.search-form form');
        const userContainerDiv = document.getElementById('userContainer');
        const userDetailDiv = document.getElementById('userDetail');
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
        let swapContent = (id, title) => {
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
        let routes = [
            {
                url: "^/$",
                show: () => swapContent("start-page", "Startseite"),
            },{
                url: "^/search/(.+)$",
                show: (matches) => {
                    let query = matches[1];
                    swapContent("search-results", "Suchergebnisse");
                    searchUsers(query, userContainerDiv, userDetailDiv, userPostsContainerDiv);
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

        let router = new Router(routes);
        router.start();

    // Event-Listener für Header-Navigation auf Startseite
    homeLink.addEventListener('click', (event) => {
        window.location.hash = '/';
    });

    searchForm.addEventListener('submit', (event) => {
        const query = event.target.elements.q.value;
        window.location.hash = `/search/${query}`;
    });
});

/**------------------------------------------------------ 
 * Funktionen
 * ------------------------------------------------------*/

const fetchData = (url) => {
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            return data;
        });
};

searchUsers = (query, userContainerDiv, userDetailDiv, userPostsContainerDiv) => {
    // Alle aktuell angezeigten User löschen
    userContainerDiv.innerHTML = '';

    fetchData(`https://dummyjson.com/users/search?q=${query}&select=id,image,username&limit=100`)
        .then(data => {

            if (data.users && data.users.length > 0) { //wenn Daten ankommen
                data.users.forEach(user => {
                    //UserDiv
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user');

                    //Image in UserDiv
                    const img = document.createElement('img');
                    img.src = user.image;
                    userDiv.appendChild(img);

                    //Span für Username in UserDiv
                    const usernameSpan = document.createElement('span');
                    usernameSpan.textContent = user.username;
                    userDiv.appendChild(usernameSpan);

                    // Hinzufügen des Click-Listeners zum userDiv
                    userDiv.addEventListener('click', () => {
                        window.location.hash = `/user/${user.id}`;
                    });

                    userContainerDiv.appendChild(userDiv);
                });
            } else {
                const searchUnsuccessfulDiv = document.createElement('div');
                searchUnsuccessfulDiv.innerHTML = "Es wurden leider keine passenden Ergebnisse gefunden ☹️. <br> Bitte erneut versuchen.";
                userContainerDiv.parentElement.appendChild(searchUnsuccessfulDiv);
            }
        });
}


showUserDetail = (id, userDetailDiv, userPostsContainerDiv) => {

    userDetailDiv.innerHTML = '';

    fetchData(`https://dummyjson.com/users/filter?key=id&value=${id}`)
        .then(data => {

            if (data.users && data.users.length > 0) {
                data.users.forEach(user => {
                    //UserDiv
                    const userDiv = document.createElement('div');
                    userDiv.classList.add('user');
                    
                    //Image in UserDiv
                    const img = document.createElement('img');
                    img.src = user.image;
                    userDiv.appendChild(img);

                    //Span für username in UserDiv
                    const usernameSpan = document.createElement('span');
                    usernameSpan.textContent = user.username;
                    userDiv.appendChild(usernameSpan);

                    //Span für first name in UserDiv
                    const firstNameSpan = document.createElement('span');
                    firstNameSpan.textContent = user.firstName;
                    userDiv.appendChild(firstNameSpan);

                    //Span für last name in UserDiv
                    const lastNameSpan = document.createElement('span');
                    lastNameSpan.textContent = user.lastName;
                    userDiv.appendChild(lastNameSpan);

                    //Span für age in UserDiv
                    const ageSpan = document.createElement('span');
                    ageSpan.textContent = user.age;
                    userDiv.appendChild(ageSpan);

                    //Span für gender in UserDiv
                    const genderSpan = document.createElement('span');
                    genderSpan.textContent = user.gender;
                    userDiv.appendChild(genderSpan);

                    userDetailDiv.appendChild(userDiv);

                    showUserPosts(id, userPostsContainerDiv);
                });
            }
        });
}

showUserPosts = (id, userPostsContainerDiv) => {

    userPostsContainerDiv.innerHTML = '';

    fetchData(`https://dummyjson.com/posts/user/${id}`)
        .then(data => {            

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
            } else {
                const postInformationDiv = document.createElement('div');
                postInformationDiv.classList.add('postInformation');
                postInformationDiv.textContent = "Dieser User hat bisher keine Posts verfasst.";

                userPostsContainerDiv.appendChild(postInformationDiv);
            }
        });
}