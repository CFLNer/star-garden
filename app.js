const STORAGE_KEY = "star-garden-v1";
const PARENT_PIN = "1234";

const AVATARS = [
  {
    value: "🦁",
    label: "Lion",
    type: "emoji",
    emoji: "🦁"
  },
  {
    value: "🐼",
    label: "Panda",
    type: "emoji",
    emoji: "🐼"
  },
  {
    value: "🐯",
    label: "Tiger",
    type: "emoji",
    emoji: "🐯"
  },
  {
    value: "🐸",
    label: "Frog",
    type: "emoji",
    emoji: "🐸"
  },
  {
    value: "🐵",
    label: "Monkey",
    type: "emoji",
    emoji: "🐵"
  },
  {
    value: "🦊",
    label: "Fox",
    type: "emoji",
    emoji: "🦊"
  }
];

const DEFAULT_STATE = {
  child: {
    id: "child-1",
    name: "Little Star",
    avatar: "🦁",
    currentStars: 10,
    activeRewardId: "reward-sleep"
  },
  rewards: [
    {
      id: "reward-sleep",
      label: "Parents accompany to sleep",
      cost: 5,
      icon: "🌙",
      active: true,
      redeemedAt: null
    },
    {
      id: "reward-playground",
      label: "Playground trip",
      cost: 5,
      icon: "🛝",
      active: true,
      redeemedAt: null
    },
    {
      id: "reward-snack",
      label: "Special snack",
      cost: 5,
      icon: "🍓",
      active: true,
      redeemedAt: null
    },
    {
      id: "reward-playtime",
      label: "Extra 10 minutes playtime",
      cost: 10,
      icon: "🧸",
      active: true,
      redeemedAt: null
    }
  ],
  activityPresets: [
    {
      id: "meal",
      label: "Eat a meal well",
      defaultStarChange: 2,
      icon: "🍽️",
      category: "earning",
      visibleToKid: true
    },
    {
      id: "dressed",
      label: "Got dressed by self",
      defaultStarChange: 2,
      icon: "👕",
      category: "earning",
      visibleToKid: true
    },
    {
      id: "cleanup",
      label: "Cleaned up toys",
      defaultStarChange: 2,
      icon: "🧺",
      category: "earning",
      visibleToKid: true
    },
    {
      id: "potty",
      label: "Potty accident",
      defaultStarChange: -1,
      icon: "🚽",
      category: "correction",
      visibleToKid: true
    },
    {
      id: "bad-words",
      label: "Used bad words",
      defaultStarChange: -1,
      icon: "💬",
      category: "correction",
      visibleToKid: true
    },
    {
      id: "reminders",
      label: "Needed many reminders",
      defaultStarChange: -1,
      icon: "🔔",
      category: "correction",
      visibleToKid: true
    },
    {
      id: "unsafe",
      label: "Unsafe behavior",
      defaultStarChange: -3,
      icon: "✋",
      category: "correction",
      visibleToKid: true
    }
  ],
  events: [
    {
      id: "event-start",
      timestamp: new Date().toISOString(),
      label: "Starting stars",
      starChange: 10,
      category: "adjustment",
      note: "Initial Star Garden balance.",
      visibleToKid: false
    }
  ]
};

let state = loadState();
let parentUnlocked = false;
let celebrationTimeout = null;
let toastTimeout = null;

