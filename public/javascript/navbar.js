document.getElementById('user-menu').addEventListener('click', function () {
	// document.getElementById('drop-down').classList.toggle('show')
	let cont = document.getElementById('drop-down')
  console.log("in navbar.js!")
  if (cont.style.display == 'block') {
    cont.style.display = 'none';
}
else {
  cont.style.display = 'block';
}
})