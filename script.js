(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var skills = document.querySelectorAll(".skill");
  var skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var skill = entry.target;
          var fill = skill.querySelector(".skill-fill");
          var val = skill.getAttribute("data-val");
          if (fill) {
            fill.style.width = val + "%";
          }
          skillObserver.unobserve(skill);
        }
      });
    },
    { threshold: 0.2 }
  );

  skills.forEach(function (skill) {
    skillObserver.observe(skill);
  });

  var navItems = document.querySelectorAll(".nav-item");
  var sections = document.querySelectorAll(".card");

  function setActive(id) {
    navItems.forEach(function (link) {
      if (link.getAttribute("href") === "#" + id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  navItems.forEach(function (link) {
    link.addEventListener("click", function () {
      var id = link.getAttribute("href").slice(1);
      setActive(id);
    });
  });

  var spyObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "-20% 0px -60% 0px"
    }
  );

  sections.forEach(function (section) {
    spyObserver.observe(section);
  });

  var copyBtn = document.getElementById("copyDiscord");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var text = copyBtn.getAttribute("data-copy");
      navigator.clipboard
        .writeText(text)
        .then(function () {
          copyBtn.classList.add("copied");
          copyBtn.textContent = "Copied";
          setTimeout(function () {
            copyBtn.classList.remove("copied");
            copyBtn.textContent = "Copy";
          }, 2000);
        })
        .catch(function () {
          copyBtn.textContent = "Failed";
          setTimeout(function () {
            copyBtn.textContent = "Copy";
          }, 2000);
        });
    });
  }
})();