const dom = {
  appToast: document.querySelector("#appToast"),
  kidView: document.querySelector("#kidView"),
  parentView: document.querySelector("#parentView"),
  tabButtons: document.querySelectorAll(".tab-button"),
  brandButton: document.querySelector(".brand-button"),
  kidAvatar: document.querySelector("#kidAvatar"),
  kidName: document.querySelector("#kidName"),
  kidStars: document.querySelector("#kidStars"),
  rewardLine: document.querySelector("#rewardLine"),
  progressText: document.querySelector("#progressText"),
  progressPercent: document.querySelector("#progressPercent"),
  progressFill: document.querySelector("#progressFill"),
  gardenPlot: document.querySelector("#gardenPlot"),
  celebration: document.querySelector("#celebration"),
  kidRewardList: document.querySelector("#kidRewardList"),
  kidTodayList: document.querySelector("#kidTodayList"),
  pinGate: document.querySelector("#pinGate"),
  parentTools: document.querySelector("#parentTools"),
  pinForm: document.querySelector("#pinForm"),
  pinInput: document.querySelector("#pinInput"),
  pinError: document.querySelector("#pinError"),
  lockParentButton: document.querySelector("#lockParentButton"),
  profileForm: document.querySelector("#profileForm"),
  childNameInput: document.querySelector("#childNameInput"),
  avatarChoices: document.querySelector("#avatarChoices"),
  parentBalance: document.querySelector("#parentBalance"),
  earningActions: document.querySelector("#earningActions"),
  correctionActions: document.querySelector("#correctionActions"),
  customEventForm: document.querySelector("#customEventForm"),
  eventLabelInput: document.querySelector("#eventLabelInput"),
  eventStarsInput: document.querySelector("#eventStarsInput"),
  eventCategoryInput: document.querySelector("#eventCategoryInput"),
  eventNoteInput: document.querySelector("#eventNoteInput"),
  eventVisibleInput: document.querySelector("#eventVisibleInput"),
  activeRewardBadge: document.querySelector("#activeRewardBadge"),
  rewardForm: document.querySelector("#rewardForm"),
  rewardIdInput: document.querySelector("#rewardIdInput"),
  rewardLabelInput: document.querySelector("#rewardLabelInput"),
  rewardCostInput: document.querySelector("#rewardCostInput"),
  rewardIconInput: document.querySelector("#rewardIconInput"),
  cancelRewardEditButton: document.querySelector("#cancelRewardEditButton"),
  rewardList: document.querySelector("#rewardList"),
  historyList: document.querySelector("#historyList"),
  resetDataButton: document.querySelector("#resetDataButton")
};

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadState() {
  const fallback = cloneDefaultState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return fallback;
    }

    const parsed = JSON.parse(saved);
    return normalizeState({
      ...fallback,
      ...parsed,
      child: {
        ...fallback.child,
        ...(parsed.child || {})
      },
      rewards: Array.isArray(parsed.rewards) ? parsed.rewards : fallback.rewards,
      activityPresets: Array.isArray(parsed.activityPresets) ? parsed.activityPresets : fallback.activityPresets,
      events: Array.isArray(parsed.events) ? parsed.events : fallback.events
    });
  } catch (error) {
    console.warn("Could not load Star Garden state. Starting fresh.", error);
    return fallback;
  }
}

function normalizeState(savedState) {
  const defaultPresetsById = new Map(
    DEFAULT_STATE.activityPresets.map((preset) => [preset.id, preset])
  );

  return {
    ...savedState,
    activityPresets: savedState.activityPresets.map((preset) => {
      const defaultPreset = defaultPresetsById.get(preset.id);
      if (!defaultPreset) {
        return preset;
      }

      return {
        ...defaultPreset,
        ...preset,
        visibleToKid: defaultPreset.visibleToKid
      };
    })
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clampStars(value) {
  return Math.max(0, Math.round(Number(value) || 0));
}

function getActiveReward() {
  return state.rewards.find((reward) => reward.id === state.child.activeRewardId && reward.active) ||
    state.rewards.find((reward) => reward.active) ||
    null;
}

function setView(viewName) {
  const showParent = viewName === "parent";

  dom.kidView.classList.toggle("is-active", !showParent);
  dom.parentView.classList.toggle("is-active", showParent);
  dom.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });

  if (showParent && !parentUnlocked) {
    setTimeout(() => dom.pinInput.focus(), 50);
  }
}

