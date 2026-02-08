// Data jadwal piket sesuai dengan yang diberikan
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
];

// Data tambahan untuk melengkapi
const dataTambahan = [
  { no: 22, nama: "Nita", hari: "Kamis" },
  { no: 23, nama: "Eva", hari: "Kamis" },
  { no: 24, nama: "Agus", hari: "Kamis" },
  { no: 25, nama: "Fitra", hari: "Jumat" },
  { no: 26, nama: "Vika", hari: "Jumat" },
  { no: 27, nama: "Cinta", hari: "Jumat" },
  { no: 28, nama: "Endro", hari: "Jumat" },
  { no: 29, nama: "Pau", hari: "Jumat" },
];

// Gabungkan data tambahan ke jadwal utama
dataTambahan.forEach((item) => {
  jadwalPiket.push(item);
});

// Urutkan berdasarkan nomor
jadwalPiket.sort((a, b) => a.no - b.no);

// Mapping hari ke indeks
const hariMapping = {
  Minggu: 0,
  Senin: 1,
  Selasa: 2,
  Rabu: 3,
  Kamis: 4,
  Jumat: 5,
  Sabtu: 6,
};

// Variabel global untuk kalender
let currentDate = new Date();
let selectedDate = new Date();

// Object untuk menyimpan status piket
let statusPiket = JSON.parse(localStorage.getItem("statusPiket")) || {};

// Object untuk menyimpan notifikasi yang sudah dilihat
let viewedNotifications =
  JSON.parse(localStorage.getItem("viewedNotifications")) || {};

// Fungsi untuk mendapatkan nama hari
function getNamaHari(date) {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return days[date.getDay()];
}

// Fungsi untuk mendapatkan nama bulan
function getNamaBulan(date) {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  return months[date.getMonth()];
}

// Fungsi untuk mendapatkan petugas berdasarkan hari
function getPetugasByHari(namaHari) {
  return jadwalPiket.filter((petugas) => petugas.hari === namaHari);
}

// Fungsi untuk mendapatkan status piket untuk tanggal tertentu
function getStatusForDate(date, petugasNama) {
  const dateKey = date.toISOString().split("T")[0];
  if (statusPiket[dateKey] && statusPiket[dateKey][petugasNama]) {
    return statusPiket[dateKey][petugasNama];
  }
  return null;
}

// Fungsi untuk menyimpan status piket
function saveStatus(date, petugasNama, status) {
  const dateKey = date.toISOString().split("T")[0];

  if (!statusPiket[dateKey]) {
    statusPiket[dateKey] = {};
  }

  statusPiket[dateKey][petugasNama] = status;

  localStorage.setItem("statusPiket", JSON.stringify(statusPiket));

  // Tampilkan notifikasi
  showNotification(`Status ${petugasNama} diubah menjadi "${status}"`);

  // Update notifikasi
  updateNotificationBadge();
}

