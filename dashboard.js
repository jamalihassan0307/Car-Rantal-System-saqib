let cars = JSON.parse(localStorage.getItem("cars")) || [
  {
    id: 1,
    name: "Toyota Camry",
    model: "2022",
    status: "available",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb",
    price: "$50/day",
    features: ["Automatic", "AC", "GPS"],
    description: "Comfortable sedan perfect for family trips",
  },
  {
    id: 2,
    name: "Honda Civic",
    model: "2021",
    status: "rented",
    image:
      "https://th.bing.com/th/id/R.5af9279b3b4dc50e1a8557252b2e3ab9?rik=A3kTDs1NAzlrAw&riu=http%3a%2f%2fwww.thetruthaboutcars.com%2fwp-content%2fuploads%2f2016%2f09%2f2017_Honda_Civic_Hatchback_07.jpg&ehk=kL6Ce2r1AWtEf0gdSHDnYnEaRQOfqxrDv%2bAvy4qKmc8%3d&risl=&pid=ImgRaw&r=0",
    price: "$45/day",
    features: ["Manual", "AC", "Bluetooth"],
    description: "Efficient and reliable compact car",
  },
];

// Save cars to localStorage
function saveCars() {
  localStorage.setItem("cars", JSON.stringify(cars));
}

// Function to render cars
function renderCars(carsToRender) {
  const container = document.getElementById("carsContainer");
  container.innerHTML = "";

  if (carsToRender.length === 0) {
    container.innerHTML =
      '<div class="no-results">No cars found matching your criteria</div>';
    return;
  }

  carsToRender.forEach((car) => {
    const card = document.createElement("div");
    card.className = "car-card";
    card.innerHTML = `
            <img src="${car.image}" alt="${car.name}">
            <div class="car-info">
                <h3>${car.name}</h3>
                <p>Model: ${car.model}</p>
                <p>Status: <span class="status ${car.status}">${
      car.status
    }</span></p>
            </div>
            <div class="car-actions">
                ${
                  car.status === "available"
                    ? `<button class="action-btn rent-btn" onclick="rentCar(${car.id})">Rent</button>`
                    : `<button class="action-btn return-btn" onclick="returnCar(${car.id})">Return</button>`
                }
                <button class="action-btn edit-btn" onclick="editCar(${
                  car.id
                })">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteCar(${
                  car.id
                })">Delete</button>
            </div>
        `;

    card.addEventListener("click", (e) => {
      // Don't show details if clicking action buttons
      if (!e.target.classList.contains("action-btn")) {
        showCarDetails(car);
      }
    });
    container.appendChild(card);
  });
}

// Function to show car details in modal
function showCarDetails(car) {
  const modal = document.getElementById("carModal");
  const details = document.getElementById("carDetails");

  details.innerHTML = `
        <h2>${car.name}</h2>
        <img src="${car.image}" alt="${car.name}" style="max-width: 100%;">
        <p><strong>Model:</strong> ${car.model}</p>
        <p><strong>Status:</strong> <span class="status ${car.status}">${
    car.status
  }</span></p>
        <p><strong>Price:</strong> ${car.price}</p>
        <p><strong>Features:</strong> ${car.features.join(", ")}</p>
        <p><strong>Description:</strong> ${car.description}</p>
        ${
          car.status === "available"
            ? `<button class="action-btn rent-btn" onclick="rentCar(${car.id}); document.getElementById('carModal').style.display='none';">
                Rent Now
            </button>`
            : `<button class="action-btn return-btn" onclick="returnCar(${car.id}); document.getElementById('carModal').style.display='none';">
                Return Car
            </button>`
        }
    `;

  modal.style.display = "block";
}

// Close modal when clicking the close button
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("carModal").style.display = "none";
});