function addEvent({ label, starChange, category, note = "", visibleToKid = true, icon = "⭐", feedbackMessage = null }) {
  const change = Math.round(Number(starChange) || 0);
  const previousStars = state.child.currentStars;

  state.child.currentStars = clampStars(previousStars + change);
  state.events.unshift({
    id: createId("event"),
    timestamp: new Date().toISOString(),
    label: label.trim(),
    starChange: change,
    category,
    note: note.trim(),
    visibleToKid,
    icon
  });

  saveState();
  render();

  if (change > 0) {
    showCelebration(`${icon} Great job! +${change} stars`);
  }

  if (feedbackMessage !== false) {
    const toastType = change < 0 && category !== "reward" ? "warning" : "success";
    showToast(feedbackMessage || `Added: ${label.trim()} (${formatDelta(change)})`, toastType);
  }

  return true;
}

function redeemReward(rewardId) {
  const reward = state.rewards.find((item) => item.id === rewardId);
  if (!reward || state.child.currentStars < reward.cost) {
    const neededStars = reward ? reward.cost - state.child.currentStars : 0;
    showToast(neededStars > 0 ? `Need ${neededStars} more stars` : "Reward is not available", "warning");
    return false;
  }

  reward.redeemedAt = new Date().toISOString();
  addEvent({
    label: `Redeemed: ${reward.label}`,
    starChange: -reward.cost,
    category: "reward",
    note: "Reward redeemed.",
    visibleToKid: true,
    icon: reward.icon,
    feedbackMessage: `Redeemed ${reward.label}`
  });
  showCelebration(`${reward.icon} Reward time!`);
  return true;
}

function showCelebration(message) {
  clearTimeout(celebrationTimeout);
  dom.celebration.textContent = message;
  dom.celebration.classList.add("is-visible");
  celebrationTimeout = setTimeout(() => {
    dom.celebration.textContent = "";
    dom.celebration.classList.remove("is-visible");
  }, 2800);
}

function showToast(message, type = "success") {
  clearTimeout(toastTimeout);
  dom.appToast.textContent = message;
  dom.appToast.className = `app-toast is-visible is-${type}`;
  toastTimeout = setTimeout(() => {
    dom.appToast.textContent = "";
    dom.appToast.className = "app-toast";
  }, 2200);
}

function pulseElement(element) {
  if (!element || element.disabled) {
    return;
  }

  element.classList.remove("is-feedback");
  void element.offsetWidth;
  element.classList.add("is-feedback");
  setTimeout(() => {
    element.classList.remove("is-feedback");
  }, 220);
}

function render() {
  renderKidView();
  renderParentGate();
  renderAvatarChoices();
  renderQuickActions();
  renderRewards();
  renderHistory();
}

function renderKidView() {
  const activeReward = getActiveReward();
  const currentStars = state.child.currentStars;
  const rewardCost = activeReward ? activeReward.cost : 1;
  const progress = activeReward ? Math.min(currentStars / rewardCost, 1) : 0;
  const progressPercent = Math.round(progress * 100);

  renderKidAvatar();
  dom.kidName.textContent = state.child.name;
  dom.kidStars.textContent = currentStars;
  dom.rewardLine.textContent = activeReward
    ? `${activeReward.icon} ${activeReward.label} needs ${activeReward.cost} stars`
    : "Pick a reward with a parent";
  dom.progressText.textContent = activeReward
    ? `${Math.min(currentStars, rewardCost)} of ${rewardCost} stars`
    : "No active reward";
  dom.progressPercent.textContent = `${progressPercent}%`;
  dom.progressFill.style.width = `${progressPercent}%`;

  renderGarden(progressPercent);
  renderKidRewards();
  renderKidToday();
}

function renderGarden(progressPercent) {
  const grownCells = Math.ceil(progressPercent / 10);
  dom.gardenPlot.replaceChildren();

  for (let index = 1; index <= 10; index += 1) {
    const cell = document.createElement("div");
    cell.className = `garden-cell${index <= grownCells ? " is-grown" : ""}`;
    cell.textContent = index <= grownCells ? "⭐" : "🌱";
    dom.gardenPlot.appendChild(cell);
  }
}

