// document.addEventListener("DOMContentLoaded", function () {
//     const editBtn = document.getElementById("edit-profile");
//     const saveBtn = document.getElementById("save-profile");
//     const profileFields = document.querySelectorAll(".profile-input");
//     const profileImageInput = document.getElementById("profile-image-upload");
//     const profileImage = document.getElementById("profile-image");

//     // Load stored data (temporary local storage simulation)
//     function loadProfileData() {
//         const storedData = JSON.parse(localStorage.getItem("userProfile"));
//         if (storedData) {
//             document.getElementById("full-name").value = storedData.name || "";
//             document.getElementById("email").value = storedData.email || "";
//             document.getElementById("phone").value = storedData.phone || "";
//             if (storedData.image) {
//                 profileImage.src = storedData.image;
//             }
//         }
//     }

//     // Enable editing fields
//     editBtn.addEventListener("click", function () {
//         profileFields.forEach(field => field.removeAttribute("disabled"));
//         saveBtn.style.display = "inline-block";
//         editBtn.style.display = "none";
//     });

//     // Save profile data
//     saveBtn.addEventListener("click", function () {
//         const userProfile = {
//             name: document.getElementById("full-name").value,
//             email: document.getElementById("email").value,
//             phone: document.getElementById("phone").value,
//             image: profileImage.src
//         };
        
//         // Store data in local storage (for now)
//         localStorage.setItem("userProfile", JSON.stringify(userProfile));

//         // Disable fields after saving
//         profileFields.forEach(field => field.setAttribute("disabled", "true"));
//         saveBtn.style.display = "none";
//         editBtn.style.display = "inline-block";
//     });

//     // Profile image upload preview
//     profileImageInput.addEventListener("change", function (event) {
//         const file = event.target.files[0];
//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 profileImage.src = e.target.result;
//             };
//             reader.readAsDataURL(file);
//         }
//     });

//     // Load profile data when page loads
//     loadProfileData();
// });
document.addEventListener("DOMContentLoaded", function () {
    const profilePictureInput = document.getElementById("profilePicture");
    const previewImage = document.getElementById("previewImage");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const profileForm = document.getElementById("profileForm");

    // Load profile data from localStorage on page load
    function loadProfile() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

        const data = currentUser && savedProfile && savedProfile.email === currentUser.email
            ? savedProfile
            : currentUser || {};

        nameInput.value = data.name || "";
        emailInput.value = data.email || "";
        phoneInput.value = data.phone || "";

        const cardImage = document.getElementById("card-image");
        const cardName = document.getElementById("card-name");
        const cardEmail = document.getElementById("card-email");
        const cardPhone = document.getElementById("card-phone");

        cardName.textContent = data.name || "";
        cardEmail.textContent = data.email || "";
        cardPhone.textContent = data.phone || "";

        if (data.image) {
            previewImage.src = data.image;
            cardImage.src = data.image;
        }
    }

    // Save profile data to localStorage when form is submitted
    profileForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const userProfile = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            image: previewImage.src
        };

        localStorage.setItem("userProfile", JSON.stringify(userProfile));

        // Also update currentUser (for dashboard top profile)
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser) {
            currentUser.name = userProfile.name;
            currentUser.email = userProfile.email;
            currentUser.phone = userProfile.phone;
            currentUser.image = userProfile.image;
            localStorage.setItem("currentUser", JSON.stringify(currentUser));

            // Keep users list in sync
            const users = JSON.parse(localStorage.getItem("users")) || [];
            const index = users.findIndex(u => u.email === currentUser.email);
            if (index >= 0) {
                users[index] = { ...users[index], ...currentUser };
                localStorage.setItem("users", JSON.stringify(users));
            }
        }

        alert("Profile saved successfully!");

        // Update parent dashboard's profile UI if it exists in same context
        const sidebarImage = document.querySelector(".sidebar .profile img");
        const sidebarName = document.getElementById("user-name");
        if (sidebarImage) sidebarImage.src = userProfile.image;
        if (sidebarName) sidebarName.textContent = userProfile.name;

        // Update card data on this page too
        const cardImage = document.getElementById("card-image");
        const cardName = document.getElementById("card-name");
        const cardEmail = document.getElementById("card-email");
        const cardPhone = document.getElementById("card-phone");

        if (cardImage) cardImage.src = userProfile.image;
        if (cardName) cardName.textContent = userProfile.name;
        if (cardEmail) cardEmail.textContent = userProfile.email;
        if (cardPhone) cardPhone.textContent = userProfile.phone;
    });

    // Show preview image immediately after file is chosen
    profilePictureInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                previewImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved profile data right away
    loadProfile();
});
