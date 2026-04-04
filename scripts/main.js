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