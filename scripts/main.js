// =====================
// MODAL HANDLING (FIXED)
// =====================

// Support MULTIPLE buttons
const openBtns = document.querySelectorAll("#openModal");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");

openBtns.forEach(btn => {
    btn.onclick = () => {
        modal.classList.remove("hidden");
    };
});

if (closeBtn) {
    closeBtn.onclick = () => {
        modal.classList.add("hidden");
    };
}

// Close when clicking outside modal
window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
    }
};

// =====================
// CURSOR GLOW (SAFE)
// =====================

const glow = document.querySelector(".cursor-glow");

if (glow) {
    document.addEventListener("mousemove", (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
    });
}

// =====================
// CHART (SAFE INIT)
// =====================

const ctx = document.getElementById("chart");

if (ctx) {
    new Chart(ctx, {
        type: "line",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [{
                data: [200, 400, 300, 600, 800, 1200, 900],
                borderColor: "#1e3a8a",
                tension: 0.4,
                fill: true,
                backgroundColor: "rgba(30,58,138,0.1)"
            }]
        },
        options: {
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: false }
            }
        }
    });
}

// =====================
// SCROLL REVEAL (IMPROVED)
// =====================

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;

        if (top < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

// Run once on load
revealOnScroll();

// Run on scroll
window.addEventListener("scroll", revealOnScroll);

// =====================
// WAITLIST STORAGE
// =====================

function saveUser() {
    const inputs = document.querySelectorAll(".modal-content input");

    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();

    // Basic validation
    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    const user = { name, email };

    let users = JSON.parse(localStorage.getItem("zenora_users")) || [];
    users.push(user);

    localStorage.setItem("zenora_users", JSON.stringify(users));

    alert("You're on the waitlist 🚀");

    // Clear inputs
    inputs.forEach(input => input.value = "");

    // Close modal
    modal.classList.add("hidden");
}