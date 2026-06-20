const API =
'https://public-api.wordpress.com/rest/v1.1/sites/annapurani93.wordpress.com/posts?number=1000';

let allPoems = [];

async function loadPoems(){

    const response =
        await fetch(API);

    const data =
        await response.json();

    allPoems =
        data.posts;

    populateStats();

    populateYears();

    renderPoems(allPoems);

    addFilters();
}

function renderPoems(poems){

    const poemsDiv =
        document.getElementById("poems");

    poemsDiv.innerHTML = "";

    poems.forEach(post=>{

        const card =
            document.createElement("div");

        card.className =
            "poem-card";

        const excerpt =
            stripHtml(post.excerpt)
                .substring(0,140);

        card.innerHTML = `
            <h2>${post.title}</h2>

            <div class="poem-date">
                ${new Date(post.date)
                    .toDateString()}
            </div>

            <div class="poem-excerpt">
                ${excerpt}
            </div>
        `;

        card.onclick = () => {
            window.location.href =
                `poem.html?id=${post.ID}`;
        };

        poemsDiv.appendChild(card);
    });
}

function populateStats(){

    document.getElementById(
        "total-poems"
    ).innerText =
        allPoems.length;

    const years =
        allPoems.map(
            p=>new Date(p.date)
            .getFullYear()
        );

    const firstYear =
        Math.min(...years);

    document.getElementById(
        "years-writing"
    ).innerText =
        new Date().getFullYear()
        - firstYear + 1;

    let words = [];

    allPoems.forEach(post=>{

        const text =
            stripHtml(
                post.content
            );

        words.push(
            ...text
            .toLowerCase()
            .split(/\s+/)
        );
    });

    document.getElementById(
        "total-words"
    ).innerText =
        words.length
        .toLocaleString();

    const unique =
        new Set(words);

    document.getElementById(
        "unique-words"
    ).innerText =
        unique.size
        .toLocaleString();
}

function populateYears(){

    const select =
        document.getElementById(
            "year-filter"
        );

    const years =
        [...new Set(
            allPoems.map(
                p=>new Date(p.date)
                .getFullYear()
            )
        )]
        .sort()
        .reverse();

    years.forEach(year=>{

        const option =
            document.createElement(
                "option"
            );

        option.value =
            year;

        option.textContent =
            year;

        select.appendChild(option);
    });
}

function addFilters(){

    document.getElementById(
        "search"
    )
    .addEventListener(
        "input",
        filterPoems
    );

    document.getElementById(
        "year-filter"
    )
    .addEventListener(
        "change",
        filterPoems
    );
}

function filterPoems(){

    const search =
        document.getElementById(
            "search"
        )
        .value
        .toLowerCase();

    const year =
        document.getElementById(
            "year-filter"
        )
        .value;

    const filtered =
        allPoems.filter(post=>{

            const matchesSearch =
                post.title
                .toLowerCase()
                .includes(search);

            const matchesYear =
                year === "all"
                ||
                new Date(post.date)
                .getFullYear()
                ==
                year;

            return matchesSearch
                &&
                matchesYear;
        });

    renderPoems(filtered);
}

function stripHtml(html){

    const div =
        document.createElement(
            "div"
        );

    div.innerHTML =
        html;

    return div.textContent
        ||
        div.innerText
        ||
        "";
}

loadPoems();
