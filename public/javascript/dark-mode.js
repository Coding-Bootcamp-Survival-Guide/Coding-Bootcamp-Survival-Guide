function toggleDarkLight() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

document.querySelector('.toggle-dark-light').addEventListener('click', toggleDarkLight);