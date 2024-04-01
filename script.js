document.addEventListener("DOMContentLoaded", function() {
    const combinationsContainer = document.getElementById('combinations');
    const downloadCSVButton = document.getElementById('downloadCSVButton');
    
    function toggleCheckbox(checkbox) {
        checkbox.checked = !checkbox.checked;
    }

    function generateCombinations(values, size) {
        const combinations = [];

        function generate(current, start) {
            if (current.length === size) {
                combinations.push([...current]);
                return;
            }
            for (let i = start; i < values.length; i++) {
                current.push(values[i]);
                generate(current, i + 1);
                current.pop();
            }
        }

        generate([], 0);

        return combinations;
    }

    function renderCombinations(combinations) {
        combinationsContainer.innerHTML = '';
        combinations.forEach(combination => {
            const div = document.createElement('div');
            div.innerHTML = `<input type="checkbox"><span>${combination.join(', ')}</span>`;
            combinationsContainer.appendChild(div);
        });
    }

    function getSelectedCombinations() {
        const checkboxes = document.querySelectorAll('#combinations input[type="checkbox"]');
        const selectedCombinations = [];
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedCombinations.push(checkbox.nextElementSibling.textContent);
            }
        });
        return selectedCombinations;
    }

    function downloadCSV() {
        const selectedCombinations = getSelectedCombinations();
        if (selectedCombinations.length === 0) {
            alert('No combinations selected!');
            return;
        }

        const csvContent = selectedCombinations.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "selected_combinations.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    const processButton = document.getElementById('processButton');
    processButton.addEventListener('click', function() {
        const csvValueInputs = document.querySelectorAll('.productField');
        const values = Array.from(csvValueInputs).map(input => input.value.trim()).filter(value => value !== '');
        const combinations = [];
        for (let i = 1; i <= values.length; i++) {
            combinations.push(...generateCombinations(values, i));
        }
        renderCombinations(combinations);
        downloadCSVButton.style.display = 'inline';
    });

    const addMoreFieldsButton = document.getElementById('addMoreFieldsButton');
    addMoreFieldsButton.addEventListener('click', function() {
        const csvInputContainer = document.getElementById('csvInputContainer');
        const newInput = document.createElement('input');
        newInput.type = 'text';
        newInput.classList.add('csvValueInput');
        newInput.classList.add('productField'); 
        newInput.placeholder = `Produto ${csvInputContainer.querySelectorAll('.csvValueInput').length + 1}`;
        csvInputContainer.insertBefore(newInput, addMoreFieldsButton);
    });

    combinationsContainer.addEventListener('click', function(event) {
        if (event.target.type === 'checkbox') {
            return;
        }
        const checkbox = event.target.querySelector('input[type="checkbox"]');
        if (checkbox) {
            toggleCheckbox(checkbox);
        }
    });

    downloadCSVButton.addEventListener('click', downloadCSV);
});
