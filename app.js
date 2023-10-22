// Substitua com suas credenciais Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCj4o5N3cnCDgLsB8H-N2B3VNp8cCB3ffU",
  authDomain: "school-b1e12.firebaseapp.com",
  projectId: "school-b1e12",
  storageBucket: "school-b1e12.appspot.com",
  messagingSenderId: "84264977548",
  appId: "1:84264977548:web:dcd84a9a8f5f9c60afa7a9",
};

// Inicializar o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function addExpense() {
  const descript = document.getElementById("description").value;
  const amount = Number(document.getElementById("amount").value);
  const addSucess = document.getElementById("addsucess");
  console.log(descript, amount);
  if (descript && !isNaN(amount)) {
    db.collection("transaction")
      .add({
        description: descript,
        amount: amount,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((e) => {
        addSucess.style.display = "block";
        setInterval(() => {
          addSucess.style.display = "none";
        }, 3000);
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    alert("Verifique os dados inseridos");
  }
}

// Aqui usei o snapshot do fire para verificar em tempo real!
db.collection("transaction")
  .orderBy("timestamp", "desc")
  .onSnapshot((snap) => {
    const list = document.getElementById("expenses-list");
    const total = document.getElementById("totaldebts");
    list.innerHTML = "";
    let totalAmountDebts = 0;
    snap.forEach((e) => {
      const data = e.data();
      const newDiv = document.createElement("div");
      newDiv.innerHTML = `<p class="plist"><strong>${
        data.description
      }</strong> - ${parseFloat(data.amount).toFixed(
        2
      )}  <button onclick="show('${data.description}','${data.amount}','${
        e.id
      }')"><i class="fa-solid fa-pen-to-square"></i></button><button style="margin-left:10px;" onclick="deleteDoc('${
        e.id
      }')"><i class="fa-sharp fa-solid fa-trash"></i></button></p>`;
      list.appendChild(newDiv);

      totalAmountDebts += parseFloat(data.amount);
    });
    if (totalAmountDebts !== 0) {
      total.style.display = "block";
      total.innerHTML = `O total das suas despesas é R$${totalAmountDebts}`;
    }
  });

function show(description, amount, id) {
  const show = document.getElementById("edit-form-container");
  const editSucess = document.getElementById("editsucess");

  show.style.display = "block";

  const editDescriptionInput = document.getElementById("edit-description");
  const editAmountInput = document.getElementById("edit-amount");
  editAmountInput.value = amount;
  editDescriptionInput.value = description;

  saveEdit = () => {
    db.collection("transaction")
      .doc(id)
      .update({
        description: editDescriptionInput.value,
        amount: editAmountInput.value,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        editSucess.style.display = "block";
        setInterval(() => {
          editSucess.style.display = "none";
        }, 3000);
        // Esconder o formulário após a edição
        show.style.display = "none";
      })
      .catch((error) => {
        console.error("Erro ao editar despesa:", error);
      });
  };
  cancelEdit = () => {
    show.style.display = "none";
  };
}

function deleteDoc(id) {
  const confirmationDialog = document.getElementById("confirmation-dialog");
  confirmationDialog.style.display = "block";
  confirmDelete = () => {
    db.collection("transaction")
      .doc(id)
      .delete()
      .then(() => {
        confirmationDialog.style.display = "none";

        location.reload();
      })
      .catch(() => {
        alert("Erro");
      });
  };
  cancelDelete = () => {
    confirmationDialog.style.display = "none";
  };
}