// Fungsi untuk menampilkan notifikasi
function showNotification(message, type = "success") {
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement("div");
  notification.className = "notification";
  const bgColor =
    type === "success" ? "#4caf50" : type === "warning" ? "#ff9800" : "#f44336";

  notification.innerHTML = `
        <div style="position: fixed; top: 20px; right: 20px; background-color: ${bgColor}; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; gap: 10px; min-width: 300px;">
            <i class="fas ${type === "success" ? "fa-check-circle" : type === "warning" ? "fa-exclamation-triangle" : "fa-times-circle"}"></i>
            <span>${message}</span>
        </div>
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Fungsi untuk mendapatkan notifikasi piket
function getPiketNotifications() {
  const notifications = [];
  const today = new Date();

  // Cek piket untuk 7 hari ke depan
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const dayName = getNamaHari(date);
    const petugasHariIni = getPetugasByHari(dayName);

    if (petugasHariIni.length > 0) {
      const dateKey = date.toISOString().split("T")[0];
      const notificationKey = `piket_${dateKey}`;

      // Cek apakah notifikasi sudah dilihat
      const isViewed = viewedNotifications[notificationKey] || false;

      notifications.push({
        date: new Date(date),
        dateKey: dateKey,
        dayName: dayName,
        petugas: petugasHariIni,
        isToday: i === 0,
        isViewed: isViewed,
      });
    }
  }

  return notifications;
}

// Fungsi untuk merender notifikasi
function renderNotifications() {
  const notifications = getPiketNotifications();
  const notificationContent = document.getElementById("notificationContent");
  const notificationCount = document.getElementById("notificationCount");

  // Hitung notifikasi yang belum dilihat
  const unreadCount = notifications.filter(
    (n) => !n.isViewed && n.isToday,
  ).length;
  notificationCount.textContent = unreadCount > 0 ? unreadCount : "";

  let notificationsHTML = "";

  if (notifications.length > 0) {
    notifications.forEach((notification) => {
      const dateStr = `${notification.dayName}, ${notification.date.getDate()} ${getNamaBulan(notification.date)} ${notification.date.getFullYear()}`;
      const isToday = notification.isToday;

      notificationsHTML += `
                <div class="notification-item ${isToday ? "today" : ""} ${notification.isViewed ? "viewed" : ""}" data-key="piket_${notification.dateKey}">
                    <div class="notification-date">
                        <i class="fas ${isToday ? "fa-calendar-day" : "fa-calendar"}"></i>
                        ${dateStr}
                        ${isToday ? '<span style="background: #8b0000; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">HARI INI</span>' : ""}
                    </div>
                    <p><strong>Petugas Piket:</strong></p>
                    <div class="notification-petugas">
                        ${notification.petugas
                          .map(
                            (petugas) => `
                            <span class="petugas-badge">${petugas.nama}</span>
                        `,
                          )
                          .join("")}
                    </div>
                    ${
                      isToday
                        ? `
                        <div style="margin-top: 15px; padding: 10px; background-color: ${notification.isViewed ? "#f5f5f5" : "#fff8e1"}; border-radius: 8px; font-size: 0.9rem;">
                            <i class="fas fa-info-circle" style="color: #ff9800;"></i>
                            <strong>${notification.isViewed ? "Sudah dilihat" : "BARU!"}</strong> - Jangan lupa untuk melakukan piket!
                        </div>
                    `
                        : ""
                    }
                </div>
            `;
    });

    // Tambahkan pengingat
    notificationsHTML += `
            <div class="notification-reminder">
                <h4><i class="fas fa-clock"></i> Pengingat</h4>
                <p>Notifikasi akan selalu menampilkan jadwal piket untuk 7 hari ke depan. Pastikan untuk menandai status piket setelah tugas selesai.</p>
            </div>
        `;
  } else {
    notificationsHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <p>Tidak ada jadwal piket untuk 7 hari ke depan</p>
            </div>
        `;
  }

  notificationContent.innerHTML = notificationsHTML;

  // Tandai notifikasi hari ini sebagai sudah dilihat ketika panel dibuka
  const todayNotification = notifications.find((n) => n.isToday);
  if (todayNotification && !todayNotification.isViewed) {
    viewedNotifications[`piket_${todayNotification.dateKey}`] = true;
    localStorage.setItem(
      "viewedNotifications",
      JSON.stringify(viewedNotifications),
    );
    updateNotificationBadge();
  }

  // Tambahkan event listener untuk menutup notifikasi ketika diklik
  document.querySelectorAll(".notification-item").forEach((item) => {
    item.addEventListener("click", function () {
      const notificationKey = this.getAttribute("data-key");
      viewedNotifications[notificationKey] = true;
      localStorage.setItem(
        "viewedNotifications",
        JSON.stringify(viewedNotifications),
      );
      updateNotificationBadge();
    });
  });
}

// Fungsi untuk update badge notifikasi
function updateNotificationBadge() {
  const notifications = getPiketNotifications();
  const unreadCount = notifications.filter(
    (n) => !n.isViewed && n.isToday,
  ).length;
  const notificationCount = document.getElementById("notificationCount");

  notificationCount.textContent = unreadCount > 0 ? unreadCount : "";

  // Jika ada notifikasi baru, beri peringatan
  if (unreadCount > 0) {
    showNotification(`${unreadCount} notifikasi piket hari ini!`, "warning");
  }
}

// Fungsi untuk menampilkan notifikasi awal saat load halaman
function showInitialNotification() {
  const today = new Date();
  const dayName = getNamaHari(today);
  const petugasHariIni = getPetugasByHari(dayName);

  if (petugasHariIni.length > 0) {
    const petugasNames = petugasHariIni.map((p) => p.nama).join(", ");
    showNotification(
      `Hari ini ${dayName}: ${petugasNames} bertugas piket!`,
      "warning",
    );
  }
}

