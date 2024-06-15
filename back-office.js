const id = new URLSearchParams(window.location.search).get("productId");

const URL = id ? "https://striveschool-api.herokuapp.com/api/product/" + id : "https://striveschool-api.herokuapp.com/api/product/";
const method = id ? "PUT" : "POST";

window.addEventListener("DOMContentLoaded", function () {
  // al caricarimento della pagina colleghiamo l'evento submit sul nostro form
  const form = document.querySelector("form");
  // form.addEventListener("submit", handleSubmit)
  // che a sua volta quando verrà eseguito, invocherà la nostra funzione handleSubmit
  form.onsubmit = handleSubmit;

  // prendo il riferimento ai bottoni e al sottotitolo che modificheremo in seguito
  const subtitle = document.getElementById("subtitle");
  const submitBtn = document.querySelector("button[type='submit']");
  const deleteBtn = document.querySelector("button[type='button'].btn-danger");
  const resetBtn = document.querySelector("button[type='button'].btn-secondary");
  resetBtn.addEventListener("click", () => {
    const hasConfirmed = confirm("sei sicuro di voler fare reset del form?");
    if (hasConfirmed) {
      form.reset();
    }
  });
  // 0) inizio codice di gestione modalità modifica
  // al caricamento della pagina facciamo richiesta al server di tornarci i dati specifici della risorsa con l'id che troviamo nella URL
  if (id) {
    // se siamo qua dentro siamo sulla pagina in modalità MODIFICA per via della presenza di un id
    // 2) il testo del subtitle dovrà riflettere la modalità modifica
    subtitle.innerText = "—— Modifica Prodotto";
    submitBtn.innerText = "Modifica";
    submitBtn.classList.add("btn-info");
    // 3) il bottone delete diventa visibile
    deleteBtn.classList.remove("d-none");
    resetBtn.classList.add("d-none");
    // 4) assegnamo al bottone un evento di tipo click
    deleteBtn.onclick = handleDelete;

    // 1) prepopoliamo i campi con i dati di ritorno dalla chiamata su get specifica con id della risorsa

    fetch(URL, {
      headers: {
        // chiave di autenticazione
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZmM4MjdjMjM5YzAwMTUyZjRiNTIiLCJpYXQiOjE3MTgzNTMwMjYsImV4cCI6MTcxOTU2MjYyNn0.wvwthnuS4Ct3hKjPQC4Wnr2cq07PbzR5tf5cz64bM4g",
      },
    })
      .then(resp => resp.json())
      .then(prodotto => {
        // prepopolazione campi input con valori reperiti dal server su risorsa specifica
        // (per agevolare l'utente ed evitare errori di battitura)
        document.getElementById("name").value = prodotto.name;
        document.getElementById("description").value = prodotto.description;
        document.getElementById("img").value = prodotto.imageUrl;

        document.getElementById("price").value = prodotto.price;
        document.getElementById("brand").value = prodotto.brand;
      })
      .catch(err => alert(err));
  } else {
    // qui dentro ci entriamo quando siamo in modalità CREAZIONE per via dell'assenza dell'id
    subtitle.innerText = "—— Crea Prodotto";
    submitBtn.classList.add("btn-success");
  }
});

const handleDelete = () => {
  const deleteModalBtn = document.getElementById("delete-modal-btn");
  deleteModalBtn.addEventListener("click", () => {
    // se accetta procediamo all'effettiva rimozione
    fetch(URL, {
      method: "DELETE",

      headers: {
        // chiave di autenticazione
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZiZmM4MjdjMjM5YzAwMTUyZjRiNTIiLCJpYXQiOjE3MTgzNTMwMjYsImV4cCI6MTcxOTU2MjYyNn0.wvwthnuS4Ct3hKjPQC4Wnr2cq07PbzR5tf5cz64bM4g",
      },
    }) // già a questo punto la risorsa è stata eliminata
      // aspettare con un then ci può essere utile anche solo per sapere esattamente quando il server ci ha risposto per avere ulteriore conferma

      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw `Errore ${resp.status} : ${resp.statusText} `;
        }
      })
      .then(prodottoCancellato => {
        // alert("Hai eliminato il prodotto " + prodottoCancellato.brand + " " + prodottoCancellato.name);
        // l'alert è bloccante, questa operazione avverrà solo dopo che l'utente lo chiuderà
        // se non usassimo un alert qui servirebbe ritardare l'esecuzione del metodo assign di window,
        // ma siccome alert è "bloccante" in questo specifico caso non occorre
        window.location.assign("./index.html");
      })
      .catch(err => alert(err));
  });
};

const handleSubmit = e => {
  e.preventDefault(); // evitiamo il ricaricamento della pagina al click del bottone submit (e conseguente avvio dell'evento submit)

  const prodotto = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("img").value,
    price: document.getElementById("price").value,
  };

  fetch(URL, {
    // method: id ? "PUT" : "POST",
    // method: method,
    method: method,
    body: JSON.stringify(prodotto),
    headers: {
      "Content-Type": "application/json",
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
    .then(prodottoCreato => {
      // qui dentro abbiamo l'assoluta certezza che il dato è stato creato

      // Aspettiamo il valore di createdAppointment per estrarre un'informazione nuova generata dal server ad es. l'_id

      // in base a come siamo arrivati qui, per creazione o modifica, creeremo il messaggio più appropriato alla fine della richiesta

      if (id) {
        alert(`Prodotto ${prodottoCreato.brand} ${prodottoCreato.name} MODIFICATO con successo!`);
        window.location.assign("./index.html");
      } else {
        alert(`Prodotto ${prodottoCreato.brand} ${prodottoCreato.name} CREATO con successo!`);
        e.target.reset(); // reset dei campi del form solo in modalità CREAZIONE (POST)
      }
    })
    .catch(err => alert(err));
};
