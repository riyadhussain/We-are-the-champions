// firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// firebase app setup
const appSettings = {
    databaseURL: "https://realtime-database-84cce-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings) // creates firebase app
const database = getDatabase(app) // creates database obj
const endorsementsInDB = ref(database, "endorsementList") // creates reference to database location

// DOM elements
const endorsementTextEl = document.getElementById("endorsementText")
const endorsementList = document.getElementById("endorsementList")
const publishBtnEl = document.getElementById("publish-btn")

// Click event listener for publish btn
publishBtnEl.addEventListener("click", function() {
    let inputValue = endorsementTextEl.value
  
    push(endorsementsInDB, inputValue)
    
    endorsementList.innerHTML += `<li>${inputValue}</li>` //Add text to the endorsements section
    
    clearInputFieldEl()
})

// Function to clear endorsement text after publish
function clearInputFieldEl() {
    endorsementTextEl.value = ""
}

function clearEndorsementList() {
    endorsementList.innerHTML = ""
}

// Function to push endorsementTextEl to endorsementList
onValue(endorsementsInDB, function(snapshot) {
    
    clearEndorsementList()
    
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToEndorsementTextEl(currentItem)
        }    
    } else {
        endorsementList.innerText = "No endorsements here... yet" 
    }
})

function appendItemToEndorsementTextEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    
    newEl.textContent = itemValue
    
    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsementList/${itemID}`)
        
        remove(exactLocationOfItemInDB)
    })
    
    endorsementList.append(newEl)
}