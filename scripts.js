// Contient toutes les fonctions javascripts
const key = "TOKEN"; // Token : NE PAS PARTAGER


// Fonctions utilitaires
function decodeURL(encoded) {
    let parser = new DOMParser;
    let dom = parser.parseFromString(
        '<!doctype html><body>' + encoded,  // Corrige les problèmes de décodage html
        'text/html');
    return dom.body.textContent;
}

function cleartable() {
    let table = document.getElementById("results");
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
}

async function play_sound(name) { // Joue un son pour le piano
    let sound = new Audio()
    sound.src = `song/${name}.ogg`;
    await sound.play()
}


// Fonctions d'affichage
let mobile = false;

function hide_rgpd() { // Cacher le popup cookie
    document.getElementById("CookieSecure").style.display = "none";
}

function show_rgpd() { // Afficher le popup cookie
    document.getElementById("CookieSecure").style.display = "block";
}

function hide_popup() { // Cacher le popup video et arrêter la vidéo
    document.getElementById("embed-video").src = 0;
    document.getElementById("popup_yt").style.display = "none";
}

function display_embed(id) { // Afficher le popup vidéo
    document.getElementById("popup_yt").style.display = "flex";
    if (document.getElementById("embed-video")) {
        document.getElementById("embed-video").remove();
    }
    let iframe = document.createElement("iframe");
    iframe.id = "embed-video";
    iframe.width = "700";
    iframe.height = "455";
    iframe.src = `https://www.youtube.com/embed/${id}`;
    iframe.frameborder = "0";
    iframe.allow = "autoplay; encrypted-media";
    iframe.setAttribute("allowfullscreen", "");
    document.getElementById("embed-content").appendChild(iframe);
}

function hide_sociaux() {
    document.getElementById("reseaux-liste").remove();
    document.getElementById("popup").style.display = "none";
}

function show_sociaux() {
    document.getElementById("popup").style.display = "flex";
    let parent = document.getElementById("reseaux-popup");
    let div = document.createElement("div");
    div.id = "reseaux-liste";
    let tab = [];
    tab.push(document.createElement("div"));
    tab[0].classList.add("reseaux");
    let img = [];
    img.push(document.createElement("img"));
    img[0].setAttribute("style", "width: 60px;padding-right: 10px;");
    img[0].src = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/1200px-Octicons-mark-github.svg.png";
    img[0].alt = 'github';
    let name = [];
    name.push(document.createElement('a'));
    name[0].href = "https://github.com/Samrhan/Musik";
    name[0].target = "_blank";
    name[0].append(document.createTextNode("Github"));
    for (let i = 0; i < tab.length; i++) {
        tab[i].appendChild(img[i])
        tab[i].appendChild(name[i])
        div.appendChild(tab[i])
    }
    parent.appendChild(div);

}

function mobile_menu() {
    let scroll = document.getElementById("scroll");
    let menu = document.getElementById("header");
    let piano = document.getElementById("main-piano");
    console.log(menu.style.display);
    if (!menu.style.display || menu.style.display === "none") {

        if (piano) {
            piano.style.display = 'none';
        }
        menu.style.display = "flex";
        scroll.style.top = "520px";
    } else {
        if (piano) {
            piano.style.display = 'block';
        }
        menu.style.display = "none";
        scroll.style.top = "0";
    }
}


// Fonction du menu déroulant
let is_open = 0; // Si un menu déroulant est ouvert

function display_scrolling_menu(color = "black", path = "", onglet_str = "ong_compositeurs") { // Menu déroulant
    if (is_open !== onglet_str) {
        if (document.getElementById("menu-open"))
            document.getElementById("menu-open").remove(); // Si un autre menu déroulant est ouvert on le ferme
        let onglet = document.getElementById(onglet_str);
        let div = document.createElement("div"); // On crée les éléments html
        div.id = "menu-open";
        div.style.backgroundColor = color;
        div.classList.add("menu-deroulant");
        let li = document.createElement("li");
        div.appendChild(li);
        let span = document.createElement("span");
        let paragraph = document.createElement('p');
        let tab_compo = [];
        let list;
        if (onglet_str === "ong_compositeurs") // On choisit ce qu'il faut mettre en fonction du menu demandé
            list = [{file: "bach", display_name: "Bach"}, {file: "mozart", display_name: "Mozart"},
                {file: "beethoven", display_name: "Beethoven"}, {file: "chopin", display_name: "Chopin"},
                {file: "liszt", display_name: "Liszt"}];
        if (onglet_str === "ong_groupes")
            list = [{file: "beatles", display_name: "The Beatles"}, {file: "queen", display_name: "Queen"},
                {file: "metallica", display_name: "Metallica"}, {file: "guns", display_name: "Guns N' Roses"}];
        for (let i = 0; i < list.length; i++) { // On crée les élements avec les liens vers les pages
            tab_compo.push(document.createElement('a'));
            tab_compo[i].appendChild(document.createTextNode(list[i].display_name));
            if (color === "white") {
                tab_compo[i].style.color = "#34383c"
            }
            if (window.location.pathname.indexOf(list[i].file) !== -1) {
                tab_compo[i].onclick = () => // Si l'utilisateurs demande la même page, on fait simplment un scrolling vers le haut
                    document.getElementById('scroll-begin').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'start'
                    });

            } else {
                if (onglet_str === "ong_compositeurs")
                    tab_compo[i].href = `${path}compositeurs/${list[i].file}.html`
                if (onglet_str === "ong_groupes")
                    tab_compo[i].href = `${path}groupes/${list[i].file}.html`
            }
        }
        paragraph.style.display = "flex";
        paragraph.style.flexDirection = "column";
        for (let i = 0; i < list.length; i++) {
            paragraph.appendChild(tab_compo[i]);
        }
        span.appendChild(paragraph);
        li.appendChild(span);
        onglet.appendChild(div);
        is_open = onglet_str;
    }
}

