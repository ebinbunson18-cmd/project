const form = document.getElementById("contactForm");
const status = document.getElementById("status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validation
  if (!name || !email || !message) {
    status.innerText = "Please fill in all fields.";
    status.style.color = "red";
    return;
  }

  try {
    status.innerText = "Sending...";
    status.style.color = "white";

    const response = await fetch("https://project-gqfn.onrender.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const result = await response.text();

    status.innerText = result;
    status.style.color = response.ok ? "lightgreen" : "red";

    if (response.ok) {
      form.reset();
    }

  } catch (error) {
    console.error("Frontend error :", error);
    status.innerText = "Error sending message. Please try again.";
    status.style.color = "red";
  }
});