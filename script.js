const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const status = document.getElementById("status");

  try {
    const res = await fetch("https://project-gqfn.onrender.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, message })
    });

    const text = await res.text();
    status.innerText = text;
    form.reset();

  } catch (err) {
    status.innerText = "Error sending message";
  }
});