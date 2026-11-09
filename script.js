const revealButton = document.querySelector("#reveal-button");
const magicButton = document.querySelector("#magic-button");
const wishSection = document.querySelector("#wish");
const confetti = document.querySelector("#confetti");
const toast = document.querySelector("#toast");
const tapNote = document.querySelector("#tap-note");
const welcomeScreen = document.querySelector("#welcome-screen");
const enterButton = document.querySelector("#enter-button");
const complimentButton = document.querySelector("#compliment-button");
const factOutput = document.querySelector("#fact-output");
const storyModal = document.querySelector("#story-modal");
const modalBackdrop = document.querySelector("#modal-backdrop");
const modalClose = document.querySelector("#modal-close");
const modalPhoto = document.querySelector("#modal-photo");
const modalPhotoFrame = document.querySelector("#modal-photo-frame");
const modalTitle = document.querySelector("#modal-title");
const audioCountdown = document.querySelector("#audio-countdown");
const modalPhotoLabel = document.querySelector("#modal-photo-label");
const modalCounter = document.querySelector("#modal-counter");
const modalProgress = document.querySelector("#modal-progress");
const modalMusicButton = document.querySelector("#modal-music-button");
const modalMusicIcon = document.querySelector("#modal-music-icon");
let carouselTimer;
let photosRevealed = false;
const photoCards = [...document.querySelectorAll(".photo-card")];
const dots = [...document.querySelectorAll(".dot")];
const slideCount = document.querySelector("#slide-count");
const audio = document.querySelector("#birthday-audio");
const musicPlayer = document.querySelector("#music-player");
const musicToggle = document.querySelector("#music-toggle");
let currentPhoto = 0;

enterButton.addEventListener("click", () => {
  welcomeScreen.classList.add("is-dismissed");
  document.body.classList.remove("is-locked");
  window.setTimeout(() => welcomeScreen.remove(), 800);
});

document.body.classList.add("is-locked");

const facts = [
  "Dino is 73% sparkle, 18% snack break, and 9% completely unplanned decisions.",
  "Scientists have confirmed: every group chat is better with Dino in it.",
  "Dino has reached a rare level of fabulousness previously thought impossible.",
  "Today’s forecast: 100% chance of being celebrated and 0% chance of acting your age."
];
let factIndex = 0;
complimentButton.addEventListener("click", () => {
  factOutput.textContent = facts[factIndex];
  factIndex = (factIndex + 1) % facts.length;
});

function showPhoto(index) {
  currentPhoto = (index + photoCards.length) % photoCards.length;
  photoCards.forEach((card, cardIndex) => card.classList.toggle("is-active", cardIndex === currentPhoto));
  dots.forEach((dot, dotIndex) => dot.classList.toggle("is-active", dotIndex === currentPhoto));
  slideCount.textContent = `0${currentPhoto + 1} / 0${photoCards.length}`;
}

document.querySelector("#previous-photo").addEventListener("click", () => showPhoto(currentPhoto - 1));
document.querySelector("#next-photo").addEventListener("click", () => showPhoto(currentPhoto + 1));
dots.forEach((dot, index) => dot.addEventListener("click", () => showPhoto(index)));

let touchStartX = 0;
const photoTrack = document.querySelector("#photo-track");
photoTrack.addEventListener("touchstart", (event) => { touchStartX = event.changedTouches[0].screenX; }, { passive: true });
photoTrack.addEventListener("touchend", (event) => {
  const distance = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(distance) > 35) showPhoto(currentPhoto + (distance < 0 ? 1 : -1));
}, { passive: true });

const storySlides = [
  { src: "images/person-1.jpg", alt: "Dino smiling", label: "the birthday legend" },
  { src: "images/person-2.jpg", alt: "Dino being fabulous", label: "zero thoughts, just vibes" },
  { src: "images/person-3.jpg", alt: "Dino having fun", label: "still iconic somehow" }
];

function updateModalSlide(index) {
  const slide = storySlides[index % storySlides.length];
  modalPhoto.style.opacity = "0";
  window.setTimeout(() => {
    modalPhoto.src = slide.src;
    modalPhoto.alt = slide.alt;
    modalPhotoLabel.textContent = slide.label;
    modalCounter.textContent = `0${(index % storySlides.length) + 1} / 0${storySlides.length}`;
    modalProgress.style.width = `${((index % storySlides.length) + 1) / storySlides.length * 100}%`;
    modalPhoto.style.opacity = "1";
  }, 180);
}

function startAutoCarousel() {
  let slideIndex = 0;
  updateModalSlide(slideIndex);
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    slideIndex = (slideIndex + 1) % storySlides.length;
    updateModalSlide(slideIndex);
  }, 2800);
}

function revealMemoryCarousel() {
  if (photosRevealed) return;
  photosRevealed = true;
  modalPhotoFrame.classList.remove("is-hidden");
  audioCountdown.classList.add("is-complete");
  modalTitle.innerHTML = "Press play.<br /><em>Watch the memories.</em>";
  startAutoCarousel();
}

function openStoryModal() {
  storyModal.classList.add("is-open");
  storyModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-locked");
  photosRevealed = false;
  modalPhotoFrame.classList.add("is-hidden");
  audioCountdown.classList.remove("is-complete");
  modalTitle.innerHTML = "A little surprise<br /><em>is loading...</em>";
  modalProgress.style.width = "0";
  audio.currentTime = 0;
  musicPlayer.classList.add("visible");
  audio.play().then(() => {
    musicPlayer.classList.add("playing");
    musicToggle.textContent = "Ⅱ";
  }).catch(() => {
    modalMusicButton.focus();
  });
}

function closeStoryModal() {
  storyModal.classList.remove("is-open");
  storyModal.setAttribute("aria-hidden", "true");
  window.clearInterval(carouselTimer);
  document.body.classList.remove("is-locked");
}

audio.addEventListener("timeupdate", () => {
  if (audio.currentTime >= 7) revealMemoryCarousel();
});

revealButton.addEventListener("click", openStoryModal);
modalClose.addEventListener("click", closeStoryModal);
modalBackdrop.addEventListener("click", closeStoryModal);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && storyModal.classList.contains("is-open")) closeStoryModal();
});

modalMusicButton.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    musicPlayer.classList.add("playing");
    modalMusicIcon.textContent = "Ⅱ";
  } else {
    audio.pause();
    musicPlayer.classList.remove("playing");
    modalMusicIcon.textContent = "▶";
  }
});

musicToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    musicPlayer.classList.add("playing");
    musicToggle.textContent = "Ⅱ";
  } else {
    audio.pause();
    musicPlayer.classList.remove("playing");
    musicToggle.textContent = "▶";
  }
});

magicButton.addEventListener("click", () => {
  const colors = ["#f79aca", "#9d7bff", "#ffe4a8", "#f7f3ff", "#6de3d0"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 90; index += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = colors[index % colors.length];
    piece.style.setProperty("--x", `${(Math.random() - 0.5) * 240}px`);
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    piece.style.transform = `rotate(${Math.random() * 180}deg)`;
    fragment.appendChild(piece);
  }

  confetti.replaceChildren(fragment);
  tapNote.textContent = "Wish received. The universe is already plotting.";
  tapNote.classList.add("show");
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 3200);
});
