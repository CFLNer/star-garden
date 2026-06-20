const STORAGE_KEY = "star-garden-v1";
const PARENT_PIN = "1234";
const SUPPORTED_LANGUAGES = ["en", "zh-CN"];

const TRANSLATIONS = {
  en: {
    appViews: "App views",
    showKidView: "Show kid view",
    brandSubtitle: "Growing one star at a time",
    kidTab: "Kid",
    parentTab: "Parent",
    languageLabel: "Display language",
    helloPrefix: "Hello",
    stars: "stars",
    star: "star",
    rewardProgress: "Reward progress",
    rewardsTitle: "Rewards",
    todayStarsTitle: "Today's Stars",
    parentToolsTitle: "Parent Tools",
    pinHelp: "This PIN is a simple child gate, not real security.",
    parentPinLabel: "Parent PIN",
    pinPlaceholder: "PIN",
    unlockButton: "Unlock",
    profileTitle: "Profile",
    lockButton: "Lock",
    childNameLabel: "Child name",
    saveButton: "Save",
    avatarLegend: "Avatar",
    quickActionsTitle: "Quick Actions",
    earnStarsTitle: "Earn Stars",
    correctionsTitle: "Gentle Corrections",
    customEventTitle: "Custom Event",
    eventLabelLabel: "Label",
    eventLabelPlaceholder: "Shared nicely",
    starChangeLabel: "Star change",
    categoryLabel: "Category",
    categoryEarning: "Earn stars",
    categoryCorrection: "Gentle correction",
    categoryAdjustment: "Balance adjustment",
    privateNoteLabel: "Private parent note",
    optionalPlaceholder: "Optional",
    showInKidView: "Show this in kid view",
    addEventButton: "Add Event",
    rewardLabel: "Reward",
    rewardPlaceholder: "Extra playtime",
    starsLabel: "Stars",
    iconLabel: "Icon",
    iconMoon: "Moon",
    iconPlayground: "Playground",
    iconSnack: "Snack",
    iconToy: "Toy",
    iconArt: "Art",
    iconStar: "Star",
    saveRewardButton: "Save Reward",
    cancelEditButton: "Cancel Edit",
    historyTitle: "History",
    resetButton: "Reset",
    noActiveReward: "No active reward",
    pickReward: "Pick a reward with a parent",
    progressCount: "{current} of {total} stars",
    rewardNeedsStars: "{icon} {label} needs {cost} stars",
    readyDay: "Ready for a bright day.",
    rewardUsed: "Reward used: {label}",
    askParentReward: "Ask a parent to add a reward.",
    rewardCost: "{count} {unit}",
    redeemButton: "Redeem",
    needMore: "Need {count} more",
    chooseAvatar: "Choose {label} avatar",
    balanceStars: "{count} stars",
    actionStars: "{delta} stars",
    activeRewardBadge: "{icon} {count} stars",
    addRewardEmpty: "Add a reward to start.",
    lastRedeemed: "last redeemed {date}",
    rewardMeta: "{count} stars{redeemed}",
    targetButton: "Target",
    editButton: "Edit",
    noEvents: "No events yet.",
    kidVisible: "kid-visible",
    parentOnly: "parent-only",
    historyMeta: "{date} · {category} · {visibility}",
    categoryLabelEarning: "earning",
    categoryLabelCorrection: "correction",
    categoryLabelAdjustment: "adjustment",
    categoryLabelReward: "reward",
    greatJob: "{icon} Great job! +{count} stars",
    eventAdded: "Added: {label} ({delta})",
    needMoreStarsToast: "Need {count} more stars",
    rewardUnavailable: "Reward is not available",
    redeemedToast: "Redeemed {label}",
    rewardTime: "{icon} Reward time!",
    avatarUpdated: "Avatar updated",
    rewardTargetUpdated: "Reward target updated",
    parentUnlocked: "Parent tools unlocked",
    parentLocked: "Parent tools locked",
    pinMismatch: "PIN did not match",
    pinMismatchPunctuated: "PIN did not match.",
    profileUpdated: "Profile updated",
    customEventAdded: "Custom event added",
    rewardSaved: "Reward saved",
    resetConfirm: "Reset Star Garden on this device?",
    starGardenReset: "Star Garden reset",
    dateLocale: "en"
  },
  "zh-CN": {
    appViews: "应用视图",
    showKidView: "显示孩子视图",
    brandSubtitle: "一颗一颗星星慢慢长大",
    kidTab: "孩子",
    parentTab: "家长",
    languageLabel: "显示语言",
    helloPrefix: "你好",
    stars: "颗星",
    star: "颗星",
    rewardProgress: "奖励进度",
    rewardsTitle: "奖励",
    todayStarsTitle: "今天的星星",
    parentToolsTitle: "家长工具",
    pinHelp: "这个 PIN 只是简单的儿童门槛，不是真正的安全保护。",
    parentPinLabel: "家长 PIN",
    pinPlaceholder: "PIN",
    unlockButton: "解锁",
    profileTitle: "资料",
    lockButton: "锁定",
    childNameLabel: "孩子名字",
    saveButton: "保存",
    avatarLegend: "头像",
    quickActionsTitle: "快捷操作",
    earnStarsTitle: "获得星星",
    correctionsTitle: "温和提醒",
    customEventTitle: "自定义事件",
    eventLabelLabel: "标签",
    eventLabelPlaceholder: "友好分享",
    starChangeLabel: "星星变化",
    categoryLabel: "类别",
    categoryEarning: "获得星星",
    categoryCorrection: "温和提醒",
    categoryAdjustment: "余额调整",
    privateNoteLabel: "家长私密备注",
    optionalPlaceholder: "可选",
    showInKidView: "在孩子视图中显示",
    addEventButton: "添加事件",
    rewardLabel: "奖励",
    rewardPlaceholder: "额外玩耍时间",
    starsLabel: "星星",
    iconLabel: "图标",
    iconMoon: "月亮",
    iconPlayground: "游乐场",
    iconSnack: "点心",
    iconToy: "玩具",
    iconArt: "画画",
    iconStar: "星星",
    saveRewardButton: "保存奖励",
    cancelEditButton: "取消编辑",
    historyTitle: "历史",
    resetButton: "重置",
    noActiveReward: "没有当前奖励",
    pickReward: "请家长选择一个奖励",
    progressCount: "{current} / {total} 颗星",
    rewardNeedsStars: "{icon} {label} 需要 {cost} 颗星",
    readyDay: "准备好迎接闪亮的一天。",
    rewardUsed: "已使用奖励：{label}",
    askParentReward: "请家长添加一个奖励。",
    rewardCost: "{count} 颗星",
    redeemButton: "兑换",
    needMore: "还差 {count} 颗",
    chooseAvatar: "选择{label}头像",
    balanceStars: "{count} 颗星",
    actionStars: "{delta} 颗星",
    activeRewardBadge: "{icon} {count} 颗星",
    addRewardEmpty: "添加一个奖励开始吧。",
    lastRedeemed: "上次兑换 {date}",
    rewardMeta: "{count} 颗星{redeemed}",
    targetButton: "设为目标",
    editButton: "编辑",
    noEvents: "还没有事件。",
    kidVisible: "孩子可见",
    parentOnly: "仅家长",
    historyMeta: "{date} · {category} · {visibility}",
    categoryLabelEarning: "获得",
    categoryLabelCorrection: "提醒",
    categoryLabelAdjustment: "调整",
    categoryLabelReward: "奖励",
    greatJob: "{icon} 真棒！+{count} 颗星",
    eventAdded: "已添加：{label}（{delta}）",
    needMoreStarsToast: "还需要 {count} 颗星",
    rewardUnavailable: "奖励不可用",
    redeemedToast: "已兑换 {label}",
    rewardTime: "{icon} 奖励时间！",
    avatarUpdated: "头像已更新",
    rewardTargetUpdated: "奖励目标已更新",
    parentUnlocked: "家长工具已解锁",
    parentLocked: "家长工具已锁定",
    pinMismatch: "PIN 不匹配",
    pinMismatchPunctuated: "PIN 不匹配。",
    profileUpdated: "资料已更新",
    customEventAdded: "自定义事件已添加",
    rewardSaved: "奖励已保存",
    resetConfirm: "要重置此设备上的 Star Garden 吗？",
    starGardenReset: "Star Garden 已重置",
    dateLocale: "zh-CN"
  }
};

