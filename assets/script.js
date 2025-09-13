// Listen for the scroll event and log the event data
// Initialize Lenis
const lenis = new Lenis({
  autoRaf: true,
});

// Listen for the scroll event and log the event data
lenis.on("scroll", (e) => {});

// Utility functions
function $(selector) {
  return document.querySelector(selector);
}

function $(selector) {
  return document.querySelectorAll(selector);
}

// Smooth scrolling function
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
const mobileMenu = document.querySelector("#mobileMenu");

mobileMenuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
  const icon = mobileMenuBtn.querySelector("i");
  if (mobileMenu.classList.contains("hidden")) {
    icon.className = "fas fa-bars text-xl";
  } else {
    icon.className = "fas fa-times text-xl";
  }
});

// Search functionality
const searchInput = document.querySelector("#searchInput");
let searchTimeout;

searchInput.addEventListener("input", function (e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    const searchTerm = e.target.value.toLowerCase().trim();
    const promptCards = document.querySelectorAll(".prompt-card");
    let visibleCount = 0;

    promptCards.forEach((card, index) => {
      const title = card.querySelector("h3").textContent.toLowerCase();
      const prompt = card.querySelector("code").textContent.toLowerCase();

      if (
        searchTerm === "" ||
        title.includes(searchTerm) ||
        prompt.includes(searchTerm)
      ) {
        card.style.display = "block";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
          card.style.transition = "all 0.5s ease";
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, index * 100);

        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    // Show no results message
    const noResultsMsg = document.querySelector("#noResultsMessage");
    if (noResultsMsg) noResultsMsg.remove();

    if (visibleCount === 0 && searchTerm !== "") {
      const promptsGrid = document.querySelector("#promptsGrid");
      const noResults = document.createElement("div");
      noResults.id = "noResultsMessage";
      noResults.className = "col-span-full text-center py-12";
      noResults.innerHTML = `
                        <i class="fas fa-search text-4xl text-gray-300 mb-4"></i>
                        <h3 class="text-xl font-semibold text-gray-600 mb-2">No prompts found</h3>
                        <p class="text-gray-500">Try adjusting your search terms</p>
                    `;
      promptsGrid.appendChild(noResults);
    }
  }, 300);
});

// Filter prompts by category
function filterPrompts(category) {
  const promptCards = document.querySelectorAll(".prompt-card");
  let delay = 0;

  // First hide all cards
  promptCards.forEach((card) => {
    card.style.transition = "all 0.3s ease";
    card.style.opacity = "0";
    card.style.transform = "scale(0.95)";
  });

  setTimeout(() => {
    promptCards.forEach((card, index) => {
      if (card.getAttribute("data-category") === category) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "scale(1)";
        }, delay);
        delay += 100;
      } else {
        card.style.display = "none";
      }
    });
  }, 300);

  // Scroll to prompts section
  setTimeout(() => {
    scrollToSection("prompts");
  }, 500);
}

// Show all prompts
function showAllPrompts() {
  const promptCards = document.querySelector(".prompt-card");
  let delay = 0;

  // Remove no results message if exists
  const noResultsMsg = document.querySelector("#noResultsMessage");
  if (noResultsMsg) noResultsMsg.remove();

  promptCards.forEach((card, index) => {
    card.style.display = "block";
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.5s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, delay);
    delay += 50;
  });

  // Clear search input
  searchInput.value = "";
}

// Copy prompt functionality with enhanced feedback
document.addEventListener("click", function (e) {
  if (e.target.closest(".copy-btn")) {
    e.preventDefault();
    const button = e.target.closest(".copy-btn");
    const promptCard = button.closest(".prompt-card");
    const promptCode = promptCard.querySelector("code").textContent.trim();

    // Modern clipboard API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(promptCode)
        .then(() => {
          showCopyFeedback(button);
        })
        .catch(() => {
          fallbackCopyTextToClipboard(promptCode, button);
        });
    } else {
      fallbackCopyTextToClipboard(promptCode, button);
    }
  }
});

// Fallback copy function for older browsers
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
    showCopyFeedback(button);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }

  document.body.removeChild(textArea);
}

// Enhanced copy feedback
function showCopyFeedback(button) {
  const originalHTML = button.innerHTML;
  const originalClasses = button.className;

  button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
  button.className = button.className.replace(
    "text-indigo-600",
    "text-green-600"
  );
  button.style.transform = "scale(1.05)";

  // Create floating success message
  const successMsg = document.createElement("div");
  successMsg.textContent = "Prompt copied to clipboard!";
  successMsg.className =
    "fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in";
  document.body.appendChild(successMsg);

  setTimeout(() => {
    button.innerHTML = originalHTML;
    button.className = originalClasses;
    button.style.transform = "";
  }, 2000);

  setTimeout(() => {
    successMsg.style.opacity = "0";
    successMsg.style.transform = "translateX(100%)";
    setTimeout(() => {
      if (document.body.contains(successMsg)) {
        document.body.removeChild(successMsg);
      }
    }, 300);
  }, 3000);
}