// Fungsi untuk merender kalender
function renderCalendar() {
  const calendarEl = document.getElementById("calendar");

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const firstDayIndex = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  const monthYear = `${getNamaBulan(currentDate)} ${currentDate.getFullYear()}`;

  let calendarHTML = `
        <div class="calendar-header">
            <div class="calendar-nav">
                <button class="nav-btn" id="prevMonth"><i class="fas fa-chevron-left"></i></button>
                <button class="nav-btn" id="todayBtn">Hari Ini</button>
                <button class="nav-btn" id="nextMonth"><i class="fas fa-chevron-right"></i></button>
            </div>
            <div class="current-month">${monthYear}</div>
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
    `;

  for (let i = 0; i < firstDayIndex; i++) {
    calendarHTML += `<div class="calendar-day other-month"></div>`;
  }

  const today = new Date();
  const isCurrentMonth =
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    const dayOfWeek = getNamaHari(date);
    const hasDuty = getPetugasByHari(dayOfWeek).length > 0;
    const isToday = isCurrentMonth && day === today.getDate();
    const isSelected =
      selectedDate &&
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear();

    let dayClass = "calendar-day";
    if (isToday) dayClass += " today";
    if (hasDuty) dayClass += " has-duty";
    if (isSelected) dayClass += " selected";

    let statusDot = "";
    if (hasDuty) {
      const petugasList = getPetugasByHari(dayOfWeek);
      const dateKey = date.toISOString().split("T")[0];

      if (statusPiket[dateKey]) {
        const petugasStatuses = petugasList.map(
          (petugas) => statusPiket[dateKey][petugas.nama],
        );
        const semuaSudah = petugasStatuses.every(
          (status) => status === "sudah",
        );
        const semuaBelum = petugasStatuses.every(
          (status) => status === "belum",
        );
        const adaSudah = petugasStatuses.some((status) => status === "sudah");
        const adaBelum = petugasStatuses.some((status) => status === "belum");

        if (semuaSudah) {
          statusDot = '<div class="status-dot sudah"></div>';
        } else if (semuaBelum) {
          statusDot = '<div class="status-dot belum"></div>';
        } else if (adaSudah || adaBelum) {
          statusDot =
            '<div class="status-dot" style="background-color: #ff9800;"></div>';
        }
      }
    }

    calendarHTML += `
            <div class="${dayClass}" data-date="${date.toISOString().split("T")[0]}">
                ${day}
                ${hasDuty ? '<div class="duty-dot"></div>' : ""}
                ${statusDot}
            </div>
        `;
  }

  const totalCells = 42;
  const daysSoFar = firstDayIndex + daysInMonth;
  for (let i = daysSoFar; i < totalCells; i++) {
    calendarHTML += `<div class="calendar-day other-month"></div>`;
  }

  calendarHTML += `</div>`;

  calendarEl.innerHTML = calendarHTML;

  // Event listeners untuk navigasi kalender
  document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });

  document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });

  document.getElementById("todayBtn").addEventListener("click", () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    renderDayDetails(selectedDate);
  });

  // Event listeners untuk setiap hari
  document
    .querySelectorAll(".calendar-day:not(.other-month)")
    .forEach((dayEl) => {
      dayEl.addEventListener("click", () => {
        const dateStr = dayEl.getAttribute("data-date");
        selectedDate = new Date(dateStr);
        renderCalendar();
        renderDayDetails(selectedDate);
      });
    });
}

