  /*document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the current user from localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // Check if a user is logged in
    if (currentUser) {
        // Display the user's name in the profile section
        document.getElementById("user-name").textContent = currentUser.name;

        // Check if the user is an admin
        if (currentUser.email === "admin@smartparking.com") {
            // Display admin-specific links and sections
            document.getElementById("admin-links").style.display = "block";
            document.querySelectorAll('.admin-section').forEach(section => {
                section.style.display = "block";
            });
        } else {
            // Hide admin-specific links and sections for regular users
            document.getElementById("admin-links").style.display = "none";
            document.querySelectorAll('.admin-section').forEach(section => {
                section.style.display = "none";
            });
        }
    } else {
        // Redirect to the login page if no user is logged in
        window.location.href = "login.html";
    }
});*/
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

    // Filter only current user bookings
    const userBookings = getUserBookings();

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

    // Handle Sidebar Navigation
    const dashboardSection = document.getElementById("dashboard");
    const profileSection = document.getElementById("profile");
    const bookParkingSection = document.getElementById("book-parking");
    const cancelBookingSection = document.getElementById("cancel-booking");
    const bookingDetailsSection = document.getElementById("booking-details");
    const canceledBookingsSection = document.getElementById("canceled-bookings");
    const ticketFareSection = document.getElementById("ticket-fare");
    const ticketFareLink = document.querySelector("a[href='#ticket-fare']");

    // Button clicks to show corresponding sections
    document.querySelector("a[href='#dashboard']").addEventListener("click", function () {
        showSection(dashboardSection);
    });

    document.querySelector("a[href='#profile']").addEventListener("click", function () {
        showSection(profileSection);
        displayProfile(userData); // Display profile data
    });

    document.querySelector("a[href='#book-parking']").addEventListener("click", function () {
        showSection(bookParkingSection);
        displayBookingForm(); // Display booking form
    });

    document.querySelector("a[href='#cancel-booking']").addEventListener("click", function () {
        showSection(cancelBookingSection);
        displayCancelBookingForm(getUserBookings()); // Display cancel booking options
    });

    document.querySelector("a[href='#booking-details']").addEventListener("click", function () {
        showSection(bookingDetailsSection);
        displayBookingDetails(getUserBookings()); // Display current bookings
    });

    document.querySelector("a[href='#canceled-bookings']").addEventListener("click", function () {
        showSection(canceledBookingsSection);
        displayCanceledBookings(getUserBookings()); // Display canceled bookings
    });

    if (ticketFareLink && ticketFareSection) {
        ticketFareLink.addEventListener("click", function () {
            showSection(ticketFareSection);
            displayTicketFare(); // Display ticket fare details
        });
    }

    // Logout function
    document.querySelector("a[href='#logout']").addEventListener("click", function () {
        localStorage.removeItem("currentUser"); // Remove current user from localStorage
        window.location.href = "../html/login.html"; // Redirect to login page
    });

    // Show specific section by hiding others
    function showSection(section) {
        const sections = document.querySelectorAll(".dashboard-section");
        sections.forEach(sec => sec.style.display = "none");
        section.style.display = "block";
    }

    // Display Profile Information
    function displayProfile(userData) {
        profileSection.innerHTML = `
            <h3>User Profile</h3>
            <p>Name: ${userData.name}</p>
            <p>Email: ${userData.email}</p>
            <p>Vehicle Type: ${userData.vehicleType}</p>
            <p>Vehicle Number: ${userData.vehicleNumber}</p>
            <p>Model: ${userData.modelName}</p>
            <p>Parking Preference: ${userData.parkingPreference}</p>
        `;
    }

    // Display Booking Form (for booking parking)
    function displayBookingForm() {
        bookParkingSection.innerHTML = `
            <h3>Book Parking</h3>
            <form id="dashboard-booking-form">
                <label for="date">Date: </label>
                <input type="date" id="date" name="date" required>
                <label for="spot">Parking Spot: </label>
                <input type="text" id="spot" name="spot" required>
                <label for="fare">Fare: </label>
                <input type="text" id="fare" name="fare" value="$5" disabled>
                <button type="submit">Book Parking</button>
            </form>
        `;
        document.getElementById("dashboard-booking-form").addEventListener("submit", function (e) {
            e.preventDefault();
            const date = document.getElementById("date").value;
            const spot = document.getElementById("spot").value;
            const fare = 5; // fixed fare

            if (!date || !spot) {
                alert("Please fill in all fields.");
                return;
            }

            const bookingData = {
                id: Date.now(),
                location: "dashboard", // placeholder
                vehicleType: "car", // placeholder
                date: date,
                selectedSlots: [spot],
                status: "active",
                totalFare: fare,
                email: userData.email
            };

            let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
            bookings.push(bookingData);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            localStorage.setItem("latestBookingTime", Date.now().toString());

            alert("Parking Booked!");
            showSection(bookingDetailsSection);
            displayBookingDetails(getUserBookings());
        });
    }

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

        activeBookings.forEach(booking => {
            const slotText = (booking.selectedSlots && booking.selectedSlots.length > 0)
                ? booking.selectedSlots.join(', ')
                : 'N/A';
            const status = booking.status || 'active';

            cancelBookingSection.innerHTML += `
                <div class="cancel-item" data-booking-id="${booking.id}">
                    <p>Booking ID: ${booking.id} - Slots: ${slotText} - Date: ${booking.date} - Status: ${status}</p>
                    <button type="button" class="cancel-btn" data-booking-id="${booking.id}">Cancel Booking</button>
                </div>
            `;
        });

        // Attach cancel handlers after rendering
        const cancelButtons = cancelBookingSection.querySelectorAll('.cancel-btn');
        cancelButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.bookingId);
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
        const index = bookingsArray.findIndex(b => b.id === bookingId);

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
        displayBookingDetails(bookingsArray.filter(b => b.email === userData.email));
    }

    // Restore a canceled booking
    function restoreBooking(bookingId) {
        const bookingsArray = JSON.parse(localStorage.getItem('bookings')) || [];
        const index = bookingsArray.findIndex(b => b.id === bookingId);

        if (index === -1) {
            alert(`Canceled booking with ID: ${bookingId} not found.`);
            return;
        }

        bookingsArray[index].status = 'active';
        localStorage.setItem('bookings', JSON.stringify(bookingsArray));

        alert(`Booking with ID: ${bookingId} has been restored.`);

        displayCanceledBookings(bookingsArray.filter(b => b.email === userData.email));
        displayCancelBookingForm(bookingsArray.filter(b => b.email === userData.email));
        displayBookingDetails(bookingsArray.filter(b => b.email === userData.email));
    }

    // Display Booking Details
    function displayBookingDetails(bookings) {
        bookingDetailsSection.innerHTML = "<h3>Your Bookings</h3>";

        if (!bookings || bookings.length === 0) {
            bookingDetailsSection.innerHTML += "<p>No bookings found.</p>";
            return;
        }

        bookings.forEach(booking => {
            const slots = booking.selectedSlots ? booking.selectedSlots.join(', ') : 'N/A';
            const fare = booking.totalFare || booking.fare || 0;
            const status = booking.status || 'active';

            bookingDetailsSection.innerHTML += `
                <div>
                    <p>Booking ID: ${booking.id} - Slots: ${slots} - Date: ${booking.date} - Status: ${status} - Fare: ₹${fare}</p>
                </div>
            `;
        });
    }

    // Display Canceled Booking History
    function displayCanceledBookings(bookings) {
        canceledBookingsSection.innerHTML = "<h3>Canceled Bookings</h3>";

        const canceled = (bookings || []).filter(booking => booking.status === 'canceled');
        if (canceled.length === 0) {
            canceledBookingsSection.innerHTML += "<p>No canceled bookings yet.</p>";
            return;
        }

        canceled.forEach(booking => {
            const slots = booking.selectedSlots ? booking.selectedSlots.join(', ') : 'N/A';
            const fare = booking.totalFare || booking.fare || 0;

            canceledBookingsSection.innerHTML += `
                <div class="canceled-item" data-booking-id="${booking.id}">
                    <p>Booking ID: ${booking.id} - Slots: ${slots} - Date: ${booking.date} - Fare: ₹${fare}</p>
                    <button type="button" class="restore-btn" data-booking-id="${booking.id}">Restore Booking</button>
                </div>
            `;
        });

        // Attach restore handlers after rendering
        const restoreButtons = canceledBookingsSection.querySelectorAll('.restore-btn');
        restoreButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = Number(btn.dataset.bookingId);
                restoreBooking(id);
            });
        });
    }

    // Display Ticket Fare Information
    function displayTicketFare() {
        ticketFareSection.innerHTML = `
            <h3>Ticket Fare</h3>
            <p>Hourly Fare: $5</p>
            <p>Daily Fare: $20</p>
            <p>Monthly Fare: $150</p>
        `;
    }

    // Show the Dashboard section on page load
    showSection(dashboardSection);

    // If a new booking was just made, switch to Booking Details and refresh
    if (localStorage.getItem("latestBookingTime")) {
        localStorage.removeItem("latestBookingTime");
        showSection(bookingDetailsSection);
        displayBookingDetails(getUserBookings());
    }
});