// Scroll animations with Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("revealed");
    }
  });
}, observerOptions);

// Observe all scroll-reveal elements
$(".scroll-reveal").forEach((el) => {
  scrollObserver.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const current = Math.floor(start + (target - start) * easeOutQuart);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(updateCounter);
}

// Start counter animations when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll("[data-counter]");
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-counter"));
        animateCounter(counter, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
});

// Observe stats section
const statsSection = document.querySelector(".py-16.bg-gradient-to-r");
if (statsSection) {
  statsObserver.observe(statsSection);
}

// Navbar background change on scroll
const navbar = document.querySelector("#navbar");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    navbar.classList.add("bg-white/98", "shadow-md");
    navbar.classList.remove("bg-white/95", "shadow-sm");
  } else {
    navbar.classList.add("bg-white/95", "shadow-sm");
    navbar.classList.remove("bg-white/98", "shadow-md");
  }

  // Hide/show navbar on scroll direction change (optional)
  if (currentScrollY > lastScrollY && currentScrollY > 200) {
    navbar.style.transform = "translateY(-100%)";
  } else {
    navbar.style.transform = "translateY(0)";
  }

  lastScrollY = currentScrollY;
});

async function loadPrompts() {
  try {
    const res = await fetch("assets/prompts.json");
    const data = await res.json();
    displayPrompts(data);
  } catch (error) {
    console.error("Error loading prompts:", error);
  }
}

function displayPrompts(prompts) {
  const grid = document.getElementById("promptsGrid");
  grid.innerHTML = ""; // Clear existing cards if any

  prompts?.forEach((prompt) => {
    const card = document.createElement("div");
    card.classList.add(
      "bg-gray-50",
      "rounded-2xl",
      "shadow-lg",
      "overflow-hidden",
      "card-hover",
      "prompt-card",
      "scroll-reveal"
    );
    card.setAttribute("data-category", prompt.category);

    card.innerHTML = `
    <div class="image-overlay">
        <img src="${prompt.image}" alt="${prompt.title}" class="w-full  object-cover loading-placeholder">
    </div>
    <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-3">${prompt.title}</h3>

        <!-- Styled prompt block visible to user, truncated -->
        <div class="prompt-block bg-gray-100 rounded-lg p-4 mb-4 text-gray-800 font-mono truncated">
            ${prompt.description}
        </div>

        <!-- Hidden full prompt for copying -->
        <div class="prompt-code" style="display: none;">
            <code>"${prompt.description}"</code>
        </div>

        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-1">
                    <i class="fas fa-heart text-red-500"></i>
                    <span class="text-sm text-gray-600">234</span>
                </div>
                <div class="flex items-center space-x-1">
                    <i class="fas fa-download text-blue-500"></i>
                    <span class="text-sm text-gray-600">89</span>
                </div>
            </div>
            <button class="copy-btn text-indigo-600 hover:text-indigo-800 font-semibold transition-colors focus-visible">
                <i class="fas fa-copy mr-1"></i>
                Copy Prompt
            </button>
        </div>
    </div>
`;

    grid.appendChild(card);
  });
}

// Call loadPrompts when the page loads
window.addEventListener("DOMContentLoaded", loadPrompts);

// Initial display
displayPrompts();



// Image lazy loading with fade-in effect
const images = document.querySelectorAll("img");
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.addEventListener("load", function () {
        this.style.opacity = "1";
        this.classList.remove("loading-placeholder");
      });
      imageObserver.unobserve(img);
    }
  });
});

images.forEach((img) => {
  img.style.transition = "opacity 0.5s ease";
  imageObserver.observe(img);
});

// Newsletter form submission
const newsletterForm = document.querySelector(".max-w-md .flex");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    const button = this.querySelector("button");
    const originalText = button.textContent;

    if (email && validateEmail(email)) {
      button.textContent = "Subscribed!";
      button.classList.add("bg-green-500");

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("bg-green-500");
        this.querySelector('input[type="email"]').value = "";
      }, 3000);
    }
  });
}

// Email validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Initialize animations on page load
document.addEventListener("DOMContentLoaded", function () {
  // Add initial reveal classes after a short delay
  setTimeout(() => {
    const heroElements = document.querySelectorAll("#home .scroll-reveal");
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("revealed");
      }, index * 200);
    });
  }, 300);
});

// Keyboard navigation support
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    // Close mobile menu if open
    if (!mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
      mobileMenuBtn.querySelector("i").className = "fas fa-bars text-xl";
    }
  }
});

// Performance optimization: Debounce resize events
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Handle responsive layout adjustments if needed
    console.log("Window resized");
  }, 150);
});
