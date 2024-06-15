document.getElementById('inputForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const totalResources = document.getElementById('totalResources').value.split(',').map(Number);
    const maxDemand = document.getElementById('maxDemand').value.trim().split('\n').map(row => row.split(',').map(Number));
    const allocated = document.getElementById('allocated').value.trim().split('\n').map(row => row.split(',').map(Number));

    const banker = new BankersAlgorithm(totalResources, maxDemand, allocated);
    const [safe, sequence] = banker.isSafeState();

    const resultDiv = document.getElementById('result');
    if (safe) {
        resultDiv.textContent = `The system is in a safe state. Safe sequence: ${sequence.join(', ')}`;
    } else {
        resultDiv.textContent = 'The system is not in a safe state.';
    }
});

class BankersAlgorithm {
    constructor(totalResources, maxDemand, allocated) {
        this.totalResources = totalResources;
        this.maxDemand = maxDemand;
        this.allocated = allocated;
        this.numProcesses = maxDemand.length;
        this.numResources = totalResources.length;
        this.available = this.calculateAvailable();
        this.need = this.calculateNeed();
    }

    calculateAvailable() {
        const available = this.totalResources.slice();
        for (let i = 0; i < this.numProcesses; i++) {
            for (let j = 0; j < this.numResources; j++) {
                available[j] -= this.allocated[i][j];
            }
        }
        return available;
    }

    calculateNeed() {
        const need = [];
        for (let i = 0; i < this.numProcesses; i++) {
            const needRow = [];
            for (let j = 0; j < this.numResources; j++) {
                needRow.push(this.maxDemand[i][j] - this.allocated[i][j]);
            }
            need.push(needRow);
        }
        return need;
    }

    isSafeState() {
        const work = this.available.slice();
        const finish = new Array(this.numProcesses).fill(false);
        const safeSequence = [];

        while (safeSequence.length < this.numProcesses) {
            let foundProcess = false;
            for (let i = 0; i < this.numProcesses; i++) {
                if (!finish[i] && this.need[i].every((n, j) => n <= work[j])) {
                    for (let j = 0; j < this.numResources; j++) {
                        work[j] += this.allocated[i][j];
                    }
                    finish[i] = true;
                    safeSequence.push(i);
                    foundProcess = true;
                    break;
                }
            }
            if (!foundProcess) {
                return [false, []];
            }
        }
        return [true, safeSequence];
    }
}

