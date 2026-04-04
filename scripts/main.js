const openBtn = document.getElementById("openModal");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeModal");

openBtn.onclick = () => {
    modal.classList.remove("hidden");
};

closeBtn.onclick = () => {
    modal.classList.add("hidden");
};

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
});
const ctx = document.getElementById('chart');

if (ctx) {
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Spending',
                data: [200, 400, 300, 600, 800, 1200, 900],
                borderColor: '#6366f1',
                tension: 0.4,
                fill: true,
                backgroundColor: 'rgba(99,102,241,0.2)'
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

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.classList.add("active");
        }
    });
});

function saveUser() {
    const inputs = document.querySelectorAll(".modal-content input");

    const user = {
        name: inputs[0].value,
        email: inputs[1].value
    };

    let users = JSON.parse(localStorage.getItem("zenora_users")) || [];
    users.push(user);

    localStorage.setItem("zenora_users", JSON.stringify(users));

    alert("You're on the waitlist 🚀");
}