// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCvUJj2SGPYjr6X-LYOUcboUgaMtGdJuNo",
    authDomain: "iete-jackets.firebaseapp.com",
    projectId: "iete-jackets",
    storageBucket: "iete-jackets.appspot.com",
    messagingSenderId: "360517263084",
    appId: "1:360517263084:web:df66d462bbc55feef6cfc9",
    databaseURL: "https://iete-jackets-default-rtdb.firebaseio.com/" // Add this line for Realtime Database
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.addEventListener("DOMContentLoaded", () => {
    const numberList = document.getElementById("numberList");
    const memberForm = document.getElementById("memberForm");
    let formData = {};

    // Listen for changes in the selected numbers in the database
    database.ref('selectedNumbers').on('value', (snapshot) => {
        const selectedNumbers = snapshot.val() || {};
        updateNumberList(selectedNumbers);
    });

    // Generate number list (1-100 for example)
    const totalNumbers = 100;
    for (let i = 1; i <= totalNumbers; i++) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number-item");
        numberDiv.textContent = i;
        numberDiv.dataset.number = i;
        numberList.appendChild(numberDiv);
    }

    // Handle form submission
    memberForm.addEventListener("submit", (e) => {
        e.preventDefault();

        formData = {
            position: document.getElementById("position").value,
            fullName: document.getElementById("fullName").value,
            printName: document.getElementById("printName").value
        };

        // Enable number selection
        numberList.addEventListener("click", handleNumberSelection);
    });

    // Handle number selection
    function handleNumberSelection(e) {
        if (e.target.classList.contains("number-item") && !e.target.classList.contains("taken")) {
            const selectedNumber = e.target.dataset.number;

            const details = `${formData.fullName} (${formData.position}) - ${formData.printName}`;

            // Save the selection to Firebase
            database.ref(`selectedNumbers/${selectedNumber}`).set(details);
        }
    }

    // Update number list based on the database
    function updateNumberList(selectedNumbers) {
        document.querySelectorAll('.number-item').forEach((item) => {
            const number = item.dataset.number;
            if (selectedNumbers[number]) {
                item.classList.add("taken");
                item.dataset.details = selectedNumbers[number];
            } else {
                item.classList.remove("taken");
                delete item.dataset.details;
            }
        });
    }
});
