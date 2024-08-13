debugger;
import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import {getDatabase,ref,push,onValue , remove,set , query, orderByChild, equalTo , get   } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"
const appSettings = {
    databaseURL: "https://shopping-ac927-default-rtdb.europe-west1.firebasedatabase.app/",   
  };
  var lastcb='';

  const  inputFieldEl = document.getElementById("input=field")
const  addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
const searchInput = document.getElementById('searchInput');
//const milk_box = document.getElementById('milk-box');
var buttons = document.getElementsByClassName('checkbox-click');

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
        let category =row[1].category
        if(category ==undefined) category = 'other'
        else if(category =="dry") category = 'other'
        var show =  getCbByCategory(category)
        if(color == 'green' || color== '#7DE5E5') color= '#7DE5E5'
        let newEl = document.createElement("li");
        newEl.textContent =name 
        newEl.id = ID;
        newEl.style.display = show
        newEl.style.backgroundColor  = color
        let LocationInDB = ref(database,`shoopingList/${ID}`);
        newEl.className = "li-" +category
        var longClickTimer;
        var longClickOccurred = false;
        newEl.addEventListener("click",function(){
          debugger;
            if(color == 'green' ||color=='#7DE5E5' || longClickOccurred ) return;
            newEl.classList.add('li-white');
            let changeColor= "white";
            if(color == 'white'){
                changeColor='#7DE5E5'
                newEl.classList.add('li-green');
            }
            set(LocationInDB, {
                name : name,
                color:changeColor,
                category:category
              });
              searchInput.value = '';
        })

        newEl.addEventListener("dblclick",function(){
          if(color == 'white' ) return;
          newEl.classList.add('li-white');
          let changeColor= "white";
          if(color == 'white'){
              changeColor='#009aa5'
              newEl.classList.add('li-green');

          }
          set(LocationInDB, {
              name : name,
              color:changeColor,
              category:category
            });
            searchInput.value = '';
      })

      newEl.addEventListener("mousedown",function(){

        longClickTimer = setTimeout(function() {

          longClickOccurred = true;
          //alert("Long click event detected on " + this.textContent);
          Swal.fire({
            title: 'מסך עדכון מוצר',
            html:
            `<input type="text" id="name"  placeholder="שם מוצר" class="swal2-input" value="${this.innerText}">`,
            input: 'select',
            inputOptions: {
              'milk': 'מוצרי חלב',
              'fruits': 'פירות',
              'veg': 'ירקות',
              "bread":"מאפים",
              "meat":"בשר",
              "clean": "ניקיון",
              "other":"אחר"
            },
            inputValue: category,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'בטל',
            confirmButtonText: 'עדכון',
            confirmButtonColor: 'blue',
            showDenyButton: true,
            denyButtonText: `מחיקת מוצר`,
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value !== '') {
                  resolve();
                } else {
                  resolve('Please select an option');
                }
              });
            },
            preConfirm: () => {
              // Modify the confirm button style programmatically
              const confirmButton = Swal.getConfirmButton();
              confirmButton.style.color = 'red';
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedOption = result.value;
              var name = document.getElementById("name").value;
              set(LocationInDB, {
                name : name,
                color:color,
                category:selectedOption
              }).then(function() {
                inputFieldEl.value = '';
                Swal.fire({
                  position: 'top',
                  icon: 'success',
                  title: 'המוצר נשמר בהצלחה',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
              .catch(function(error) {
                console.log("Error setting data:", error);
              });                                           
            }
            else if (result.isDenied) {
              remove(LocationInDB)
              .then(() => {
                inputFieldEl.value = '';
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'המוצר נמחק בהצלחה',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch((error) => {
                console.error('Error setting data:', error);
            });
              
            }
          });
        }.bind(this), 1200);

      });

      newEl.addEventListener("mouseup",function(){
        clearTimeout(longClickTimer);
        longClickOccurred = false
      });

      newEl.addEventListener("touchstart",function(){

        longClickTimer = setTimeout(function() {

          longClickOccurred = true;
          //alert("Long click event detected on " + this.textContent);
          Swal.fire({
            title: 'מסך עדכון מוצר',
            html:
            `<input type="text" id="name"  placeholder="שם מוצר" class="swal2-input" value="${this.innerText}">`,
            input: 'select',
            inputOptions: {
              'milk': 'מוצרי חלב',
              'fruits': 'פירות',
              'veg': 'ירקות',
              "bread":"מאפים",
              "meat":"בשר",
              "clean": "ניקיון",
              "other":"אחר"
            },
            inputValue: category,
            showCloseButton: true,
            showCancelButton: true,
            cancelButtonText: 'בטל',
            confirmButtonText: 'עדכון',
            confirmButtonColor: 'blue',
            showDenyButton: true,
            denyButtonText: `מחיקת מוצר`,
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value !== '') {
                  resolve();
                } else {
                  resolve('Please select an option');
                }
              });
            },
            preConfirm: () => {
              // Modify the confirm button style programmatically
              const confirmButton = Swal.getConfirmButton();
              confirmButton.style.color = 'red';
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedOption = result.value;
              var name = document.getElementById("name").value;
              set(LocationInDB, {
                name : name,
                color:color,
                category:selectedOption
              }).then(function() {
                inputFieldEl.value = '';
                Swal.fire({
                  position: 'top',
                  icon: 'success',
                  title: 'המוצר נשמר בהצלחה',
                  showConfirmButton: false,
                  timer: 1500
                })
              })
              .catch(function(error) {
                console.log("Error setting data:", error);
              });                                           
            }
            else if (result.isDenied) {
              remove(LocationInDB)
              .then(() => {
                inputFieldEl.value = '';
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'המוצר נמחק בהצלחה',
                showConfirmButton: false,
                timer: 1500
              })
            })
            .catch((error) => {
                console.error('Error setting data:', error);
            });
              
            }
          });
        }.bind(this), 1200);

      });

      newEl.addEventListener("touchend",function(){
        clearTimeout(longClickTimer);
        longClickOccurred = false
      });

      newEl.addEventListener('contextmenu', function(e) {
        e.preventDefault();
      });
      newEl.addEventListener('selectstart', function(e) {
        e.preventDefault();
      });
      newEl.addEventListener('mousedown', function(e) {
        e.preventDefault();
      });

        let div1 = document.createElement("div");
        div1.textContent =category 
        var className = "tag " + category
        div1.className = className;
        div1.style.display= 'none'
        newEl.append(div1)

        shoppingListEl.append(newEl)
}

