function pagesBar(page) {
  /* clear out the old buttons */
  pageButtons.innerHTML = "";

  /* page buttons */
  let first = document.createElement("a");
  let index1 = document.createElement("a");
  let index2 = document.createElement("a");
  let index3 = document.createElement("a");
  let index4 = document.createElement("a");
  let index5 = document.createElement("a");
  let last = document.createElement("a");

  let indexOneVal = "0";
  if (parseInt(page) >= 3) {
    indexOneVal = page - 1;
  } else {
    indexOneVal = "1";
  }

  first.innerText = "«";
  first.href = "#";
  first.addEventListener("click", (e) => {
    search(searchbar.value, 1);
  });

  index1.innerText = indexOneVal;
  index1.href = "#";
  if (parseInt(page) == 0) {
    index1.className = "active";
  }
  index1.addEventListener("click", (e) => {
    search(searchbar.value, indexOneVal);
  });

  let indexTwoVal = parseInt(indexOneVal) + 1;
  index2.innerText = indexTwoVal;
  index2.href = "#";
  if (parseInt(page) == 1) {
    index2.className = "active";
  }
  index2.addEventListener("click", (e) => {
    search(searchbar.value, indexTwoVal);
  });

  let indexThreeVal = parseInt(indexTwoVal) + 1;
  index3.innerText = indexThreeVal;
  index3.href = "#";
  if (parseInt(page) >= 2) {
    index3.className = "active";
  }
  index3.addEventListener("click", (e) => {
    search(searchbar.value, indexThreeVal);
  });

  let indexFourVal = parseInt(indexThreeVal) + 1;
  index4.innerText = indexFourVal;
  index4.href = "#";
  index4.addEventListener("click", (e) => {
    search(searchbar.value, indexFourVal);
  });

  let indexFiveVal = parseInt(indexFourVal) + 1;
  index5.innerText = indexFiveVal;
  index5.href = "#";
  index5.addEventListener("click", (e) => {
    search(searchbar.value, indexFiveVal);
  });

  last.innerText = "»";
  last.href = "#";
  last.addEventListener("click", (e) => {
    search(searchbar.value, indexOneVal);
  });

  pageButtons.appendChild(first);
  pageButtons.appendChild(index1);
  pageButtons.appendChild(index2);
  pageButtons.appendChild(index3);
  pageButtons.appendChild(index4);
  pageButtons.appendChild(index5);
  pageButtons.appendChild(last);
}