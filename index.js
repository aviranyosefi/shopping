import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,onValue , remove,set , query, orderByChild, equalTo , get   } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://shopping-ac927-default-rtdb.europe-west1.firebasedatabase.app/",   
  };

const app = initializeApp(appSettings);
const database = getDatabase(app)
const shoopingListDB = ref(database,"shoopingList");
onValue(shoopingListDB, function(snapshot){
    if(snapshot.exists()){
        var  arrList = Object.entries(snapshot.val())
        var  arrList = arrList.sort(customSort);
        //console.log(JSON.stringify(arrList));
        shoppingListEl.innerHTML = ''
        for (let i=0;i<arrList.length;i++){
            addList(arrList[i])   
        }
    }
    else{
        shoppingListEl.innerHTML='No items'
    }
})

function addList(row){
        let ID = row[0];
        let name = row[1].name;
        let color = row[1].color;

        let newEl = document.createElement("li");
        newEl.textContent =name
        newEl.id = ID;
        newEl.style.backgroundColor  = color
        let LocationInDB = ref(database,`shoopingList/${ID}`);
       // newEl.addEventListener("dblclick",function(){  
         //   remove(LocationInDB)
       // });
       
        newEl.addEventListener("click",function(){
            debugger;
            newEl.className = "li-white";
            let changeColor= "white";
            if(color == 'white'){
                changeColor = 'green'
                newEl.className = "li-green";    
            }
            //newEl.style.color = changeColor;
            set(LocationInDB, {
                name : name,
                color:changeColor
              });
        })
        shoppingListEl.append(newEl)
}

const  inputFieldEl = document.getElementById("input=field")
const  addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const searchInput = document.getElementById('searchInput');

addButtonEl.addEventListener("click" , function(){
    debugger;
    let inputValue = inputFieldEl.value.trim();
    var block = false;
    const queryRef = query(shoopingListDB, orderByChild('name'), equalTo(inputValue));
 


    (async () => {
        const snapshot = await get(queryRef);
        if (snapshot.exists() ) {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(`Key: ${childKey}, Data:`, childData);
            alert("פריט קיים")
          });
        } else {
            push(shoopingListDB,{name: inputValue , color: "white"} )
            inputFieldEl.value = ''
        }
      })();


  
   
})
searchInput.addEventListener('input', function() {
    debugger;
  const searchQuery = searchInput.value.toLowerCase();
  const listItems = document.querySelectorAll('#shopping-list li');
  for(var i=0;i<listItems.length;i++){
    var item = listItems[i]
    const text = item.textContent.toLowerCase();

    if (text.includes(searchQuery)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  }
});
// Custom comparison function to sort by color and then by name
const customSort = (a, b) => {
    // Sort by color
    if (a[1].color < b[1].color) {
      return -1;
    }
    if (a[1].color > b[1].color) {
      return 1;
    }
  
    // Sort by name if colors are equal
    if (a[1].name < b[1].name) {
      return -1;
    }
    if (a[1].name > b[1].name) {
      return 1;
    }
  
    return 0; // Return 0 for equal values
  };

  


