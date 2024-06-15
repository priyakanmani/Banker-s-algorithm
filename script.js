

document.getElementById('inputForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Fetch inputs
    const totalResources = document.getElementById('totalResources').value.split(',').map(Number);
    const maxDemand = document.getElementById('maxDemand').value.trim().split('\n').map(row => row.split(',').map(Number));
    const allocated = document.getElementById('allocated').value.trim().split('\n').map(row => row.split(',').map(Number));

    const numberOfProcesses = maxDemand.length;
    const numberOfResources = totalResources.length;

    // Calculate the need matrix
    const need = maxDemand.map((row, i) => row.map((val, j) => val - allocated[i][j]));

    // Display allocation and need matrices
    displayMatrix('allocationMatrix', 'Allocation Matrix', allocated);
    displayMatrix('needMatrix', 'Need Matrix', need);

    // Calculate available resources
    const available = totalResources.map((val, i) => {
        return val - allocated.reduce((acc, row) => acc + row[i], 0);
    });

    // Display available resources
    displayMatrix('availableMatrix', 'Available Resources', [available]);

    // Check if the system is in a safe state and get the sequence
    const { isSafe, sequence } = checkSafeState(available, allocated, need);

    // Display result
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = isSafe ? 'The system is in a safe state.' : 'The system is not in a safe state.';

    // Display sequence if safe
    if (isSafe) {
        const sequenceDiv = document.getElementById('sequence');
        sequenceDiv.innerHTML = `<h3>Safe Sequence</h3><pre>${sequence.join(' -> ')}</pre>`;
    }
});

function displayMatrix(elementId, title, matrix) {
    const container = document.getElementById(elementId);
    container.innerHTML = `<h3>${title}</h3><pre>${matrix.map(row => row.join(', ')).join('\n')}</pre>`;
}

function checkSafeState(available, allocated, need) {
    const numberOfProcesses = need.length;
    const numberOfResources = available.length;

    const finish = Array(numberOfProcesses).fill(false);
    let work = [...available];
    const sequence = [];

    while (sequence.length < numberOfProcesses) {
        let found = false;

        for (let i = 0; i < numberOfProcesses; i++) {
            if (!finish[i] && need[i].every((needValue, j) => needValue <= work[j])) {
                for (let j = 0; j < numberOfResources; j++) {
                    work[j] += allocated[i][j];
                }
                finish[i] = true;
                sequence.push(`P${i}`);
                found = true;
            }
        }

        if (!found) {
            return { isSafe: false, sequence: [] };
        }
    }

    return { isSafe: true, sequence };
}
