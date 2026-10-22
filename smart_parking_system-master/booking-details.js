document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userData = currentUser && savedProfile && savedProfile.email === currentUser.email ? savedProfile : currentUser;

    if (!userData || !userData.email) {
        window.location.href = "login.html";
        return;
    }

    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    function getUserBookings() {
        const storedBookings = JSON.parse(localStorage.getItem("bookings")) || [];
        let dirty = false;

        const normalized = storedBookings.map(b => {
            if (!b.id) {
                b.id = "b_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
                dirty = true;
            }
            return b;
        });

        if (dirty) {
            localStorage.setItem("bookings", JSON.stringify(normalized));
        }

        bookings = normalized;
        return bookings.filter(b => b.email === userData.email);
    }

    // Display user name and profile image on sidebar
    const userNameDisplay = document.getElementById("user-name");
    const sidebarImage = document.querySelector(".sidebar .profile img");

    if (userNameDisplay) userNameDisplay.textContent = userData.name || "User Name";
    if (sidebarImage) sidebarImage.src = userData.image || "../images/default-profile.png";

    // Check if the user is admin
    const adminEmail = "admin@smartparking.com";
    const adminLinks = document.getElementById("admin-links");

    if (userData.email === adminEmail && adminLinks) {
        adminLinks.style.display = "block";
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = "block";
        });
    } else {
        if (adminLinks) adminLinks.style.display = "none";
        document.querySelectorAll('.admin-section').forEach(section => {
            section.style.display = "none";
        });
    }

    // Display Booking Details
    const bookingDetailsSection = document.getElementById("booking-details");
    displayBookingDetails(getUserBookings());

    // Display Booking Details
    function displayBookingDetails(bookings) {
        bookingDetailsSection.innerHTML = "<h3>Your Bookings</h3>";

        if (!bookings || bookings.length === 0) {
            bookingDetailsSection.innerHTML += "<p>No bookings found.</p>";
            return;
        }

        bookings.forEach((booking, index) => {
            const slots = booking.selectedSlots ? booking.selectedSlots.join(', ') : 'N/A';
            const fare = booking.totalFare || booking.fare || 0;
            const status = booking.status || 'active';

            bookingDetailsSection.innerHTML += `
                <div class="booking-item border-box">
                    <p><strong>${index + 1}.</strong> Booking ID: ${booking.id}</p>
                    <p>Slots: ${slots}</p>
                    <p>Date: ${booking.date}</p>
                    <p>Status: ${status}</p>
                    <p>Fare: ₹${fare}</p>
                </div>
            `;
        });
    }
});