function disable_menu() {
    if (is_open) { // Ferme le menu déroulant
        document.getElementById("menu-open").remove();
        is_open = 0;
    }

}


// Fonction de recherches
let last_search = ""; // Contient la dernière recherche pour ne pas effectuer deux fois la même et ainsi économiser des requêtes

async function search_yt() {
    let query = document.getElementById("search").value;
    if (last_search !== query) {
        last_search = query;
        const max = 10;
        const part = "snippet";
        const type = "video";
        let base = "https://www.googleapis.com/youtube/v3";
        let request = new XMLHttpRequest();
        let table = document.getElementById("results")
        cleartable();
        request.open("GET", `${base}/search?part=${part}&key=${key}&maxResults=${max}&type=${type}&q=${encodeURI(query)}&alt=json`, true);
        request.onload = function next() { // Note : XMLHttpRequest est deprecated uniquement en synchrone, dans le cas présent on l'utilise en asynchrone
            if (request.readyState === 4) {
                if (request.status === 200) {
                    let res = request.responseText;
                    for (let i = 0; i < max; i++) {
                        let infos = JSON.parse(res).items[i]; // On transforme la réponse en objet utilisable
                        let row = [table.insertRow(-1)];
                        row.push(table.insertRow(-1)); // On crée un mini tableau pour l'affichage
                        let cell = [[]];
                        for (let i = 0; i < 2; i++) {
                            cell.push([])
                            for (let j = 0; j < 2; j++) {
                                cell[i].push(row[i].insertCell(j));
                            }
                        }
                        let img = document.createElement('img');
                        img.src = infos.snippet.thumbnails.medium.url; // On crée les elements html
                        cell[0][0].appendChild(img);
                        cell[0][0].rowSpan = 2; // On prend 2 lignes pour l'image
                        let title = document.createElement('a');
                        title.appendChild(document.createTextNode(decodeURL(infos.snippet.title)));
                        cell[0][1].appendChild(title);
                        cell[0][1].classList.add("video-title");
                        cell[1][0].appendChild(document.createTextNode(decodeURL(infos.snippet.description)));
                        cell[1][0].classList.add("video-description");
                        row[1].onclick = () => display_embed(infos.id.videoId); // Création des lien avec l'embed
                        row[1].style.cursor = "pointer";
                        row[0].onclick = () => display_embed(infos.id.videoId);
                        row[0].style.cursor = "pointer";
                    }

                }
            }
        }
        request.send(null);
    }
}

