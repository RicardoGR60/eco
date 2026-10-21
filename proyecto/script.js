document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const zoneBtns = document.querySelectorAll('.zone-btn');
    
    const timerEl = document.getElementById('timer');
    const pmValEl = document.getElementById('pm25-val');
    const statusBadge = document.getElementById('status-badge');
    const historyList = document.getElementById('history-list');

    let selectedZone = 'Ciudad';
    let timerInterval = null;
    let dataInterval = null;
    let seconds = 0;
    let currentPM = 0;

    // Selector de Zona (Ciudad / Campo)
    zoneBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            zoneBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedZone = btn.dataset.zone;
        });
    });

    // Función para generar un valor aleatorio y actualizar la pantalla
    function generateReading() {
        currentPM = Math.floor(Math.random() * 85) + 10;
        pmValEl.textContent = currentPM;
        updateStatusBadge(currentPM);
    }

    // Iniciar Medición
    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');

        seconds = 0;
        updateTimer();
        
        // Mostrar un valor de inmediato al arrancar
        generateReading();

        // Reloj de tiempo transcurrido
        timerInterval = setInterval(() => {
            seconds++;
            updateTimer();
        }, 1000);

        // Actualizar datos del sensor cada 1.5 segundos
        dataInterval = setInterval(() => {
            generateReading();
        }, 1500);
    });

    // Finalizar y Guardar Medición
    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        clearInterval(dataInterval);

        const vehicleType = document.getElementById('vehicle-type').value;
        addHistoryRecord(vehicleType, selectedZone, currentPM);

        // Reiniciar Interfaz
        stopBtn.classList.add('hidden');
        startBtn.classList.remove('hidden');
        
        pmValEl.textContent = '--';
        statusBadge.className = 'badge-status badge-neutral';
        statusBadge.textContent = 'Medición Guardada';
        timerEl.textContent = '00:00';
    });

    function updateTimer() {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        timerEl.textContent = `${mins}:${secs}`;
    }

    function updateStatusBadge(val) {
        statusBadge.className = 'badge-status';
        if (val <= 30) {
            statusBadge.textContent = 'Nivel Bueno';
            statusBadge.classList.add('badge-bueno');
        } else if (val <= 60) {
            statusBadge.textContent = 'Nivel Moderado';
            statusBadge.classList.add('badge-moderado');
        } else {
            statusBadge.textContent = 'Nivel Malo / Crítico';
            statusBadge.classList.add('badge-malo');
        }
    }

    function addHistoryRecord(vehicle, zone, pm) {
        let statusClass = 'pill-bueno';
        let statusText = 'Bueno';

        if (pm > 30 && pm <= 60) {
            statusClass = 'pill-moderado';
            statusText = 'Moderado';
        } else if (pm > 60) {
            statusClass = 'pill-malo';
            statusText = 'Malo';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${vehicle}</td>
            <td><span class="tag-zone">${zone}</span></td>
            <td><strong>${pm} µg/m³</strong></td>
            <td><span class="status-pill ${statusClass}">${statusText}</span></td>
        `;

        historyList.prepend(tr);
    }
});