// Search by car name function
function searchByName(searchTerm) {
  const term = searchTerm.toLowerCase().trim();
  const statusFilter = document.getElementById("statusFilter").value;

  let filteredCars = cars.filter((car) => {
    // Search filter - only by car name
    const matchesSearch = car.name.toLowerCase().includes(term);

    // Status filter
    const matchesStatus = statusFilter === "all" || car.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  renderCars(filteredCars);
}

// Update the status filter event listener to work with search
document.addEventListener("DOMContentLoaded", () => {
  // Initial render
  renderCars(cars);

  // Get elements
  const searchInput = document.getElementById("searchInput");
  const statusFilter = document.getElementById("statusFilter");

  // Reset filters
  searchInput.value = "";
  statusFilter.value = "all";

  // Add event listener for status filter
  statusFilter.addEventListener("change", () => {
    searchByName(searchInput.value); // Re-apply search with current term
  });

  // Add event listener for Add Car button
  const addCarBtn = document.getElementById("addCarBtn");
  if (addCarBtn) {
    addCarBtn.onclick = () => (addCarModal.style.display = "block");
  }
});

// Add Car functionality
const addCarModal = document.getElementById("addCarModal");
const addCarBtn = document.getElementById("addCarBtn");
const addCarForm = document.getElementById("addCarForm");

addCarBtn.onclick = () => (addCarModal.style.display = "block");

addCarForm.onsubmit = (e) => {
  e.preventDefault();
  const newCar = {
    id: Date.now(), // Generate unique ID
    name: document.getElementById("carName").value,
    model: document.getElementById("carModel").value,
    status: document.getElementById("carStatus").value,
    image: document.getElementById("carImage").value,
    price: document.getElementById("carPrice").value,
    features: document
      .getElementById("carFeatures")
      .value.split(",")
      .map((f) => f.trim()),
    description: document.getElementById("carDescription").value,
  };

  cars.push(newCar);
  saveCars();
  renderCars(cars);
  addCarModal.style.display = "none";
  addCarForm.reset();
};

// Edit Car functionality
const editCarModal = document.getElementById("editCarModal");
const editCarForm = document.getElementById("editCarForm");

function editCar(carId) {
  event.stopPropagation(); // Prevent modal from opening
  const car = cars.find((c) => c.id === carId);
  if (!car) return;

  // Fill the edit form with car details
  document.getElementById("editCarId").value = car.id;
  document.getElementById("editCarName").value = car.name;
  document.getElementById("editCarModel").value = car.model;
  document.getElementById("editCarImage").value = car.image;
  document.getElementById("editCarPrice").value = car.price
    .replace("$", "")
    .replace("/day", "");
  document.getElementById("editCarStatus").value = car.status;
  document.getElementById("editCarFeatures").value = car.features.join(", ");
  document.getElementById("editCarDescription").value = car.description;

  editCarModal.style.display = "block";
}

editCarForm.onsubmit = (e) => {
  e.preventDefault();
  const carId = parseInt(document.getElementById("editCarId").value);
  const carIndex = cars.findIndex((c) => c.id === carId);

  if (carIndex === -1) return;

  // Update car details
  cars[carIndex] = {
    id: carId,
    name: document.getElementById("editCarName").value,
    model: document.getElementById("editCarModel").value,
    status: document.getElementById("editCarStatus").value,
    image: document.getElementById("editCarImage").value,
    price: `$${document.getElementById("editCarPrice").value}/day`,
    features: document
      .getElementById("editCarFeatures")
      .value.split(",")
      .map((f) => f.trim()),
    description: document.getElementById("editCarDescription").value,
  };

  saveCars();
  renderCars(cars);
  editCarModal.style.display = "none";
};

// Delete Car functionality
function deleteCar(carId) {
  if (confirm("Are you sure you want to delete this car?")) {
    cars = cars.filter((car) => car.id !== carId);
    saveCars();
    renderCars(cars);
  }
}

// Close modals when clicking the close button
document.querySelectorAll(".close").forEach((closeBtn) => {
  closeBtn.onclick = function () {
    this.closest(".modal").style.display = "none";
  };
});

// Close modals when clicking outside
window.onclick = (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
};

// Rent Car functionality
function rentCar(carId) {
  if (confirm("Are you sure you want to rent this car?")) {
    const carIndex = cars.findIndex((car) => car.id === carId);
    if (carIndex !== -1) {
      cars[carIndex].status = "rented";
      saveCars();
      renderCars(cars);

      // Show success message
      alert("Car has been rented successfully!");
    }
  }
}

// Return Car functionality
function returnCar(carId) {
  if (confirm("Are you sure you want to return this car?")) {
    const carIndex = cars.findIndex((car) => car.id === carId);
    if (carIndex !== -1) {
      cars[carIndex].status = "available";
      saveCars();
      renderCars(cars);

      // Show success message
      alert("Car has been returned successfully!");
    }
  }
}
