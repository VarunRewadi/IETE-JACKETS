// public/script.js
document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    const memberForm = document.getElementById('memberForm');
    const numberList = document.getElementById('numberList');

    memberForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const position = document.getElementById('position').value;
        const fullName = document.getElementById('fullName').value;
        const printName = document.getElementById('printName').value;

        numberList.addEventListener('click', function handleSelection(event) {
            const numberItem = event.target.closest('.number-item');
            if (numberItem && !numberItem.classList.contains('taken')) {
                const selectedNumber = numberItem.dataset.number;

                // Send the selection to the server
                socket.emit('selectNumber', { position, fullName, printName, selectedNumber });

                // Disable further selection
                numberList.removeEventListener('click', handleSelection);
            }
        });
    });

    // Update the number list in real-time
    socket.on('updateNumbers', (members) => {
        document.querySelectorAll('.number-item').forEach(item => {
            const number = item.dataset.number;
            const member = members.find(m => m.selectedNumber == number);
            if (member) {
                item.classList.add('taken');
                item.innerHTML = `${number} <div class="details">${member.fullName} (${member.position}) - ${member.printName}</div>`;
            } else {
                item.classList.remove('taken');
                item.innerHTML = number;
            }
        });
    });
});
