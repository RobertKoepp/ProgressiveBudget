const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
let db;
var request = indexedDB.open("budgetapp",1)
request.onupgradeneeded = function({target}) {
    const db = target.result;
    db.createObjectStore("working",{
        autoIncrement: true
    });
  };
request.onsuccess = function({target}){
    db = target.result
    if(navigator.onLine){
        lookDatabase()
    }
}
function saveDB(opject){
    const transaction = db.transaction(["working"],"readwrite")
const objectsStore=transaction.objectsStore("working")
objectsStore.add(object)
}
function lookDatabase(){
    const budget = db.transaction(["pending"], "readwrite");
  const objectstore = budget.objectStore("pending");
  const getAll = objectstore.getAll();
  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        return response.json();
      })
      .then(() => {
        // delete records if successful
        const budget = db.transaction(["working"], "readwrite");
        const objectstore = budget.objectStore("working");
        objectstore.clear();
      });
    }
  };
}
window.addEventListener("working", lookDatabase)