function renderKidToday() {
  const todayKey = new Date().toDateString();
  const visibleEvents = state.events
    .filter((event) => event.visibleToKid && event.starChange !== 0)
    .filter((event) => new Date(event.timestamp).toDateString() === todayKey)
    .slice(0, 5);

  dom.kidTodayList.replaceChildren();

  if (!visibleEvents.length) {
    dom.kidTodayList.appendChild(emptyState("Ready for a bright day."));
    return;
  }

  visibleEvents.forEach((event) => {
    const item = document.createElement("div");
    const isNegative = event.starChange < 0;
    item.className = `today-item${isNegative ? " is-negative" : ""}`;
    item.innerHTML = `
      <span class="today-icon" aria-hidden="true">${event.icon || "⭐"}</span>
      <span class="today-reason">${escapeHtml(kidReasonLabel(event))}</span>
      <span class="today-delta${isNegative ? " is-negative" : ""}">${formatDelta(event.starChange)} ${Math.abs(event.starChange) === 1 ? "star" : "stars"}</span>
    `;
    dom.kidTodayList.appendChild(item);
  });
}

function kidReasonLabel(event) {
  if (event.category === "reward" && event.label.startsWith("Redeemed:")) {
    return `Reward used: ${event.label.replace("Redeemed:", "").trim()}`;
  }

  return event.label;
}

function renderKidRewards() {
  const activeRewards = state.rewards.filter((reward) => reward.active);
  dom.kidRewardList.replaceChildren();

  if (!activeRewards.length) {
    dom.kidRewardList.appendChild(emptyState("Ask a parent to add a reward."));
    return;
  }

  activeRewards.forEach((reward) => {
    const remainingStars = Math.max(reward.cost - state.child.currentStars, 0);
    const canRedeem = remainingStars === 0;
    const card = document.createElement("article");
    card.className = `kid-reward-card${canRedeem ? " is-ready" : ""}`;
    card.innerHTML = `
      <div class="kid-reward-icon" aria-hidden="true">${reward.icon}</div>
      <div class="kid-reward-copy">
        <strong>${escapeHtml(reward.label)}</strong>
        <span>${reward.cost} ${reward.cost === 1 ? "star" : "stars"}</span>
      </div>
      <button class="kid-redeem-button" type="button" data-action="kid-redeem" ${canRedeem ? "" : "disabled"}>
        ${canRedeem ? "Redeem" : `Need ${remainingStars} more`}
      </button>
    `;

    card.querySelector('[data-action="kid-redeem"]').addEventListener("click", () => redeemReward(reward.id));
    dom.kidRewardList.appendChild(card);
  });
}

function getAvatarOption(value) {
  return AVATARS.find((avatar) => avatar.value === value) ||
    AVATARS.find((avatar) => avatar.value === "🦁");
}

function renderKidAvatar() {
  const avatar = getAvatarOption(state.child.avatar);

  dom.kidAvatar.replaceChildren();
  dom.kidAvatar.classList.toggle("has-photo", avatar.type === "image");

  if (avatar.type === "image") {
    const image = document.createElement("img");
    image.src = avatar.src;
    image.alt = "";
    dom.kidAvatar.appendChild(image);
    return;
  }

  dom.kidAvatar.textContent = avatar.emoji;
}

function renderParentGate() {
  dom.pinGate.hidden = parentUnlocked;
  dom.parentTools.hidden = !parentUnlocked;
  dom.childNameInput.value = state.child.name;
  dom.parentBalance.textContent = `${state.child.currentStars} stars`;
}

function renderAvatarChoices() {
  dom.avatarChoices.replaceChildren();

  AVATARS.forEach((avatar) => {
    const button = document.createElement("button");
    button.className = `avatar-choice${avatar.value === state.child.avatar ? " is-selected" : ""}`;
    button.type = "button";
    button.setAttribute("aria-label", `Choose ${avatar.label} avatar`);

    if (avatar.type === "image") {
      button.classList.add("is-photo");
      const image = document.createElement("img");
      image.src = avatar.src;
      image.alt = "";
      button.appendChild(image);
    } else {
      const emoji = document.createElement("span");
      emoji.className = "avatar-choice-emoji";
      emoji.textContent = avatar.emoji;
      button.appendChild(emoji);
    }

    const label = document.createElement("span");
    label.className = "avatar-choice-label";
    label.textContent = avatar.label;
    button.appendChild(label);

    button.addEventListener("click", () => {
      state.child.avatar = avatar.value;
      saveState();
      render();
      showToast("Avatar updated");
    });
    dom.avatarChoices.appendChild(button);
  });
}