const LABELS = {
  child: {
    "Little Star": {
      en: "Little Star",
      "zh-CN": "小星星"
    }
  },
  avatars: {
    Lion: { en: "Lion", "zh-CN": "狮子" },
    Panda: { en: "Panda", "zh-CN": "熊猫" },
    Tiger: { en: "Tiger", "zh-CN": "老虎" },
    Frog: { en: "Frog", "zh-CN": "青蛙" },
    Monkey: { en: "Monkey", "zh-CN": "猴子" },
    Fox: { en: "Fox", "zh-CN": "狐狸" }
  },
  rewards: {
    "reward-sleep": { en: "Parents accompany to sleep", "zh-CN": "爸爸妈妈陪睡" },
    "reward-playground": { en: "Playground trip", "zh-CN": "去游乐场" },
    "reward-snack": { en: "Special snack", "zh-CN": "特别点心" },
    "reward-playtime": { en: "Extra 10 minutes playtime", "zh-CN": "额外玩 10 分钟" }
  },
  presets: {
    meal: { en: "Eat a meal well", "zh-CN": "好好吃饭" },
    dressed: { en: "Got dressed by self", "zh-CN": "自己穿衣服" },
    cleanup: { en: "Cleaned up toys", "zh-CN": "收拾玩具" },
    potty: { en: "Potty accident", "zh-CN": "如厕小意外" },
    "bad-words": { en: "Used bad words", "zh-CN": "说了不好的话" },
    reminders: { en: "Needed many reminders", "zh-CN": "需要多次提醒" },
    unsafe: { en: "Unsafe behavior", "zh-CN": "不安全行为" }
  },
  events: {
    "event-start": { en: "Starting stars", "zh-CN": "初始星星" }
  },
  notes: {
    "Initial Star Garden balance.": { en: "Initial Star Garden balance.", "zh-CN": "Star Garden 初始余额。" }
  }
};

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
  ],
  settings: {
    language: "en"
  }
};

