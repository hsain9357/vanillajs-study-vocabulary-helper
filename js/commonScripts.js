const pagesMenu = document.querySelector(".pagesMenu");
const pagesList = document.querySelector(".pagesList");

pagesMenu.addEventListener("click", () => {
  pagesMenu.classList.toggle("close");
  pagesList.classList.toggle("active");
});