async function search_wiki() {
    let query = document.getElementById("search").value
    if (last_search !== query) {
        last_search = query;
        //Recherche wikipédia
        if (document.getElementById("definition")) {
            await document.getElementById("definition").remove();
        }
        if (document.getElementById("definition-photo")) {
            await document.getElementById("definition-photo").remove(); // Asynchrone pour pouvoir attendre que les éléments soient bien supprimé. Sinon ça fonctionne mal en fonction de l'ordinateur du client

        }
        let params = {
            prop: "extracts",
            action: "query",
            list: "search",
            srsearch: encodeURI(query),
            format: "json",
        };
        let url_wikipedia = "https://fr.wikipedia.org/w/api.php";
        url_wikipedia = url_wikipedia + "?origin=*";
        // Permet d'éviter l'erreur cors
        Object.keys(params).forEach(function (key) {
            url_wikipedia += "&" + key + "=" + params[key];
        });
        console.log(url_wikipedia);
        fetch(url_wikipedia)
            // requête pour avoir les resultats de recherche et recupérer l'id
            .then(res => res.json())
            .then(json => {
                let search_result = json.query.search[0];
                if (search_result) {
                    let id = search_result.pageid;
                    fetch(`https://fr.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts|pageimages&piprop=original&explaintext&pageids=${id}&inprop=url`)
                        // requête pour avoir l'article lié à l'id obtenu précédement
                        .then(res => res.json())
                        .then((json) => {
                            let to_send = (json.query.pages[id].extract).replace(/</g, "〈").replace(/>/g, '〉'); // Petits tricks pour éviter les injections html
                            to_send = to_send.replace(/====/g, '==').replace(/ ==/g, '</h1>').replace(/== /g, "<h1>").replace(/=/g, ''); // Petit tricks pour mettre des balises titre aux titres
                            let tab = [to_send.substr(0, to_send.indexOf('\n')), to_send.slice(to_send.indexOf('\n'))]
                            for (let i = 0; i < 2; i++) {
                                tab[i] = tab[i].replace(/\n/g, "<br>");
                                let section = document.createElement('section');   // On crée les sections et les éléments HTMl comme sur une page basique.
                                section.classList.add("Section");
                                if (i === 0)
                                    section.id = "definition-photo";
                                if (i === 1)
                                    section.id = "definition";
                                let div = document.createElement("div");
                                div.classList.add("SectionInner");
                                let div_text = document.createElement('div');
                                div_text.classList.add("SectionText");
                                div_text.style.flex = "42 1 0";
                                if (i === 0) {
                                    let titre = document.createElement('h1');
                                    titre.appendChild(document.createTextNode(json.query.pages[id].title));
                                    div_text.appendChild(titre);
                                    if (json.query.pages[id].original) { // Si il y a une image
                                        let image = json.query.pages[id].original.source;
                                        section.style.marginTop = '50px';
                                        let img_div = document.createElement('div');
                                        img_div.classList.add("SectionImg")
                                        img_div.style.flex = "58 1 0";
                                        let html_img = document.createElement('img');
                                        html_img.src = image;
                                        html_img.alt = "image";
                                        img_div.appendChild(html_img);
                                        div.appendChild(img_div);
                                    }
                                }
                                let text = document.createElement('p');
                                text.innerHTML = tab[i]; // On utilise innerHTML ici dans la mesure où on met le texte en forme à l'aide de balise plus haut.
                                let scroll = document.getElementById("scroll");
                                scroll.appendChild(section); // Création de l'arbre
                                section.appendChild(div);
                                div.appendChild(div_text);
                                div_text.appendChild(text);
                            }
                        })
                } else {
                    let section = document.createElement('section');   // On affiche "aucun résultat" si on ne trouve rien
                    section.classList.add("Section");
                    section.id = "definition";
                    let div = document.createElement("div");
                    div.classList.add("SectionInner");
                    let div_text = document.createElement('div');
                    div_text.classList.add("SectionText");
                    div_text.style.flex = "42 1 0";
                    let titre = document.createElement('h1')
                    titre.appendChild(document.createTextNode("Aucun résultat"));
                    div_text.appendChild(titre);
                    let scroll = document.getElementById("scroll");
                    scroll.appendChild(section);
                    section.appendChild(div);
                    div.appendChild(div_text);
                }
            })
            .catch();

    }
}

async function search_lyrics() {
    let song = encodeURIComponent(document.getElementById("search").value);
    if (last_search !== song) {
        last_search = song;
        if (document.getElementById("paroles")) {
            await document.getElementById("paroles").remove();
        }
        let request = new XMLHttpRequest();
        request.open("GET", `https://api.canarado.xyz/lyrics/${song}`, true);
        request.onload = function next() { // Note : XMLHttpRequest est deprecated uniquement en synchrone, dans le cas présent on l'utilise en asynchrone
            if (request.readyState === 4) {
                if (request.status === 200) {
                    let res = JSON.parse(request.responseText);
                    console.log(res);
                    let section = document.createElement('section');   // On crée les sections et les éléments HTMl comme sur une page basique.
                    section.classList.add("Section");
                    section.id = "paroles";
                    let div = document.createElement("div");
                    div.classList.add("SectionInner");
                    let div_text = document.createElement('div');
                    div_text.classList.add("SectionText");
                    div_text.style.flex = "42 1 0";
                    let titre = document.createElement('h1')
                    titre.appendChild(document.createTextNode(res.content[0].title));
                    div_text.appendChild(titre);
                    let text = document.createElement('p');
                    text = res.content[0].lyrics.replace(/\n/g, "<br>"); // De la même manière que plus haut sinon on ne peut pas mettre de retour à la ligne
                    let scroll = document.getElementById("scroll");
                    scroll.appendChild(section);
                    section.appendChild(div);
                    div.appendChild(div_text);
                    div_text.appendChild(text);
                }
            }
        }
        request.send(null);
    }
}


// Fonction de gestion d'evenements
let search_function = 0; // La fonction à utiliser en fonction de la page active pour les recherches

async function tab(event) {
    if (event.key === 'Enter') { // Si l'utilsateur appuie sur entrée dans une zone de saisie
        search_function();
    }
}

function listen(fonction) { // Si l'utilsateur est dans une zone de saisie
    search_function = fonction;
    addEventListener('keydown', tab, false)
}

