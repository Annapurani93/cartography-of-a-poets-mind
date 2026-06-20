const BASE_API =
'https://public-api.wordpress.com/rest/v1.1/sites/annapurani93.wordpress.com/posts';

let allPoems = [];

async function loadPoems() {

  try {

    let page = 1;
    let finished = false;
    allPoems = [];

    while (!finished) {

      const response = await fetch(
        `${BASE_API}?number=100&page=${page}`
      );

      const data = await response.json();

      if (!data.posts || data.posts.length === 0) {
        finished = true;
        break;
      }

      allPoems.push(...data.posts);

      page++;

      if (page > 20) {
        break;
      }
    }

    console.log(
      "Total posts:",
      allPoems.length
    );

    populateStats();
    populateYears();
    renderPoems(allPoems);
    addFilters();

  }

  catch(error) {
    console.error(error);
  }
}

loadPoems();

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

function populateStats() {

  document.getElementById(
    "total-poems"
  ).innerText =
    allPoems.length.toLocaleString();

  if (allPoems.length === 0) {
    return;
  }

  const years =
    allPoems
      .map(
        p => new Date(p.date)
          .getFullYear()
      )
      .filter(Boolean);

  const firstYear =
    Math.min(...years);

  document.getElementById(
    "years-writing"
  ).innerText =
    (
      new Date().getFullYear()
      -
      firstYear
      +
      1
    ).toLocaleString();

  let words = [];

  allPoems.forEach(post => {

    const text =
      stripHtml(
        post.content || ""
      );

    words.push(
      ...text
        .toLowerCase()
        .split(/\s+/)
        .filter(
          word => word.length > 0
        )
    );
  });

  document.getElementById(
    "total-words"
  ).innerText =
    words.length.toLocaleString();

  document.getElementById(
    "unique-words"
  ).innerText =
    new Set(words)
      .size
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

function filterPoems() {

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
    allPoems.filter(post => {

      const title =
        (post.title || "")
          .toLowerCase();

      const matchesSearch =
        title.includes(search);

      const matchesYear =
        year === "all"
        ||
        String(
          new Date(post.date)
            .getFullYear()
        ) === year;

      return (
        matchesSearch
        &&
        matchesYear
      );
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
