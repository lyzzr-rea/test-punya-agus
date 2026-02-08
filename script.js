// File: script.js - Versi sederhana untuk testing
console.log("Script.js loaded!");

// Data jadwal piket
const jadwalPiket = [
    { no: 1, nama: "Fika", hari: "Senin" },
    { no: 2, nama: "Wawan", hari: "Senin" },
    { no: 3, nama: "Recky", hari: "Senin" },
    { no: 4, nama: "Fero", hari: "Senin" },
    { no: 5, nama: "Monika", hari: "Senin" },
    { no: 6, nama: "Ria", hari: "Senin" },
    { no: 7, nama: "Febi", hari: "Selasa" },
    { no: 8, nama: "Akbar", hari: "Selasa" },
    { no: 9, nama: "Richard", hari: "Selasa" },
    { no: 10, nama: "Azmi", hari: "Selasa" },
    { no: 11, nama: "Novril", hari: "Selasa" },
    { no: 12, nama: "Zahratu", hari: "Selasa" },
    { no: 13, nama: "Wandi", hari: "Rabu" },
    { no: 14, nama: "Alvin", hari: "Rabu" },
    { no: 15, nama: "Tiara NP", hari: "Rabu" },
    { no: 16, nama: "Laura", hari: "Rabu" },
    { no: 17, nama: "Dayat", hari: "Rabu" },
    { no: 18, nama: "Saiful", hari: "Rabu" },
    { no: 19, nama: "Kelvin", hari: "Kamis" },
    { no: 20, nama: "Bakti", hari: "Kamis" },
    { no: 21, nama: "Nasuha", hari: "Jumat" },
    { no: 22, nama: "Nita", hari: "Kamis" },
    { no: 23, nama: "Eva", hari: "Kamis" },
    { no: 24, nama: "Agus", hari: "Kamis" },
    { no: 25, nama: "Fitra", hari: "Jumat" },
    { no: 26, nama: "Vika", hari: "Jumat" },
    { no: 27, nama: "Cinta", hari: "Jumat" },
    { no: 28, nama: "Endro", hari: "Jumat" },
    { no: 29, nama: "Pau", hari: "Jumat" }
];

// Fungsi sederhana untuk menampilkan data
function renderJadwalTable() {
    const tableBody = document.getElementById('jadwalTableBody');
    if (!tableBody) {
        console.error("Element #jadwalTableBody not found!");
        return;
    }
    
    tableBody.innerHTML = '';
    
    jadwalPiket.forEach(petugas => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${petugas.no}</td>
            <td><strong>${petugas.nama}</strong></td>
            <td class="hari-cell">${petugas.hari}</td>
            <td>
                <span class="status-default">Belum diatur</span>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    console.log("Tabel jadwal berhasil dirender!");
}

// Fungsi untuk menampilkan pesan hari ini
function renderInfoHariIni() {
    const infoEl = document.getElementById('infoHariIni');
    if (infoEl) {
        const hariIni = new Date().toLocaleDateString('id-ID', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        infoEl.textContent = `Hari ini: ${hariIni}`;
    }
}

// Fungsi sederhana untuk kalender
function renderCalendar() {
    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error("Element #calendar not found!");
        return;
    }
    
    const today = new Date();
    const month = today.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    
    calendarEl.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button class="nav-btn"><i class="fas fa-chevron-left"></i></button>
                <button class="nav-btn" id="todayBtn">Hari Ini</button>
                <button class="nav-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="current-month">${month}</div>
        </div>
        
        <div class="calendar-weekdays">
            <div>Min</div>
            <div>Sen</div>
            <div>Sel</div>
            <div>Rab</div>
            <div>Kam</div>
            <div>Jum</div>
            <div>Sab</div>
        </div>
        
        <div class="calendar-days">
            <div class="calendar-day today">${today.getDate()}</div>
            <div class="calendar-day">${today.getDate() + 1}</div>
            <div class="calendar-day">${today.getDate() + 2}</div>
            <div class="calendar-day">${today.getDate() + 3}</div>
            <div class="calendar-day">${today.getDate() + 4}</div>
            <!-- ... tambahkan hari lainnya ... -->
        </div>
    `;
    
    console.log("Kalender berhasil dirender!");
}

// Fungsi untuk toggle panel notifikasi
function setupNotificationPanel() {
    const toggleBtn = document.getElementById('notificationToggleBtn');
    const closeBtn = document.getElementById('closeNotification');
    const panel = document.getElementById('notificationPanel');
    
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', () => {
            panel.classList.toggle('open');
        });
    }
    
    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.remove('open');
        });
    }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded!");
    
    // Render komponen dasar
    renderJadwalTable();
    renderInfoHariIni();
    renderCalendar();
    
    // Setup panel notifikasi
    setupNotificationPanel();
    
    // Tampilkan day-details
    const dayDetails = document.getElementById('dayDetails');
    if (dayDetails) {
        dayDetails.classList.remove('hidden');
        dayDetails.innerHTML = `
            <div class="selected-day-header">
                <div class="selected-day-title">
                    <i class="fas fa-calendar-day"></i>
                    <span>Silakan pilih hari untuk melihat detail</span>
                </div>
            </div>
            <div class="empty-state">
                <i class="fas fa-broom"></i>
                <p>Pilih tanggal di kalender untuk mengatur status piket</p>
            </div>
        `;
    }
    
    // Setup badge notifikasi
    const badge = document.getElementById('notificationBadge');
    const notificationCount = document.getElementById('notificationCount');
    if (badge && notificationCount) {
        badge.addEventListener('click', () => {
            const panel = document.getElementById('notificationPanel');
            if (panel) {
                panel.classList.toggle('open');
                // Update notification content
                const content = document.getElementById('notificationContent');
                if (content) {
                    content.innerHTML = `
                        <div class="notification-item today">
                            <div class="notification-date">
                                <i class="fas fa-calendar-day"></i>
                                Hari ini
                            </div>
                            <p><strong>Petugas Piket Hari Ini:</strong></p>
                            <div class="notification-petugas">
                                <span class="petugas-badge">Fika</span>
                                <span class="petugas-badge">Wawan</span>
                                <span class="petugas-badge">Recky</span>
                            </div>
                        </div>
                        <div class="notification-reminder">
                            <h4><i class="fas fa-clock"></i> Pengingat</h4>
                            <p>Jangan lupa untuk melakukan piket!</p>
                        </div>
                    `;
                }
            }
        });
        
        // Set count to 1 sebagai contoh
        notificationCount.textContent = '1';
    }
    
    console.log("Aplikasi berhasil diinisialisasi!");
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, 'at', e.filename, 'line', e.lineno);
    
    // Tampilkan pesan error sederhana
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        right: 10px;
        background: #f44336;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        font-family: monospace;
        font-size: 12px;
    `;
    errorDiv.textContent = `Error: ${e.message}`;
    document.body.appendChild(errorDiv);
    
    // Hapus setelah 5 detik
    setTimeout(() => errorDiv.remove(), 5000);
});
