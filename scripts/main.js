// =====================
// MODAL HANDLING
// =====================

const openBtns = document.querySelectorAll("#openModal");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");

// Open modal
openBtns.forEach(btn => {
    btn.onclick = () => {
        modal.classList.remove("hidden");
        document.body.style.overflow = "hidden"; // disable scroll
    };
});

// Close modal
if (closeBtn) {
    closeBtn.onclick = () => {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
    };
}

// Close when clicking outside
window.onclick = (e) => {
    if (e.target === modal) {
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";
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
// CHART
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
// SCROLL REVEAL
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

revealOnScroll();
window.addEventListener("scroll", revealOnScroll);

// =====================
// WAITLIST (REAL BACKEND)
// =====================

async function saveUser() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        alert("Please fill all fields");
        return;
    }

    const button = document.querySelector(".modal-content .cta-btn");
    button.innerText = "Submitting...";
    button.disabled = true;

    try {
        const res = await fetch("/api/waitlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email })
        });

        if (!res.ok) {
            throw new Error("Failed");
        }

        alert("You're on the waitlist 🚀");

        // Clear inputs
        nameInput.value = "";
        emailInput.value = "";

        // Close modal
        modal.classList.add("hidden");
        document.body.style.overflow = "auto";

    } catch (err) {
        alert("Something went wrong. Try again.");
    }

    button.innerText = "Request Access";
    button.disabled = false;
}