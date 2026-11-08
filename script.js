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

  var visitCountEl = document.getElementById("visitCount");
  if (visitCountEl) {
    var NAMESPACE = "extrask-site";
    var KEY = "visits";
    var BASE_URL = "https://abacus.jasoncameron.dev";
    var STORE_KEY = "extrask_visitor_ip";
    var CACHE_KEY = "extrask_visit_cache";

    var renderCount = function (count) {
      if (typeof count === "number") {
        visitCountEl.textContent = count.toLocaleString();
        try {
          localStorage.setItem(CACHE_KEY, String(count));
        } catch (e) {}
      }
    };

    var fetchCount = function (endpoint) {
      return fetch(BASE_URL + endpoint)
        .then(function (res) {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then(function (data) {
          if (data && typeof data.value === "number") {
            return data.value;
          }
          if (data && typeof data.count === "number") {
            return data.count;
          }
          return null;
        });
    };

    var cached = null;
    try {
      var stored = localStorage.getItem(CACHE_KEY);
      if (stored !== null) {
        cached = parseInt(stored, 10);
      }
    } catch (e) {}

    if (cached !== null && !isNaN(cached)) {
      visitCountEl.textContent = cached.toLocaleString();
    }

    fetch("https://api.ipify.org?format=json")
      .then(function (res) {
        return res.json();
      })
      .then(function (ipData) {
        var currentIp = ipData.ip;
        var savedIp = null;
        try {
          savedIp = localStorage.getItem(STORE_KEY);
        } catch (e) {}

        if (savedIp === currentIp) {
          return fetchCount("/get/" + NAMESPACE + "/" + KEY);
        } else {
          try {
            localStorage.setItem(STORE_KEY, currentIp);
          } catch (e) {}
          return fetchCount("/hit/" + NAMESPACE + "/" + KEY);
        }
      })
      .then(function (count) {
        if (count !== null) {
          renderCount(count);
        } else if (visitCountEl.textContent === "...") {
          visitCountEl.textContent = "0";
        }
      })
      .catch(function () {
        fetchCount("/get/" + NAMESPACE + "/" + KEY)
          .then(function (count) {
            if (count !== null) {
              renderCount(count);
            } else if (visitCountEl.textContent === "...") {
              visitCountEl.textContent = "0";
            }
          })
          .catch(function () {
            if (visitCountEl.textContent === "...") {
              visitCountEl.textContent = "0";
            }
          });
      });
  }
})();
