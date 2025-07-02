document.addEventListener("DOMContentLoaded", () => {
    const messageList = document.getElementById("message-list");
    const inputArea = document.getElementById("input-area");
    const messageTemplate = document.getElementById("message-template");

    // Script percakapan yang diperbarui
    const conversationScript = [
        { sender: "assistant", text: "Menginisialisasi koneksi aman... Koneksi berhasil.", delay: 1000 },
        { sender: "assistant", text: "Selamat datang, Bapak/Ibu Kepala Kantor. Gubernur ingin berbicara dengan Anda sekarang. Mohon bersiap.", delay: 2000 },
        { sender: "gubernur", text: "Assalaamu'alaikum wa rahmatullahi wa barakaatuh. Terima kasih telah bergabung. Waktu kita tidak banyak, jadi saya langsung ke intinya.", delay: 2500 },
        { sender: "gubernur", text: "Seperti yang kita tahu, Provinsi Pulau Sumbawa ini lahir dari aspirasi puluhan tahun. Ini bukan sekadar proyek, ini soal keadilan, pemerataan, dan masa depan jutaan rakyat kita.", delay: 4000 },
        { sender: "gubernur", text: "Visi saya jelas. Kita tidak akan meniru cara lama. Kita akan 'melompat'. Saya sudah menyetujui nama besar untuk visi kita: <strong>'Gerbang Digital Indonesia Timur'</strong>. Tugas Anda adalah membuat visi ini menjadi kenyataan.", delay: 5000 },
        { sender: "assistant", text: "Terima kasih, Bapak Gubernur. Saya akan mengambil alih untuk briefing teknis. Bapak/Ibu Kepala Kantor, mandat Anda akan dibagi menjadi tiga bagian utama. Apakah Anda siap untuk menerima Bagian 1?", delay: 3000, options: [{ text: "Ya, saya siap.", next: "part1" }] },
        
        { id: "part1", sender: "assistant", text: "<strong>BAGIAN 1: FONDASI STRATEGIS, VISI, DAN ARSITEKTUR DIGITAL.</strong><br><br>1. Jabarkan visi 'Gerbang Digital Indonesia Timur'.<br>2. Rancang 'Sumbawa Digital Platform (SDP)'.", delay: 1000, options: [{ text: "Paham. Lanjutkan ke Bagian 2.", next: "part2" }] },
        
        { id: "part2", sender: "assistant", text: "<strong>BAGIAN 2: PROGRAM UNGGULAN, SOLUSI NYATA UNTUK MASYARAKAT.</strong><br><br>Pilih dan jelaskan secara detail DUA dari tiga program unggulan: (A) Layanan Publik, (B) Ekonomi Unggul, atau (C) Generasi Sehat & Cerdas.", delay: 1000, options: [{ text: "Mengerti. Lanjutkan ke Bagian 3.", next: "part3" }] },
        
        { id: "part3", sender: "assistant", text: "<strong>BAGIAN 3: TATA KELOLA, MENJAGA KEPERCAYAAN DAN KEAMANAN.</strong><br><br>1. Rancang Strategi Pertahanan Siber.<br>2. Buat Kerangka Etika AI untuk Bantuan Sosial.", delay: 1000, options: [{ text: "Siap. Berikan sumber daya.", next: "resources" }] },
        
        { id: "resources", sender: "assistant", text: "Tentu. Berikut adalah tautan sumber daya yang Anda butuhkan untuk menyelesaikan mandat ini:<br>1. <a href='https://www.bimakini.com/2025/06/provinsi-baru-harapan-baru-masyarakat-pulau-sumbawa/' target='_blank'>Konteks Aspirasi Masyarakat (BimaKini.com)</a><br>2. <a href='https://www.sciencedirect.com/science/article/pii/S2772918423000188' target='_blank'>Referensi Ancaman Siber (ScienceDirect)</a>", delay: 1000, options: [{ text: "Saya sudah menerima semua sumber daya.", next: "submission" }] },
        
        { id: "submission", sender: "assistant", text: "<strong>PROTOKOL PENGUMPULAN:</strong><br><br>Jawaban Anda harus disusun dalam satu file <strong>PDF</strong> sebagai 'Blueprint Kebijakan Strategis', maksimal 10 halaman, dengan struktur yang mencakup Ringkasan Eksekutif dan tiga bagian utama.", delay: 1000, options: [{ text: "Briefing Selesai. Terima Kasih.", next: "end" }] },
        
        // --- PERUBAHAN DI SINI ---
        { 
            id: "end", 
            sender: "assistant", 
            text: "Sama-sama. Masa depan Provinsi Pulau Sumbawa ada di tangan Anda. Untuk detail informasi lengkap dari setiap perintah soal, silakan akses dokumen mandat resmi di bawah. Koneksi aman akan diputus. Selamat bekerja.", 
            delay: 1500,
            options: [
                { 
                    text: "Buka Dokumen Mandat Lengkap", 
                    link: "mandat_detail.html" // Ini akan mengarah ke file tab-based
                }
            ] 
        }
    ];

    let currentStep = 0;

    function displayMessage(messageData) {
        const messageClone = messageTemplate.content.cloneNode(true);
        const messageDiv = messageClone.querySelector(".message");
        messageDiv.classList.add(messageData.sender);
        messageClone.querySelector(".sender-name").textContent = messageData.sender.charAt(0).toUpperCase() + messageData.sender.slice(1);
        messageClone.querySelector(".text-bubble").innerHTML = messageData.text;
        messageList.appendChild(messageClone);
        messageList.scrollTop = messageList.scrollHeight;
    }

    // --- FUNGSI DIPERBARUI UNTUK MENDUKUNG LINK ---
    function handleOptions(options) {
        inputArea.innerHTML = "";
        if (!options) return;

        options.forEach(option => {
            const button = document.createElement("button");
            button.className = "response-button";
            button.textContent = option.text;

            if (option.link) {
                // Jika opsi memiliki properti link, buat tombol menjadi sebuah link
                const link = document.createElement("a");
                link.href = option.link;
                link.target = "_blank"; // Buka di tab baru agar briefing tidak hilang
                link.appendChild(button);
                inputArea.appendChild(link);
            } else {
                // Jika tidak, fungsikan sebagai tombol navigasi percakapan
                button.onclick = () => {
                    const nextStepIndex = conversationScript.findIndex(step => step.id === option.next);
                    if (nextStepIndex !== -1) {
                        currentStep = nextStepIndex;
                        runConversation();
                    }
                };
                inputArea.appendChild(button);
            }
        });
    }

    function runConversation() {
        if (currentStep >= conversationScript.length) return;
        inputArea.innerHTML = "";
        const step = conversationScript[currentStep];

        setTimeout(() => {
            displayMessage(step);
            handleOptions(step.options);
            if (!step.options) {
                currentStep++;
                runConversation();
            }
        }, step.delay);
    }

    runConversation();
});