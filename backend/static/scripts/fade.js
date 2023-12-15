document.addEventListener("DOMContentLoaded", function () {
  // Get a reference to the error container
  const errorContainer = document.getElementById("errorContainer");

  // Function to hide the error container with a fade-out effect
  function hideErrorContainer() {
    if (errorContainer) {
      // Add a CSS class to initiate the fade-out transition
      errorContainer.classList.add("fade-out");

      // Set a timeout to hide the container after the transition completes (1000 milliseconds)
      setTimeout(() => {
        errorContainer.style.display = "none";
      }, 1000);
    }
  }

  // Check if there's an error container
  if (errorContainer) {
    // Set a timeout to call the hideErrorContainer function after 3000 milliseconds (3 seconds)
    setTimeout(hideErrorContainer, 2000);
  }
});