// Fungsi untuk merender tabel jadwal
function renderJadwalTable() {
  const tableBody = document.getElementById("jadwalTableBody");
  tableBody.innerHTML = "";

  // Hitung statistik
  let sudahCount = 0;
  let belumCount = 0;
  let totalCount = 0;

  jadwalPiket.forEach((petugas) => {
    const row = document.createElement("tr");

    // Cek status untuk hari ini
    const today = new Date();
    const todayName = getNamaHari(today);
    const isToday = petugas.hari === todayName;
    let status = "Belum diatur";
    let statusClass = "";

    if (isToday && petugas.hari) {
      const currentStatus = getStatusForDate(today, petugas.nama);
      if (currentStatus === "sudah") {
        status = "Sudah piket";
        statusClass = "status-sudah";
        sudahCount++;
      } else if (currentStatus === "belum") {
        status = "Belum piket";
        statusClass = "status-belum";
        belumCount++;
      } else {
        status = "Belum diatur";
        statusClass = "";
      }
      totalCount++;
    }

    if (isToday) {
      row.style.backgroundColor = "#ffeaea";
    }

    row.innerHTML = `
            <td>${petugas.no}</td>
            <td><strong>${petugas.nama}</strong></td>
            <td class="hari-cell">${petugas.hari || "-"}</td>
            <td>
                <span class="${statusClass}" style="padding: 5px 10px; border-radius: 15px; font-size: 0.9rem;">
                    ${status}
                </span>
            </td>
        `;

    // Event listener untuk memilih hari
    row.addEventListener("click", () => {
      if (petugas.hari) {
        const targetDayIndex = hariMapping[petugas.hari];
        const today = new Date();
        const diff = targetDayIndex - today.getDay();

        let targetDate = new Date(today);
        targetDate.setDate(today.getDate() + diff);

        if (diff < 0 || (diff === 0 && today.getHours() >= 16)) {
          targetDate.setDate(today.getDate() + diff + 7);
        }

        selectedDate = targetDate;
        currentDate = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          1,
        );
        renderCalendar();
        renderDayDetails(selectedDate);
      }
    });

    tableBody.appendChild(row);
  });

  // Update statistik di footer
  const infoHariIniEl = document.getElementById("infoHariIni");
  const today = new Date();
  const todayName = getNamaHari(today);
  const petugasHariIni = getPetugasByHari(todayName);

  if (petugasHariIni.length > 0) {
    const petugasNames = petugasHariIni.map((p) => p.nama).join(", ");
    infoHariIniEl.innerHTML = `
            <i class="fas fa-bell"></i> 
            <strong>Pengingat:</strong> Hari ini ${todayName}: ${petugasNames} bertugas piket!
            <br>
            <span style="font-size: 0.9rem; color: #666;">
                Status: ${sudahCount} sudah, ${belumCount} belum, ${petugasHariIni.length - sudahCount - belumCount} belum diatur
            </span>
        `;
  } else {
    infoHariIniEl.innerHTML = `<i class="fas fa-calendar-alt"></i> Pilih tanggal untuk mengatur status piket`;
  }
}