let state = loadState();
let parentUnlocked = false;
let celebrationTimeout = null;
let toastTimeout = null;

const dom = {
  appToast: document.querySelector("#appToast"),
  languageSelect: document.querySelector("#languageSelect"),
  translatableText: document.querySelectorAll("[data-i18n]"),
  translatablePlaceholders: document.querySelectorAll("[data-i18n-placeholder]"),
  translatableAriaLabels: document.querySelectorAll("[data-i18n-aria-label]"),
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
      events: Array.isArray(parsed.events) ? parsed.events : fallback.events,
      settings: {
        ...fallback.settings,
        ...(parsed.settings || {})
      }
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
    settings: {
      ...DEFAULT_STATE.settings,
      ...(savedState.settings || {}),
      language: SUPPORTED_LANGUAGES.includes(savedState.settings?.language)
        ? savedState.settings.language
        : DEFAULT_STATE.settings.language
    },
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

function currentLanguage() {
  return state.settings.language;
}

function t(key, replacements = {}) {
  const value = TRANSLATIONS[currentLanguage()][key] ?? TRANSLATIONS.en[key] ?? key;

  return Object.entries(replacements).reduce((message, [name, replacement]) => {
    return message.replaceAll(`{${name}}`, String(replacement));
  }, value);
}

function localizeLabel(group, key, fallback = "") {
  return LABELS[group]?.[key]?.[currentLanguage()] ?? fallback;
}

function displayChildName(name) {
  return LABELS.child[name]?.[currentLanguage()] ?? name;
}

function displayRewardLabel(reward) {
  const defaultReward = DEFAULT_STATE.rewards.find((item) => item.id === reward.id);
  if (!defaultReward || reward.label !== defaultReward.label) {
    return reward.label;
  }

  return localizeLabel("rewards", reward.id, reward.label);
}

function displayPresetLabel(preset) {
  return localizeLabel("presets", preset.id, preset.label);
}

function displayAvatarLabel(avatar) {
  return localizeLabel("avatars", avatar.label, avatar.label);
}

function displayCategory(category) {
  const key = `categoryLabel${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  return t(key);
}

function displayNote(note) {
  return LABELS.notes[note]?.[currentLanguage()] ?? note;
}

function starUnit(count) {
  return currentLanguage() === "en" && Math.abs(count) === 1 ? t("star") : t("stars");
}

function localizePageText() {
  document.documentElement.lang = currentLanguage();
  dom.languageSelect.value = currentLanguage();

  dom.translatableText.forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  dom.translatablePlaceholders.forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  dom.translatableAriaLabels.forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
  });
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

function addEvent({ label, starChange, category, note = "", visibleToKid = true, icon = "⭐", feedbackMessage = null, sourceId = null, rewardId = null }) {
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
    icon,
    sourceId,
    rewardId
  });

  saveState();
  render();

  if (change > 0) {
    showCelebration(t("greatJob", { icon, count: change }));
  }

  if (feedbackMessage !== false) {
    const toastType = change < 0 && category !== "reward" ? "warning" : "success";
    showToast(feedbackMessage || t("eventAdded", { label: label.trim(), delta: formatDelta(change) }), toastType);
  }

  return true;
}

function redeemReward(rewardId) {
  const reward = state.rewards.find((item) => item.id === rewardId);
  if (!reward || state.child.currentStars < reward.cost) {
    const neededStars = reward ? reward.cost - state.child.currentStars : 0;
    showToast(neededStars > 0 ? t("needMoreStarsToast", { count: neededStars }) : t("rewardUnavailable"), "warning");
    return false;
  }

  const rewardLabel = displayRewardLabel(reward);
  reward.redeemedAt = new Date().toISOString();
  addEvent({
    label: `Redeemed: ${reward.label}`,
    starChange: -reward.cost,
    category: "reward",
    note: "Reward redeemed.",
    visibleToKid: true,
    icon: reward.icon,
    feedbackMessage: t("redeemedToast", { label: rewardLabel }),
    rewardId: reward.id
  });
  showCelebration(t("rewardTime", { icon: reward.icon }));
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
  localizePageText();
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
  dom.kidName.textContent = displayChildName(state.child.name);
  dom.kidStars.textContent = currentStars;
  dom.rewardLine.textContent = activeReward
    ? t("rewardNeedsStars", {
      icon: activeReward.icon,
      label: displayRewardLabel(activeReward),
      cost: activeReward.cost
    })
    : t("pickReward");
  dom.progressText.textContent = activeReward
    ? t("progressCount", { current: Math.min(currentStars, rewardCost), total: rewardCost })
    : t("noActiveReward");
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
    dom.kidTodayList.appendChild(emptyState(t("readyDay")));
    return;
  }

  visibleEvents.forEach((event) => {
    const item = document.createElement("div");
    const isNegative = event.starChange < 0;
    item.className = `today-item${isNegative ? " is-negative" : ""}`;
    item.innerHTML = `
      <span class="today-icon" aria-hidden="true">${event.icon || "⭐"}</span>
      <span class="today-reason">${escapeHtml(kidReasonLabel(event))}</span>
      <span class="today-delta${isNegative ? " is-negative" : ""}">${formatDelta(event.starChange)} ${starUnit(event.starChange)}</span>
    `;
    dom.kidTodayList.appendChild(item);
  });
}

function kidReasonLabel(event) {
  if (event.category === "reward") {
    const reward = state.rewards.find((item) => item.id === event.rewardId);
    const fallbackLabel = event.label.startsWith("Redeemed:")
      ? event.label.replace("Redeemed:", "").trim()
      : event.label;
    const defaultReward = DEFAULT_STATE.rewards.find((item) => item.label === fallbackLabel);
    return t("rewardUsed", {
      label: reward ? displayRewardLabel(reward) : localizeLabel("rewards", defaultReward?.id, fallbackLabel)
    });
  }

  if (event.sourceId) {
    return localizeLabel("presets", event.sourceId, event.label);
  }

  const preset = DEFAULT_STATE.activityPresets.find((item) => item.label === event.label);
  if (preset) {
    return localizeLabel("presets", preset.id, event.label);
  }

  return localizeLabel("events", event.id, event.label);
}

function renderKidRewards() {
  const activeRewards = state.rewards.filter((reward) => reward.active);
  dom.kidRewardList.replaceChildren();

  if (!activeRewards.length) {
    dom.kidRewardList.appendChild(emptyState(t("askParentReward")));
    return;
  }

  activeRewards.forEach((reward) => {
    const remainingStars = Math.max(reward.cost - state.child.currentStars, 0);
    const canRedeem = remainingStars === 0;
    const rewardLabel = displayRewardLabel(reward);
    const card = document.createElement("article");
    card.className = `kid-reward-card${canRedeem ? " is-ready" : ""}`;
    card.innerHTML = `
      <div class="kid-reward-icon" aria-hidden="true">${reward.icon}</div>
      <div class="kid-reward-copy">
        <strong>${escapeHtml(rewardLabel)}</strong>
        <span>${t("rewardCost", { count: reward.cost, unit: starUnit(reward.cost) })}</span>
      </div>
      <button class="kid-redeem-button" type="button" data-action="kid-redeem" ${canRedeem ? "" : "disabled"}>
        ${canRedeem ? t("redeemButton") : t("needMore", { count: remainingStars })}
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
  dom.parentBalance.textContent = t("balanceStars", { count: state.child.currentStars });
}

function renderAvatarChoices() {
  dom.avatarChoices.replaceChildren();

  AVATARS.forEach((avatar) => {
    const button = document.createElement("button");
    button.className = `avatar-choice${avatar.value === state.child.avatar ? " is-selected" : ""}`;
    button.type = "button";
    const avatarLabel = displayAvatarLabel(avatar);
    button.setAttribute("aria-label", t("chooseAvatar", { label: avatarLabel }));

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
    label.textContent = avatarLabel;
    button.appendChild(label);

    button.addEventListener("click", () => {
      state.child.avatar = avatar.value;
      saveState();
      render();
      showToast(t("avatarUpdated"));
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
    const presetLabel = displayPresetLabel(preset);
    const button = document.createElement("button");
    button.className = `action-button${preset.defaultStarChange < 0 ? " is-correction" : ""}`;
    button.type = "button";
    button.innerHTML = `
        <span class="action-icon" aria-hidden="true">${preset.icon}</span>
        <span>
        <strong>${escapeHtml(presetLabel)}</strong>
        <span>${t("actionStars", { delta: formatDelta(preset.defaultStarChange) })}</span>
      </span>
    `;
    button.addEventListener("click", () => {
      addEvent({
        label: preset.label,
        starChange: preset.defaultStarChange,
        category: preset.category,
        visibleToKid: preset.visibleToKid,
        icon: preset.icon,
        feedbackMessage: t("eventAdded", { label: presetLabel, delta: formatDelta(preset.defaultStarChange) }),
        sourceId: preset.id
      });
    });
    container.appendChild(button);
  });
}

function renderRewards() {
  const activeReward = getActiveReward();
  dom.activeRewardBadge.textContent = activeReward
    ? t("activeRewardBadge", { icon: activeReward.icon, count: activeReward.cost })
    : t("noActiveReward");

  dom.rewardList.replaceChildren();
  const activeRewards = state.rewards.filter((reward) => reward.active);

  if (!activeRewards.length) {
    dom.rewardList.appendChild(emptyState(t("addRewardEmpty")));
    return;
  }

  activeRewards.forEach((reward) => {
    const canRedeem = state.child.currentStars >= reward.cost;
    const rewardLabel = displayRewardLabel(reward);
    const redeemedText = reward.redeemedAt
      ? ` · ${t("lastRedeemed", { date: formatDate(reward.redeemedAt) })}`
      : "";
    const item = document.createElement("article");
    item.className = "reward-item";
    item.innerHTML = `
      <div class="reward-main">
        <div class="reward-name">
          <span class="reward-icon" aria-hidden="true">${reward.icon}</span>
          <span>
            <strong>${escapeHtml(rewardLabel)}</strong>
            <span class="reward-meta">${t("rewardMeta", { count: reward.cost, redeemed: redeemedText })}</span>
          </span>
        </div>
      </div>
      <div class="reward-actions">
        <button class="small-button primary-small" type="button" data-action="redeem" ${canRedeem ? "" : "disabled"}>${t("redeemButton")}</button>
        <button class="small-button" type="button" data-action="target">${t("targetButton")}</button>
        <button class="small-button" type="button" data-action="edit">${t("editButton")}</button>
      </div>
    `;

    item.querySelector('[data-action="redeem"]').addEventListener("click", () => redeemReward(reward.id));
    item.querySelector('[data-action="target"]').addEventListener("click", () => {
      state.child.activeRewardId = reward.id;
      saveState();
      render();
      showToast(t("rewardTargetUpdated"));
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
    dom.historyList.appendChild(emptyState(t("noEvents")));
    return;
  }

  state.events.slice(0, 60).forEach((event) => {
    const item = document.createElement("article");
    item.className = "history-item";
    const deltaClass = event.starChange < 0 ? " is-negative" : "";
    const kidVisibility = event.visibleToKid ? t("kidVisible") : t("parentOnly");
    const eventLabel = kidReasonLabel(event);
    const eventNote = displayNote(event.note);

    item.innerHTML = `
      <div class="history-main">
        <div>
          <strong>${escapeHtml(eventLabel)}</strong>
          <span class="history-meta">${t("historyMeta", {
            date: formatDate(event.timestamp),
            category: displayCategory(event.category),
            visibility: kidVisibility
          })}</span>
        </div>
        <span class="history-delta${deltaClass}">${formatDelta(event.starChange)}</span>
      </div>
      ${event.note ? `<p class="history-note">${escapeHtml(eventNote)}</p>` : ""}
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
  return new Intl.DateTimeFormat(t("dateLocale"), {
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
  dom.languageSelect.addEventListener("change", () => {
    state.settings.language = SUPPORTED_LANGUAGES.includes(dom.languageSelect.value)
      ? dom.languageSelect.value
      : DEFAULT_STATE.settings.language;
    saveState();
    render();
  });

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
      showToast(t("parentUnlocked"));
      return;
    }

    dom.pinError.textContent = t("pinMismatchPunctuated");
    showToast(t("pinMismatch"), "warning");
  });

  dom.lockParentButton.addEventListener("click", () => {
    parentUnlocked = false;
    render();
    showToast(t("parentLocked"));
  });

  dom.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = dom.childNameInput.value.trim();
    state.child.name = name || "Little Star";
    saveState();
    render();
    showToast(t("profileUpdated"));
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
      feedbackMessage: t("customEventAdded")
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
    showToast(t("rewardSaved"));
  });

  dom.cancelRewardEditButton.addEventListener("click", clearRewardForm);

  dom.resetDataButton.addEventListener("click", () => {
    const confirmed = window.confirm(t("resetConfirm"));
    if (!confirmed) {
      return;
    }

    const language = currentLanguage();
    state = cloneDefaultState();
    state.settings.language = language;
    parentUnlocked = false;
    saveState();
    render();
    setView("kid");
    showToast(t("starGardenReset"));
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
