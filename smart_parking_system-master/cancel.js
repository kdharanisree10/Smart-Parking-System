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

    // Display Cancel Booking Form
    const cancelBookingSection = document.getElementById("cancel-booking");
    displayCancelBookingForm(getUserBookings());

    // Display Cancel Booking Form
    function displayCancelBookingForm(bookings) {
        cancelBookingSection.innerHTML = "<h3>Cancel Booking</h3>";

        if (!bookings || bookings.length === 0) {
            cancelBookingSection.innerHTML += "<p>No bookings available to cancel.</p>";
            return;
        }

        const activeBookings = bookings.filter(booking => booking.status !== 'canceled');
        if (activeBookings.length === 0) {
            cancelBookingSection.innerHTML += "<p>All bookings are already canceled.</p>";
            return;
        }

        activeBookings.forEach((booking, index) => {
            const slotText = (booking.selectedSlots && booking.selectedSlots.length > 0)
                ? booking.selectedSlots.join(', ')
                : 'N/A';
            const status = booking.status || 'active';

            cancelBookingSection.innerHTML += `
                <div class="cancel-item border-box" data-booking-id="${booking.id}">
                    <p><strong>${index + 1}.</strong> Booking ID: ${booking.id}</p>
                    <p>Slots: ${slotText}</p>
                    <p>Date: ${booking.date}</p>
                    <p>Status: ${status}</p>
                    <button type="button" class="cancel-btn" data-booking-id="${booking.id}">Cancel Booking</button>
                </div>
            `;
        });

        // Attach cancel handlers after rendering
        const cancelButtons = cancelBookingSection.querySelectorAll('.cancel-btn');
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.bookingId;
                cancelBooking(id);
            });
        });
    }

    // Handle Cancel Booking
    function cancelBooking(bookingId) {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        const bookingsArray = JSON.parse(localStorage.getItem('bookings')) || [];
        const index = bookingsArray.findIndex(b => String(b.id) === String(bookingId));

        if (index === -1) {
            alert(`Booking with ID: ${bookingId} not found.`);
            return;
        }

        // Mark as canceled or remove (business choice)
        bookingsArray[index].status = 'canceled';
        localStorage.setItem('bookings', JSON.stringify(bookingsArray));

        alert(`Booking with ID: ${bookingId} has been canceled.`);

        // Update display list
        displayCancelBookingForm(bookingsArray.filter(b => b.email === userData.email));
    }
});