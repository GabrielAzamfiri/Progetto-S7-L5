const params = new URLSearchParams(window.location.search);
const id = params.get("productId");

window.addEventListener("DOMContentLoaded", function () {
  fetch("https://striveschool-api.herokuapp.com/api/product/" + id, {
    headers: {
      // chiave di autenticazione
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZmM4MjdjMjM5YzAwMTUyZjRiNTIiLCJpYXQiOjE3MTgzNTMwMjYsImV4cCI6MTcxOTU2MjYyNn0.wvwthnuS4Ct3hKjPQC4Wnr2cq07PbzR5tf5cz64bM4g",
    },
  })
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw `Errore ${resp.status} : ${resp.statusText} `;
      }
    })
    .then(prodotto => {
      const container = document.getElementById("dettagli-prodotto");

      // svuotiamo il contenitore (togliendo anche lo spinner di conseguenza) e creiamo la struttura già con i dati ottenuti dal server
      container.innerHTML = "";
      const col = this.document.createElement("div");
      col.className = "col ";

      const img = document.createElement("img");
      img.src = prodotto.imageUrl;
      img.className = "object-fit-cover my-3 w-100 border border-info";
      img.setAttribute("height", "500");
      const h2 = document.createElement("h2");
      h2.innerText = prodotto.brand + " " + prodotto.name;
      const price = document.createElement("p");
      price.innerText = prodotto.price + " $";
      price.className = "text-info fs-3 fw-bold";
      const description = document.createElement("p");
      description.innerText = prodotto.description;
      description.className = " fs-5 fw-bold";
      const modifica = document.createElement("a");
      modifica.innerText = "Modifica";
      modifica.className = "btn  btn-info fs-5 my-3";
      modifica.addEventListener("click", handleEditBtnClick);
      col.append(img, h2, price, description, modifica);
      container.append(col);
    })
    .catch(err => alert(err));
});

const handleEditBtnClick = () => {
  window.location.assign("./back-office.html?productId=" + id);
};
