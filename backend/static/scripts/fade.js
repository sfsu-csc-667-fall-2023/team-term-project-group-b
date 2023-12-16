document.addEventListener("DOMContentLoaded", function () {

  const errorContainer = document.getElementById("errorContainer");
  const generalContainer = document.getElementById("generalContainer");

  function showErrorContainer() {
    if (errorContainer) {
      errorContainer.style.display = "block";
      errorContainer.classList.remove("fade-out");

      void errorContainer.offsetWidth;

      errorContainer.classList.add("fade-out");

      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 3000);

    }
  }

  function showGeneralContainer(){
    if (generalContainer) {
      generalContainer.style.display = "block";
      generalContainer.classList.remove("fade-out");

      void generalContainer.offsetWidth;

      generalContainer.classList.add("fade-out");

      setTimeout(() => {
        generalContainer.style.display = "none";
      }, 3000);
    }
  }

  if (errorContainer) {
    const buttons = document.querySelectorAll('.leftButton');
    buttons.forEach(button => {
      button.addEventListener('click', showErrorContainer);
    });
  } else if (generalContainer){
    const buttons = document.querySelectorAll('.leftButton');
    buttons.forEach(button => {
      button.addEventListener('click', showGeneralContainer);
    });
  }
});
