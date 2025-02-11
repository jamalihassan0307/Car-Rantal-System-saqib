// Function to load and insert sidebar
async function loadSidebar() {
  try {
    const response = await fetch("sidebar.html");
    const sidebarContent = await response.text();
    document.getElementById("sidebarContainer").innerHTML = sidebarContent;
  } catch (error) {
    console.error("Error loading sidebar:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadSidebar);
