const API =
  "https://public-api.wordpress.com/rest/v1.1/sites/annapurani93.wordpress.com/posts";

async function loadPoems() {
  try {
    const response = await fetch(API);
    const data = await response.json();

    const poemsDiv = document.getElementById("poems");

    poemsDiv.innerHTML = "";

    data.posts.forEach(post => {
      const card = document.createElement("div");
      card.className = "poem-card";
      card.onclick = () => {
  window.location.href =
    `poem.html?id=${post.ID}`;
};

      card.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.date.substring(0,10)}</p>
        <hr>
      `;

      poemsDiv.appendChild(card);
    });
  }

  catch (error) {
    document.getElementById("poems").innerHTML =
      "Could not load poems.";
    console.error(error);
  }
}

loadPoems();
