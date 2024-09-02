document.addEventListener("DOMContentLoaded", () => {
    const numberList = document.getElementById("numberList");
    const memberForm = document.getElementById("memberForm");
    let formData = {};
    
    // Load selected numbers from localStorage
    let selectedNumbers = JSON.parse(localStorage.getItem('selectedNumbers')) || {};

    // Generate number list (1-100 for example)
    const totalNumbers = 100;
    for (let i = 1; i <= totalNumbers; i++) {
        const numberDiv = document.createElement("div");
        numberDiv.classList.add("number-item");
        numberDiv.textContent = i;
        numberDiv.dataset.number = i;

        // Mark the number as taken if it has already been selected
        if (selectedNumbers[i]) {
            numberDiv.classList.add("taken");
            numberDiv.dataset.details = selectedNumbers[i];
        }

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
            
            // Mark the number as taken and save it in localStorage
            e.target.classList.add("taken");
            e.target.dataset.details = details;

            // Save the selection in localStorage
            selectedNumbers[selectedNumber] = details;
            localStorage.setItem('selectedNumbers', JSON.stringify(selectedNumbers));
        }
    }
});
