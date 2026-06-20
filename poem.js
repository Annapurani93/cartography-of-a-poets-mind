const API =
  "https://public-api.wordpress.com/rest/v1.1/sites/annapurani93.wordpress.com/posts";

const params =
  new URLSearchParams(window.location.search);

const postId = params.get("id");

async function loadPoem() {
  const response = await fetch(API);
  const data = await response.json();

  const poem =
    data.posts.find(
      p => p.ID == postId
    );

  if (!poem) {
    document.getElementById("poem-container")
      .innerHTML = "Poem not found.";
    return;
  }

  document.getElementById("poem-container")
    .innerHTML = `
      <h1>${poem.title}</h1>

      <p>${poem.date.substring(0,10)}</p>

      <div>
        ${poem.content}
      </div>
    `;
}

loadPoem();