addButtonEl.addEventListener("click" , function(){
    debugger;
    let inputValue = inputFieldEl.value.trim();
    if(inputValue == '')return
    
    var block = false;
    const queryRef = query(shoopingListDB, orderByChild('name'), equalTo(inputValue));
    (async () => {
        const snapshot = await get(queryRef);
        if (snapshot.exists() ) {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();
            console.log(`Key: ${childKey}, Data:`, childData);
            Swal.fire({
              icon: 'error',
              title: 'אופס...',
              text: 'פריט קיים במערכת',
              confirmButtonColor: 'blue',
            })
          });
        } else {
          Swal.fire({
            title: 'בחר קטגוריה',
            input: 'select',
            inputOptions: {
              'milk': 'מוצרי חלב',
              'fruits': 'פירות',
              'veg': 'ירקות',
              "bread":"מאפים",
              "meat":"בשר",
              "clean": "ניקיון",
              "other":"אחר"
            },
            showCancelButton: true,
            cancelButtonText: 'בטל',
            confirmButtonText: 'בחר',
            confirmButtonColor: 'blue',
            inputValidator: (value) => {
              return new Promise((resolve) => {
                if (value !== '') {
                  resolve();
                } else {
                  resolve('Please select an option');
                }
              });
            },
            preConfirm: () => {
              // Modify the confirm button style programmatically
              const confirmButton = Swal.getConfirmButton();
              confirmButton.style.color = 'red';
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const selectedOption = result.value;
              push(shoopingListDB,{name: inputValue , color: "white", category:selectedOption} )
              inputFieldEl.value = '';
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'המוצר נשמר בהצלחה',
                showConfirmButton: false,
                timer: 1500
              })
            }
          });
        }
      })();  
      
     
     
})
searchInput.addEventListener('input', function() {

  const searchQuery = searchInput.value.toLowerCase();
  const listItems = document.querySelectorAll('#shopping-list li');
  for(var i=0;i<listItems.length;i++){
    var item = listItems[i]
    const text = item.textContent.toLowerCase();
    var display = '';
    if (text.includes(searchQuery) ) {
      debugger;
      if(lastcb =='' || item.className == mapping[lastcb])
          display = 'block';
      else display = 'none';
    } else {
      display = 'none'
    }
    item.style.display = display;
  }
});

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    // Code to be executed when the button is clicked
    console.log('Button clicked: ' + this.id);
    
    var checked = this.checked;
    var liList = document.getElementsByTagName('li')
    for(var i=0;i<liList.length;i++){
      var li =liList[i]
      if(checked){
        lastcb = this.id
        if(li.className != mapping[this.id])
          li.style.display = 'none'
        else li.style.display =  'block'
      }else{
        lastcb= ''
        if(li.className != mapping[this.id])
          li.style.display =  'block'     
      }
    }
    debugger
    for (var i = 0; i < buttons.length; i++) {
        var cbEl = buttons[i];
        if(cbEl.id != this.id)cbEl.checked = false;

    }
  });
}

var mapping = [];
mapping["milk-box"] = 'li-milk'
mapping["other-box"] = 'li-other'
mapping["bread-box"] = 'li-bread'
mapping["fruits-box"] = 'li-fruits'
mapping["veg-box"] = 'li-veg'
mapping["meat-box"] = 'li-meat'
mapping["clean-box"] = 'li-clean'
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
  
  function getCbByCategory(category){
  if(lastcb =='')return 'block'
  var mapping = [];
mapping["milk"] = 'milk-box'
mapping["other"] = 'other-box'
mapping["bread"] = 'bread-box'
mapping["fruits"] = 'fruits-box'
mapping["veg"] = 'veg-box'
mapping["meat"] = 'meat-box'
mapping["clean"] = 'clean-box'

var cbId = mapping[category];
var checked = document.getElementById(cbId).checked;
return checked == true ? 'block': 'none'


}
