document.addEventListener("DOMContentLoaded", function () {
  const images = document.getElementsByClassName("blur");

  for (let i = 0; i < images.length; i++) {
    // Get 'Click me' text from data-blurtext attribute
    let blurText = images[i].getAttribute("data-blurtext") || "Click me";

    // Create 'Click me' text
    let text = document.createElement("div");
    text.innerHTML = blurText;
    text.style.position = "absolute";
    text.style.top = "50%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.color = "white";
    text.style.fontSize = "20px";

    // Wrap image and text in a container
    let container = document.createElement("div");
    container.style.position = "relative";
    container.style.display = "inline-block";

    // Replace image with container and append image and text to the container
    images[i].parentNode.insertBefore(container, images[i]);
    container.appendChild(images[i]);
    container.appendChild(text);

    // Add onclick handlers
    images[i].onclick = function () {
      images[i].classList.remove("blur");
      text.remove();
    };

    text.onclick = function () {
      images[i].classList.remove("blur");
      text.remove();
    };
  }

  // Add CSS for blur
  let style = document.createElement("style");
  style.innerHTML = `
        .blur {
            filter: blur(5px);
            transition: filter 0.3s ease;
        }
    `;
  document.head.appendChild(style);
});