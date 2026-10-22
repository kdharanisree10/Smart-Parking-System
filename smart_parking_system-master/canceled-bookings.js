document.addEventListener("DOMContentLoaded", function () {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userData = currentUser && savedProfile && savedProfile.email === currentUser.email ? savedProfile : currentUser;

    if (!userData || !userData.email) {
        window.location.href = "login.html";
        return;
    }

    const userNameDisplay = document.getElementById("user-name");
    const sidebarImage = document.querySelector(".sidebar .profile img");

    if (userNameDisplay) userNameDisplay.textContent = userData.name || "User Name";
    if (sidebarImage) sidebarImage.src = userData.image || "../images/default-profile.png";

    // admin link logic copy
    const adminEmail = "admin@smartparking.com";
    const adminLinks = document.getElementById("admin-links");

    if (userData.email === adminEmail && adminLinks) {
        adminLinks.style.display = "block";
    } else if (adminLinks) {
        adminLinks.style.display = "none";
    }

    const canceledBookingsList = document.getElementById("canceled-bookings-list");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    const canceled = bookings.filter(b => b.email === userData.email && b.status === "canceled");

    if (canceled.length === 0) {
        canceledBookingsList.innerHTML = "<p>No canceled bookings yet.</p>";
        return;
    }

    canceledBookingsList.innerHTML = "";
    canceled.forEach((booking, index) => {
        const slots = booking.selectedSlots ? booking.selectedSlots.join(", ") : "N/A";
        const fare = booking.totalFare || booking.fare || 0;

        canceledBookingsList.innerHTML += `
            <div class="booking-card border-box">
                <p><strong>${index + 1}.</strong> Booking ID: ${booking.id}</p>
                <p><strong>Slots:</strong> ${slots}</p>
                <p><strong>Date:</strong> ${booking.date}</p>
                <p><strong>Status:</strong> ${booking.status}</p>
                <p><strong>Fare:</strong> ₹${fare}</p>
            </div>
        `;
    });
});