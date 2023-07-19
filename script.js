// database
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
const url = {
    databaseURL: "https://we-are-champions-220e4-default-rtdb.europe-west1.firebasedatabase.app/"
}
const app = initializeApp(url);
const database = getDatabase(app);
const commInDB = ref(database, "Comments");

//declaring 
const text = document.querySelector("textarea");
const toField = document.querySelector("#to");
const fromField = document.querySelector("#from");
const btn = document.querySelector("button");
const footer = document.querySelector(".footer");
//Username
if (!(localStorage.getItem("Name"))) { askForName(); }
let Name = localStorage.getItem("Name");

btn.addEventListener("click", function() {
        //if the inputs fields are empty
        if (isEmpty(fromField.value)) { var fromField_value = Name; } else { var fromField_value = fromField.value; }
        if (isEmpty(toField.value)) { var toField_value = "Everyone" } else { var toField_value = toField.value; }
        if (!isEmpty(text.value)) {
            var text_value = text.value;

            const comment = {
                from: fromField_value,
                text: text_value,
                to: toField_value,
                likes: Number
            }
            comment.likes = 0;
            push(commInDB, comment);

            clearInputField();


        }

    })
    //the rendering function create the comments section and fill it


///just rendering the comments 
onValue(commInDB, function(snapshot) {
    if (snapshot.exists()) {
        cleardivs();
        const array = Object.entries(snapshot.val());
        for (let i = array.length - 1; i >= 0; i--) {
            // console.log(array[i]);

            render(array[i]);
            // console.log(array[i].likes)
        }

    }
})


function render(struct) {
    ///creating the comment section in the footer
    const comment_section = document.createElement("div");
    comment_section.classList = "comment_section chat left";
    footer.append(comment_section);
    console.log("div appened")
        ///creating the content of the comment section (the main text and "to" and "from")
    const from_par = document.createElement("p");
    from_par.className = "from_par";
    const text_par = document.createElement("p");
    text_par.className = "text_par";
    const to_par = document.createElement("p");
    to_par.className = "to_par";
    const likes = document.createElement("a");
    likes.className = "likes";
    ///appending these element to comment_section
    comment_section.append(to_par, text_par, from_par, likes);
    ////setting the content of each element
    from_par.textContent = "From " + struct[1].from;
    text_par.textContent = struct[1].text;
    to_par.textContent = "To " + struct[1].to;
    likes.textContent = "❤️ " + struct[1].likes;
    ///likes increasing
    comment_section.addEventListener("dblclick", function() {
        (struct[1].likes) ++;
        likes.className = "red";
        likes.textContent = "❤️ " + struct[1].likes;
        console.log("likes : " + struct[1].likes)
        let likesChange = ref(database, `Comments/${struct[0]}/likes`)
        set(likesChange, struct[1].likes)

    });

    //if you want to delete a comment
    // comment_section.addEventListener("dblclick", function() {
    //     let exactLocationOfItemInDB = ref(database, `Comments/${struct[0]}`)
    //     remove(exactLocationOfItemInDB);
    // })

}




///clearing the inputs
function clearInputField() {
    fromField.value = "";
    toField.value = "";
    text.value = "";
}

function cleardivs() {
    const all = document.querySelectorAll(".comment_section");
    const a = document.querySelectorAll("likes");
    for (let i = 0; i < all.length; i++) {
        footer.removeChild(all[i]);
    }
}


function askForName() {
    let Name = window.prompt("Who are you ?");
    if (!Name) Name = "Anonymous";
    localStorage.setItem("Name", Name);


}

function isEmpty(str) {
    return (!str.trim().length);
}