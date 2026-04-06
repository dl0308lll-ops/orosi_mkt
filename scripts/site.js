const body = document.body;
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  const closeMenu = () => {
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (!body.classList.contains("nav-open")) {
      return;
    }

    if (siteNav.contains(event.target) || navToggle.contains(event.target)) {
      return;
    }

    closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("[data-nav-link]").forEach((link) => {
  const targetPage = new URL(link.href, window.location.href).pathname.split("/").pop() || "index.html";
  if (targetPage === currentPage) {
    link.classList.add("is-current");
  }
});

const demoForm = document.querySelector("[data-demo-form]");
const formMessage = document.querySelector(".form-message");

if (demoForm && formMessage) {
  demoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formMessage.textContent = "데모 폼까지 연결했습니다. 다음 단계에서 실제 문의 수집 채널만 붙이면 됩니다.";
    demoForm.reset();
  });
}
