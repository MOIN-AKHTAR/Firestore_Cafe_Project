const Ul = document.querySelector("#cafe-list");
const Form = document.querySelector("#add-cafe-form");

// Add Cafe
Form.addEventListener("submit", (e) => {
  e.preventDefault();
  db.collection("cafe").add({
    name: Form.name.value,
    city: Form.city.value,
  });
  Form.name.value = "";
  Form.city.value = "";
});

// Realtime Listeners
db.collection("cafe")
  .orderBy("city")
  .onSnapshot((snapShot) => {
    // Detetcting Changes
    let changes = snapShot.docChanges();
    changes.forEach((change) => {
      if (change.type === "added") {
        render(change.doc);
      } else if (change.type === "removed") {
        let li = document.querySelector("[data-id=" + change.doc.id + "]");
        Ul.removeChild(li);
      }
    });
  });

//   Render Docs
const render = function (doc) {
  let li = document.createElement("li");
  li.setAttribute("data-id", doc.id);
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "X";
  cross.addEventListener("click", deleteItem);
  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  Ul.appendChild(li);
};

// Delete Single Doc
const deleteItem = (e) => {
  e.stopPropagation();
  let id = e.target.parentElement.getAttribute("data-id");
  db.collection("cafe").doc(id).delete();
};