function renderQuickActions() {
  const earning = state.activityPresets.filter((preset) => preset.category === "earning");
  const corrections = state.activityPresets.filter((preset) => preset.category === "correction");

  renderActionGroup(dom.earningActions, earning);
  renderActionGroup(dom.correctionActions, corrections);
}

function renderActionGroup(container, presets) {
  container.replaceChildren();

  presets.forEach((preset) => {
    const button = document.createElement("button");
    button.className = `action-button${preset.defaultStarChange < 0 ? " is-correction" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="action-icon" aria-hidden="true">${preset.icon}</span>
      <span>
        <strong>${escapeHtml(preset.label)}</strong>
        <span>${formatDelta(preset.defaultStarChange)} stars</span>
      </span>
    `;
    button.addEventListener("click", () => {
      addEvent({
        label: preset.label,
        starChange: preset.defaultStarChange,
        category: preset.category,
        visibleToKid: preset.visibleToKid,
        icon: preset.icon,
        feedbackMessage: `Added: ${preset.label} (${formatDelta(preset.defaultStarChange)})`
      });
    });
    container.appendChild(button);
  });
}

function renderRewards() {
  const activeReward = getActiveReward();
  dom.activeRewardBadge.textContent = activeReward
    ? `${activeReward.icon} ${activeReward.cost} stars`
    : "No active reward";

  dom.rewardList.replaceChildren();
  const activeRewards = state.rewards.filter((reward) => reward.active);

  if (!activeRewards.length) {
    dom.rewardList.appendChild(emptyState("Add a reward to start."));
    return;
  }

  activeRewards.forEach((reward) => {
    const canRedeem = state.child.currentStars >= reward.cost;
    const item = document.createElement("article");
    item.className = "reward-item";
    item.innerHTML = `
      <div class="reward-main">
        <div class="reward-name">
          <span class="reward-icon" aria-hidden="true">${reward.icon}</span>
          <span>
            <strong>${escapeHtml(reward.label)}</strong>
            <span class="reward-meta">${reward.cost} stars${reward.redeemedAt ? ` · last redeemed ${formatDate(reward.redeemedAt)}` : ""}</span>
          </span>
        </div>
      </div>
      <div class="reward-actions">
        <button class="small-button primary-small" type="button" data-action="redeem" ${canRedeem ? "" : "disabled"}>Redeem</button>
        <button class="small-button" type="button" data-action="target">Target</button>
        <button class="small-button" type="button" data-action="edit">Edit</button>
      </div>
    `;

    item.querySelector('[data-action="redeem"]').addEventListener("click", () => redeemReward(reward.id));
    item.querySelector('[data-action="target"]').addEventListener("click", () => {
      state.child.activeRewardId = reward.id;
      saveState();
      render();
      showToast("Reward target updated");
    });
    item.querySelector('[data-action="edit"]').addEventListener("click", () => startRewardEdit(reward));

    dom.rewardList.appendChild(item);
  });
}

function startRewardEdit(reward) {
  dom.rewardIdInput.value = reward.id;
  dom.rewardLabelInput.value = reward.label;
  dom.rewardCostInput.value = reward.cost;
  dom.rewardIconInput.value = reward.icon;
  dom.cancelRewardEditButton.hidden = false;
  dom.rewardLabelInput.focus();
}

function clearRewardForm() {
  dom.rewardIdInput.value = "";
  dom.rewardLabelInput.value = "";
  dom.rewardCostInput.value = "5";
  dom.rewardIconInput.value = "⭐";
  dom.cancelRewardEditButton.hidden = true;
}

