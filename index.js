// fetch("https://striveschool-api.herokuapp.com/api/product/", {
//   headers: {
//     Authorization:
//       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZmM4MjdjMjM5YzAwMTUyZjRiNTIiLCJpYXQiOjE3MTgzNTMwMjYsImV4cCI6MTcxOTU2MjYyNn0.wvwthnuS4Ct3hKjPQC4Wnr2cq07PbzR5tf5cz64bM4g",
//   },
// });
const isLoading = bool => {
  const spinner = document.querySelector(".spinner-border");

  if (bool) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

window.addEventListener("DOMContentLoaded", function () {
  // al caricamento del dom (pagina), avviamo una chiamata HTTP di tipo GET (implicito)
  fetch("https://striveschool-api.herokuapp.com/api/product/", {
    headers: {
      // chiave di autenticazione
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZmM4MjdjMjM5YzAwMTUyZjRiNTIiLCJpYXQiOjE3MTgzNTMwMjYsImV4cCI6MTcxOTU2MjYyNn0.wvwthnuS4Ct3hKjPQC4Wnr2cq07PbzR5tf5cz64bM4g",
    },
  })
    .then(resp => {
      if (resp.ok) {
        // restituiamo il dato convertito in array da JSON
        return resp.json();
      } else {
        throw `Errore ${resp.status} : ${resp.statusText} `;
      }
    })
    .then(prodotti => {
      isLoading(false); // stiamo rendendo invisibile lo spinner perché in qualche istante verranno generati gli elementi

      const row = document.getElementById("lista-prodotti");

      // cicliamo appointments per generare tanti elementi "li" nella pagina quanti sono gli oggetti contenuti nell'array
      prodotti.forEach(prodotto => {
        const col = this.document.createElement("div");
        col.className = "col-sm-6 col-md-4 col-lg-3";
        col.addEventListener("click", () => {
          window.location.assign("./dettaglio.html?productId=" + prodotto._id);
        });
        const card = document.createElement("div");
        card.className = "card mb-4 shadow-sm border border-info";
        const img = document.createElement("img");
        img.className = "bd-placeholder-img card-img-top object-fit-cover";
        img.setAttribute("height", "200");

        img.setAttribute("src", prodotto.imageUrl);

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";
        const h5 = document.createElement("h5");
        h5.innerText = prodotto.brand;
        const name = document.createElement("p");
        name.innerText = prodotto.name;
        const p = document.createElement("p");
        p.innerText = prodotto.price + " $";
        p.className = "text-info";

        const divFlex = document.createElement("div");
        divFlex.className = "d-flex justify-content-between align-items-center";
        // const btnGroup = document.createElement("div");
        // btnGroup.className = "btn-group";
        const btnModif = document.createElement("a");
        btnModif.type = "button";
        btnModif.href = "./back-office.html?productId=" + prodotto._id;
        btnModif.className = "btn  btn-info";
        btnModif.innerText = "Modifica";

        cardBody.append(h5, name, p, divFlex, btnModif);
        card.append(img, cardBody);
        col.append(card);
        row.append(col);
      });
    })
    .catch(err => alert(err));
});
