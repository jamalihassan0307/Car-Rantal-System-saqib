// Function to set active navigation link
function setActiveNavLink() {
  const currentPage =
    window.location.pathname.split("/").pop() || "dashboard.html";
  const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

// Add this to the existing sidebar load function
document.addEventListener("DOMContentLoaded", () => {
  // Wait for sidebar to load before setting active link
  setTimeout(setActiveNavLink, 100);
});
