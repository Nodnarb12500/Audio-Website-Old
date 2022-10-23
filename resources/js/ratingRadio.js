
function prependChecks(a) {
  // uncheck everything
  one.className = "checkmark";
  two.className = "checkmark";
  three.className = "checkmark";
  four.className = "checkmark";
  document.getElementById("ratingBtn").value = "Rate";

  // Check what should get checked
  switch(a) {
    case 2:
      one.className = "checkBefore";
    break;
    case 3:
      one.className = "checkBefore";
      two.className = "checkBefore";
    break;
    case 4:
      one.className = "checkBefore";
      two.className = "checkBefore";
      three.className = "checkBefore";
    break;
    case 5:
      one.className = "checkBefore";
      two.className = "checkBefore";
      three.className = "checkBefore";
      four.className = "checkBefore";
    break;
  }

  // add a listen event to the button so we can see it change when we click it
  document.getElementById("ratingBtn").addEventListener("click", (e) => {
    document.getElementById("ratingBtn").value = "Rated";
  });
}