// Fungsi untuk merender detail hari
function renderDayDetails(date) {
  const dayDetailsEl = document.getElementById("dayDetails");
  const dayName = getNamaHari(date);
  const petugasHariIni = getPetugasByHari(dayName);
  const dateKey = date.toISOString().split("T")[0];

  let sudahCount = 0;
  let belumCount = 0;

  if (statusPiket[dateKey]) {
    petugasHariIni.forEach((petugas) => {
      if (statusPiket[dateKey][petugas.nama] === "sudah") {
        sudahCount++;
      } else if (statusPiket[dateKey][petugas.nama] === "belum") {
        belumCount++;
      }
    });
  }

  let detailsHTML = `
        <div class="selected-day-header">
            <div class="selected-day-title">
                <i class="fas fa-calendar-day"></i>
                <span>${dayName}, ${date.getDate()} ${getNamaBulan(date)} ${date.getFullYear()}</span>
            </div>
            <div class="day-info">
                <span style="padding: 8px 15px; background-color: ${petugasHariIni.length > 0 ? "#fff8e1" : "#f5f5f5"}; border-radius: 20px; font-weight: 600; color: ${petugasHariIni.length > 0 ? "#ff9800" : "#999"}">
                    <i class="fas ${petugasHariIni.length > 0 ? "fa-users" : "fa-user-slash"}"></i>
                    ${petugasHariIni.length} Petugas
                </span>
            </div>
        </div>
    `;

  if (petugasHariIni.length > 0) {
    detailsHTML += `
            <h3 style="margin-bottom: 15px; color: #8b0000;">Atur Status Piket:</h3>
            <div class="petugas-container">
        `;

    petugasHariIni.forEach((petugas) => {
      const currentStatus = getStatusForDate(date, petugas.nama);

      detailsHTML += `
                <div class="petugas-card">
                    <div class="petugas-nomor">${petugas.no}</div>
                    <div class="petugas-nama">${petugas.nama}</div>
                    <div class="status-controls">
                        <button class="status-btn sudah ${currentStatus === "sudah" ? "active" : ""}" 
                                data-petugas="${petugas.nama}" data-status="sudah">
                            <i class="fas fa-check"></i> Sudah
                        </button>
                        <button class="status-btn belum ${currentStatus === "belum" ? "active" : ""}" 
                                data-petugas="${petugas.nama}" data-status="belum">
                            <i class="fas fa-times"></i> Belum
                        </button>
                    </div>
                    <div class="status-info">
                        Status: <strong>${currentStatus ? currentStatus.toUpperCase() : "BELUM DIATUR"}</strong>
                    </div>
                </div>
            `;
    });

    detailsHTML += `</div>`;

    // Status summary
    detailsHTML += `
            <div class="status-summary">
                <div class="summary-item">
                    <span class="summary-count sudah">${sudahCount}</span>
                    <span class="summary-label">Sudah Piket</span>
                </div>
                <div class="summary-item">
                    <span class="summary-count belum">${belumCount}</span>
                    <span class="summary-label">Belum Piket</span>
                </div>
                <div class="summary-item">
                    <span class="summary-count" style="color: #ff9800;">${petugasHariIni.length - sudahCount - belumCount}</span>
                    <span class="summary-label">Belum Diatur</span>
                </div>
            </div>
        `;

    // Save controls
    detailsHTML += `
            <div class="save-controls">
                <button class="save-btn" id="saveAllSudah">
                    <i class="fas fa-check-double"></i> Tandai Semua Sudah
                </button>
                <button class="save-btn" id="saveAllBelum">
                    <i class="fas fa-times-circle"></i> Tandai Semua Belum
                </button>
            </div>
        `;
  } else {
    detailsHTML += `
            <div class="empty-state">
                <i class="fas fa-broom" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                <p>Tidak ada jadwal piket untuk ${dayName}</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Silakan pilih hari lain</p>
            </div>
        `;
  }

  dayDetailsEl.innerHTML = detailsHTML;
  dayDetailsEl.classList.remove("hidden");

  // Event listeners untuk tombol status
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const petugasNama = this.getAttribute("data-petugas");
      const status = this.getAttribute("data-status");

      saveStatus(date, petugasNama, status);

      renderDayDetails(date);
      renderCalendar();
      renderJadwalTable();
    });
  });

  // Event listener untuk "Tandai Semua Sudah"
  document.getElementById("saveAllSudah")?.addEventListener("click", () => {
    petugasHariIni.forEach((petugas) => {
      saveStatus(date, petugas.nama, "sudah");
    });

    renderDayDetails(date);
    renderCalendar();
    renderJadwalTable();
  });

  // Event listener untuk "Tandai Semua Belum"
  document.getElementById("saveAllBelum")?.addEventListener("click", () => {
    petugasHariIni.forEach((petugas) => {
      saveStatus(date, petugas.nama, "belum");
    });

    renderDayDetails(date);
    renderCalendar();
    renderJadwalTable();
  });
}

// Fungsi untuk toggle panel notifikasi
function toggleNotificationPanel() {
  const panel = document.getElementById("notificationPanel");
  panel.classList.toggle("open");

  // Render ulang notifikasi setiap kali panel dibuka
  if (panel.classList.contains("open")) {
    renderNotifications();
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Render kalender
  renderCalendar();

  // Render tabel jadwal
  renderJadwalTable();

  // Render detail hari ini
  renderDayDetails(selectedDate);

  // Render notifikasi
  renderNotifications();

  // Tampilkan notifikasi awal
  setTimeout(() => {
    showInitialNotification();
  }, 1000);

  // Update badge notifikasi
  updateNotificationBadge();

  // Event listeners untuk notifikasi
  document
    .getElementById("notificationBadge")
    .addEventListener("click", toggleNotificationPanel);
  document
    .getElementById("notificationToggleBtn")
    .addEventListener("click", toggleNotificationPanel);
  document
    .getElementById("closeNotification")
    .addEventListener("click", toggleNotificationPanel);

  // Auto-refresh notifikasi setiap 5 menit
  setInterval(
    () => {
      updateNotificationBadge();
    },
    5 * 60 * 1000,
  );

  // Cek notifikasi setiap hari
  const lastCheck = localStorage.getItem("lastNotificationCheck");
  const today = new Date().toDateString();

  if (lastCheck !== today) {
    // Reset viewed notifications untuk hari baru
    viewedNotifications = {};
    localStorage.setItem(
      "viewedNotifications",
      JSON.stringify(viewedNotifications),
    );
    localStorage.setItem("lastNotificationCheck", today);
    updateNotificationBadge();
  }
});