function renderHistory() {
  dom.historyList.replaceChildren();

  if (!state.events.length) {
    dom.historyList.appendChild(emptyState("No events yet."));
    return;
  }

  state.events.slice(0, 60).forEach((event) => {
    const item = document.createElement("article");
    item.className = "history-item";
    const deltaClass = event.starChange < 0 ? " is-negative" : "";
    const kidVisibility = event.visibleToKid ? "kid-visible" : "parent-only";

    item.innerHTML = `
      <div class="history-main">
        <div>
          <strong>${escapeHtml(event.label)}</strong>
          <span class="history-meta">${formatDate(event.timestamp)} · ${escapeHtml(event.category)} · ${kidVisibility}</span>
        </div>
        <span class="history-delta${deltaClass}">${formatDelta(event.starChange)}</span>
      </div>
      ${event.note ? `<p class="history-note">${escapeHtml(event.note)}</p>` : ""}
    `;
    dom.historyList.appendChild(item);
  });
}

function emptyState(message) {
  const element = document.createElement("div");
  element.className = "empty-state";
  element.textContent = message;
  return element;
}

function formatDelta(value) {
  const number = Math.round(Number(value) || 0);
  return number > 0 ? `+${number}` : String(number);
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function wireEvents() {
  dom.tabButtons.forEach((button) => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  dom.brandButton.addEventListener("click", () => setView("kid"));

  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) {
      pulseElement(button);
    }
  });

  dom.pinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (dom.pinInput.value === PARENT_PIN) {
      parentUnlocked = true;
      dom.pinInput.value = "";
      dom.pinError.textContent = "";
      render();
      showToast("Parent tools unlocked");
      return;
    }

    dom.pinError.textContent = "PIN did not match.";
    showToast("PIN did not match", "warning");
  });

  dom.lockParentButton.addEventListener("click", () => {
    parentUnlocked = false;
    render();
    showToast("Parent tools locked");
  });

  dom.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = dom.childNameInput.value.trim();
    state.child.name = name || "Little Star";
    saveState();
    render();
    showToast("Profile updated");
  });

  dom.customEventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = dom.eventLabelInput.value.trim();
    const starChange = Number(dom.eventStarsInput.value);

    if (!label || !Number.isFinite(starChange)) {
      return;
    }

    addEvent({
      label,
      starChange,
      category: dom.eventCategoryInput.value,
      note: dom.eventNoteInput.value,
      visibleToKid: dom.eventVisibleInput.checked,
      icon: starChange >= 0 ? "⭐" : "🌧️",
      feedbackMessage: "Custom event added"
    });

    dom.eventLabelInput.value = "";
    dom.eventStarsInput.value = "1";
    dom.eventCategoryInput.value = "earning";
    dom.eventNoteInput.value = "";
    dom.eventVisibleInput.checked = true;
  });

  dom.rewardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const label = dom.rewardLabelInput.value.trim();
    const cost = clampStars(dom.rewardCostInput.value);
    const icon = dom.rewardIconInput.value;

    if (!label || cost < 1) {
      return;
    }

    const rewardId = dom.rewardIdInput.value;
    const existingReward = state.rewards.find((reward) => reward.id === rewardId);

    if (existingReward) {
      existingReward.label = label;
      existingReward.cost = cost;
      existingReward.icon = icon;
    } else {
      const reward = {
        id: createId("reward"),
        label,
        cost,
        icon,
        active: true,
        redeemedAt: null
      };
      state.rewards.push(reward);
      state.child.activeRewardId = reward.id;
    }

    clearRewardForm();
    saveState();
    render();
    showToast("Reward saved");
  });

  dom.cancelRewardEditButton.addEventListener("click", clearRewardForm);

  dom.resetDataButton.addEventListener("click", () => {
    const confirmed = window.confirm("Reset Star Garden on this device?");
    if (!confirmed) {
      return;
    }

    state = cloneDefaultState();
    parentUnlocked = false;
    saveState();
    render();
    setView("kid");
    showToast("Star Garden reset");
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("service-worker.js").catch((error) => {
    console.info("Service worker registration skipped.", error);
  });
}

wireEvents();
render();
registerServiceWorker();
