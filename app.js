const STORAGE_KEY = "star-garden-v1";
const PARENT_PIN = "1234";
const SUPPORTED_LANGUAGES = ["en", "zh-CN"];
const SUPPORTED_APPEARANCES = ["modern", "classic"];
const APPEARANCE_THEME_COLORS = { modern: "#2f6b50", classic: "#7ac36a" };

const TRANSLATIONS = {
  en: {
    appViews: "App views",
    showKidView: "Show kid view",
    brandSubtitle: "Growing one star at a time",
    kidTab: "Kid",
    parentTab: "Parent",
    languageLabel: "Display language",
    appearanceLabel: "Visual style",
    modernAppearance: "Modern",
    classicAppearance: "Classic",
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
    iconMeal: "Meal",
    iconShirt: "Shirt",
    iconBasket: "Basket",
    iconPotty: "Potty",
    iconWords: "Words",
    iconReminder: "Reminder",
    iconSafety: "Safety",
    iconCloud: "Cloud",
    addQuickActionButton: "Add Action",
    quickActionAddTitle: "Add Quick Action",
    quickActionEditTitle: "Edit Quick Action",
    saveActionButton: "Save Action",
    removeActionButton: "Remove",
    removeActionConfirm: "Remove quick action \"{label}\"?",
    actionAdded: "Quick action added",
    actionSaved: "Quick action saved",
    actionRemoved: "Quick action removed",
    saveRewardButton: "Save Reward",
    cancelEditButton: "Cancel Edit",
    historyTitle: "History",
    historyPerPageLabel: "Show",
    historyPageIndicator: "Page {current} of {total}",
    previousButton: "Previous",
    nextButton: "Next",
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
    appearanceLabel: "视觉样式",
    modernAppearance: "现代",
    classicAppearance: "经典",
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
    iconMeal: "吃饭",
    iconShirt: "衣服",
    iconBasket: "篮子",
    iconPotty: "如厕",
    iconWords: "说话",
    iconReminder: "提醒",
    iconSafety: "安全",
    iconCloud: "云朵",
    addQuickActionButton: "添加操作",
    quickActionAddTitle: "添加快捷操作",
    quickActionEditTitle: "编辑快捷操作",
    saveActionButton: "保存操作",
    removeActionButton: "删除",
    removeActionConfirm: "要删除快捷操作“{label}”吗？",
    actionAdded: "快捷操作已添加",
    actionSaved: "快捷操作已保存",
    actionRemoved: "快捷操作已删除",
    saveRewardButton: "保存奖励",
    cancelEditButton: "取消编辑",
    historyTitle: "历史",
    historyPerPageLabel: "显示",
    historyPageIndicator: "第 {current} / {total} 页",
    previousButton: "上一页",
    nextButton: "下一页",
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

for (const language of SUPPORTED_LANGUAGES) {
  Object.assign(TRANSLATIONS[language], window.EXTRA_TRANSLATIONS?.[language]);
}

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
    language: "en",
    historyPageSize: 20,
    appearance: "modern"
  }
};

const legacyState = loadLegacyState();
let state = cloneDefaultState();
state.settings = loadPreferences(legacyState?.settings);
const gardenSession = new GardenSession(new GardenStore(window.STAR_GARDEN_CONFIG || {}));
const draftRevisions = new Map();
const expandedSections = new Set();
let parentGeneration = 0;
let accountBusy = false;
let photoBusy = false;
let avatarURL = null;
let avatarPath = null;
let photoPreviewURL = null;
let pendingSuccess = null;
let mutationInProgress = false;
let photoDraft = null;
let lastRestoredResult = null;
const dismissedDraftContexts = new WeakSet();
let parentUnlocked = false;
let profileEditing = false;
let historyPage = 1;
let customEventStarsEdited = false;
let celebrationTimeout = null;
let toastTimeout = null;

const dom = {
  appToast: document.querySelector("#appToast"),
  themeColor: document.querySelector("#themeColor"),
  appearanceSelect: document.querySelector("#appearanceSelect"),
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
  profileSummary: document.querySelector("#profileSummary"),
  profileAvatar: document.querySelector("#profileAvatar"),
  profileName: document.querySelector("#profileName"),
  editProfileButton: document.querySelector("#editProfileButton"),
  profileForm: document.querySelector("#profileForm"),
  childNameInput: document.querySelector("#childNameInput"),
  cancelProfileEditButton: document.querySelector("#cancelProfileEditButton"),
  avatarChoices: document.querySelector("#avatarChoices"),
  parentBalance: document.querySelector("#parentBalance"),
  earningActions: document.querySelector("#earningActions"),
  correctionActions: document.querySelector("#correctionActions"),
  addQuickActionButton: document.querySelector("#addQuickActionButton"),
  quickActionForm: document.querySelector("#quickActionForm"),
  quickActionFormTitle: document.querySelector("#quickActionFormTitle"),
  quickActionIdInput: document.querySelector("#quickActionIdInput"),
  quickActionLabelInput: document.querySelector("#quickActionLabelInput"),
  quickActionStarsInput: document.querySelector("#quickActionStarsInput"),
  quickActionIconInput: document.querySelector("#quickActionIconInput"),
  quickActionCategoryInput: document.querySelector("#quickActionCategoryInput"),
  quickActionVisibleInput: document.querySelector("#quickActionVisibleInput"),
  cancelQuickActionEditButton: document.querySelector("#cancelQuickActionEditButton"),
  removeQuickActionButton: document.querySelector("#removeQuickActionButton"),
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
  historyPageSizeSelect: document.querySelector("#historyPageSizeSelect"),
  historyPagination: document.querySelector("#historyPagination"),
  historyPrevButton: document.querySelector("#historyPrevButton"),
  historyPageIndicator: document.querySelector("#historyPageIndicator"),
  historyNextButton: document.querySelector("#historyNextButton"),
  gardenTools: document.querySelector("#gardenTools"),
  kidGardenContent: document.querySelector("#kidGardenContent"),
  kidAccountMessage: document.querySelector("#kidAccountMessage"),
  kidSyncStatus: document.querySelector("#kidSyncStatus"),
  accountForm: document.querySelector("#accountForm"),
  accountDetails: document.querySelector("#accountDetails"),
  accountEmailInput: document.querySelector("#accountEmailInput"),
  accountPasswordInput: document.querySelector("#accountPasswordInput"),
  accountEmail: document.querySelector("#accountEmail"),
  accountError: document.querySelector("#accountError"),
  accountStatus: document.querySelector("#accountStatus"),
  signInButton: document.querySelector("#signInButton"),
  signOutButton: document.querySelector("#signOutButton"),
  setupGarden: document.querySelector("#setupGarden"),
  importGardenButton: document.querySelector("#importGardenButton"),
  freshGardenButton: document.querySelector("#freshGardenButton"),
  retrySaveButton: document.querySelector("#retrySaveButton"),
  discardSaveButton: document.querySelector("#discardSaveButton"),
  avatarFileInput: document.querySelector("#avatarFileInput"),
  uploadPhotoButton: document.querySelector("#uploadPhotoButton"),
  removePhotoButton: document.querySelector("#removePhotoButton"),
  avatarPreview: document.querySelector("#avatarPreview"),
  avatarUploadError: document.querySelector("#avatarUploadError")
};

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function loadLegacyState() {
  const fallback = cloneDefaultState();

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return null;
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
    console.warn("Could not read the legacy garden. The original data has been preserved.", error);
    return null;
  }
}

function normalizeState(savedState) {
  const defaultPresetsById = new Map(
    DEFAULT_STATE.activityPresets.map((preset) => [preset.id, preset])
  );
  const historyPageSize = [20, 50, 200].includes(Number(savedState.settings?.historyPageSize))
    ? Number(savedState.settings.historyPageSize)
    : DEFAULT_STATE.settings.historyPageSize;

  return {
    ...savedState,
    settings: {
      ...DEFAULT_STATE.settings,
      ...(savedState.settings || {}),
      language: SUPPORTED_LANGUAGES.includes(savedState.settings?.language)
        ? savedState.settings.language
        : DEFAULT_STATE.settings.language,
      historyPageSize,
      appearance: SUPPORTED_APPEARANCES.includes(savedState.settings?.appearance)
        ? savedState.settings.appearance
        : DEFAULT_STATE.settings.appearance
    },
    activityPresets: savedState.activityPresets.map((preset) => {
      const defaultPreset = defaultPresetsById.get(preset.id);
      if (!defaultPreset) {
        return {
          id: preset.id || createId("preset"),
          label: preset.label || "Quick action",
          defaultStarChange: Number.isFinite(Number(preset.defaultStarChange)) ? Math.round(Number(preset.defaultStarChange)) : 1,
          icon: preset.icon || "⭐",
          category: ["earning", "correction"].includes(preset.category) ? preset.category : "earning",
          visibleToKid: typeof preset.visibleToKid === "boolean" ? preset.visibleToKid : true
        };
      }

      return {
        ...defaultPreset,
        ...preset,
        visibleToKid: typeof preset.visibleToKid === "boolean" ? preset.visibleToKid : defaultPreset.visibleToKid
      };
    })
  };
}

function loadPreferences(fallback = {}) {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem("star-garden-preferences") || "{}"); } catch (_) { /* Defaults work without storage. */ }
  const settings = { ...DEFAULT_STATE.settings, ...fallback, ...saved };
  return {
    language: SUPPORTED_LANGUAGES.includes(settings.language) ? settings.language : "en",
    historyPageSize: [20, 50, 200].includes(settings.historyPageSize) ? settings.historyPageSize : 20,
    appearance: SUPPORTED_APPEARANCES.includes(settings.appearance) ? settings.appearance : "modern"
  };
}

function savePreferences() {
  try { localStorage.setItem("star-garden-preferences", JSON.stringify(state.settings)); } catch (_) { /* Preferences remain usable for this visit. */ }
}

function gardenDocument(source = state) {
  const { settings, ...document } = structuredClone(source);
  return document;
}

function canUseParentTools() {
  return parentUnlocked && dom.parentView.classList.contains("is-active") && Boolean(gardenSession.garden);
}

function canMutate(parentOnly = true) {
  return gardenSession.canWrite && !photoBusy && !mutationInProgress && (!parentOnly || canUseParentTools());
}

function markDraft(form) {
  if (!draftRevisions.has(form.id)) draftRevisions.set(form.id, gardenSession.garden?.revision);
}

async function mutateGarden(change, { form = null, parentOnly = true, success = null } = {}) {
  if (!canMutate(parentOnly)) return false;
  const next = gardenDocument();
  if (change(next) === false) return false;
  const revision = form ? (draftRevisions.get(form.id) ?? gardenSession.garden.revision) : gardenSession.garden.revision;
  const generation = parentGeneration;
  const epoch = gardenSession.epoch;
  pendingSuccess = () => {
    if (epoch !== gardenSession.epoch || (parentOnly && generation !== parentGeneration)) return;
    if (form) draftRevisions.delete(form.id);
    success?.();
  };
  mutationInProgress = true;
  render();
  const context = form ? captureDraft(form) : null;
  let result;
  try { result = await gardenSession.commit(next, revision, context); }
  finally { mutationInProgress = false; }
  if (epoch !== gardenSession.epoch) return false;
  if (["saved", "duplicate"].includes(result.status)) {
    pendingSuccess?.();
    pendingSuccess = null;
    render();
    return true;
  }
  if (result.status === "error" && gardenSession.pending?.document === next) {
    pendingSuccess.operationId = gardenSession.pending.operationId;
  } else pendingSuccess = null;
  render();
  return false;
}

function clearDrafts({ dismissPending = true } = {}) {
  if (dismissPending) {
    for (const context of [gardenSession.pending?.context, gardenSession.lastResult?.context]) {
      if (context && typeof context === "object") dismissedDraftContexts.add(context);
    }
  }
  draftRevisions.clear();
  clearQuickActionForm();
  clearRewardForm();
  dom.customEventForm.reset();
  customEventStarsEdited = false;
  applyCustomEventCategoryDefaults({ forceStars: true });
  dom.childNameInput.value = state.child.name;
  dom.avatarFileInput.value = "";
  dom.avatarUploadError.textContent = "";
  clearPhotoDraft();
}

function lockParent({ focus = false } = {}) {
  const wasUnlocked = parentUnlocked;
  parentUnlocked = false;
  profileEditing = false;
  parentGeneration += 1;
  lastRestoredResult = null;
  expandedSections.clear();
  clearDrafts({ dismissPending: wasUnlocked });
  dom.pinInput.value = "";
  dom.pinError.textContent = "";
  dom.accountPasswordInput.value = "";
  dom.accountError.textContent = "";
  clearTimeout(toastTimeout);
  dom.appToast.textContent = "";
  dom.appToast.className = "app-toast";
  clearTimeout(celebrationTimeout);
  dom.celebration.textContent = "";
  dom.celebration.classList.remove("is-visible");
  render();
  if (focus) dom.pinInput.focus();
}

function setSection(name, expanded) {
  if (expanded) expandedSections.add(name);
  else expandedSections.delete(name);
  renderDisclosures();
}

function renderDisclosures() {
  document.querySelectorAll("[data-section-toggle]").forEach((button) => {
    const name = button.dataset.sectionToggle;
    const expanded = expandedSections.has(name);
    button.textContent = expanded ? "−" : "+";
    button.setAttribute("aria-expanded", String(expanded));
    button.setAttribute("aria-label", t(expanded ? "collapseSection" : "expandSection", { section: t(`${name}Title`) }));
    document.getElementById(button.getAttribute("aria-controls")).hidden = !expanded;
  });
}

function renderAccount() {
  const signedIn = Boolean(gardenSession.user);
  const hasGarden = signedIn && Boolean(gardenSession.garden);
  dom.accountForm.hidden = signedIn;
  dom.accountDetails.hidden = !signedIn;
  dom.accountEmail.textContent = gardenSession.user?.email || "";
  dom.accountStatus.textContent = t(photoBusy ? "saving" : gardenSession.status);
  dom.signInButton.disabled = !gardenSession.store.configured || !navigator.onLine || accountBusy;
  dom.signOutButton.disabled = accountBusy;
  dom.setupGarden.hidden = !signedIn || Boolean(gardenSession.garden) || !gardenSession.ready;
  dom.importGardenButton.disabled = !legacyState || gardenSession.busy || !navigator.onLine;
  dom.importGardenButton.title = legacyState ? "" : t("importUnavailable");
  dom.freshGardenButton.disabled = gardenSession.busy || !navigator.onLine;
  dom.gardenTools.hidden = !hasGarden;
  dom.kidGardenContent.hidden = !hasGarden;
  dom.kidAccountMessage.hidden = hasGarden;
  dom.kidAccountMessage.textContent = t(signedIn && !gardenSession.ready ? gardenSession.status : "askParentSignIn");
  const kidStatus = photoBusy ? "saving" : gardenSession.status;
  dom.kidSyncStatus.textContent = t(kidStatus);
  dom.kidSyncStatus.hidden = kidStatus === "synced";
  dom.retrySaveButton.hidden = !gardenSession.pending && !gardenSession.conflict;
  dom.retrySaveButton.disabled = gardenSession.busy || !navigator.onLine;
  dom.retrySaveButton.textContent = t(gardenSession.pending ? "retrySave" : "reviewRetry");
  dom.discardSaveButton.hidden = !gardenSession.conflict;
  dom.removePhotoButton.hidden = !state.child.avatarPhotoPath;
  dom.uploadPhotoButton.textContent = t(photoDraft ? "savePhoto" : "uploadPhoto");
  dom.avatarPreview.hidden = !photoPreviewURL && !avatarURL;
  if (photoPreviewURL || avatarURL) dom.avatarPreview.src = photoPreviewURL || avatarURL;
  else dom.avatarPreview.removeAttribute("src");
}

function renderAvailability() {
  // Retain form drafts while disconnected; only actions which save content are blocked.
  const enabled = canMutate();
  dom.gardenTools.querySelectorAll('button[type="submit"], [data-mutation]').forEach((button) => {
    button.disabled = !enabled || button.dataset.unavailable === "true";
  });
  for (const button of [dom.addQuickActionButton, dom.uploadPhotoButton, dom.removePhotoButton, dom.removeQuickActionButton]) {
    button.disabled = !enabled;
  }
  dom.cancelProfileEditButton.disabled = photoBusy || mutationInProgress;
  dom.gardenTools.querySelectorAll("input, textarea, select").forEach((input) => {
    if (input !== dom.historyPageSizeSelect) input.disabled = gardenSession.busy || photoBusy || mutationInProgress || Boolean(gardenSession.pending);
  });
}

function currentLanguage() {
  return state.settings.language;
}

function applyAppearance() {
  const appearance = SUPPORTED_APPEARANCES.includes(state.settings.appearance)
    ? state.settings.appearance
    : "modern";
  document.documentElement.dataset.appearance = appearance;
  dom.appearanceSelect.value = appearance;
  dom.themeColor.content = APPEARANCE_THEME_COLORS[appearance];
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
  const defaultPreset = DEFAULT_STATE.activityPresets.find((item) => item.id === preset.id);
  if (!defaultPreset || preset.label !== defaultPreset.label) {
    return preset.label;
  }

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
  applyAppearance();

  dom.translatableText.forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  dom.translatablePlaceholders.forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.querySelectorAll("[data-i18n-alt]").forEach((element) => { element.alt = t(element.dataset.i18nAlt); });

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
  const wasParent = dom.parentView.classList.contains("is-active");
  if (!showParent || !wasParent) lockParent();

  dom.kidView.classList.toggle("is-active", !showParent);
  dom.parentView.classList.toggle("is-active", showParent);
  dom.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.view === viewName);
  });

  if (showParent && !parentUnlocked) {
    setTimeout(() => dom.pinInput.focus(), 50);
  }
}

function appendEvent(document, { label, starChange, category, note = "", visibleToKid = true, icon = "⭐", sourceId = null, rewardId = null }) {
  const change = Math.round(Number(starChange) || 0);
  document.child.currentStars = clampStars(document.child.currentStars + change);
  document.events.unshift({
    id: createId("event"), timestamp: new Date().toISOString(), label: label.trim(),
    starChange: change, category, note: note.trim(), visibleToKid, icon, sourceId, rewardId
  });
}

async function addEvent(options, { form = null } = {}) {
  return mutateGarden((next) => appendEvent(next, options), {
    form,
    success: () => {
      historyPage = 1;
      if (options.starChange > 0) showCelebration(t("greatJob", { icon: options.icon || "⭐", count: options.starChange }));
      showToast(options.feedbackMessage || t("eventAdded", { label: options.label, delta: formatDelta(options.starChange) }),
        options.starChange < 0 ? "warning" : "success");
      if (form === dom.customEventForm) {
        form.reset();
        customEventStarsEdited = false;
        applyCustomEventCategoryDefaults({ forceStars: true });
      }
    }
  });
}

async function redeemReward(rewardId, { parentOnly = false } = {}) {
  if (!canMutate(parentOnly)) return false;
  const reward = state.rewards.find((item) => item.id === rewardId && item.active);
  if (!reward || state.child.currentStars < reward.cost) {
    const neededStars = reward ? reward.cost - state.child.currentStars : 0;
    showToast(neededStars > 0 ? t("needMoreStarsToast", { count: neededStars }) : t("rewardUnavailable"), "warning");
    return false;
  }
  return mutateGarden((next) => {
    const target = next.rewards.find((item) => item.id === rewardId);
    target.redeemedAt = new Date().toISOString();
    appendEvent(next, {
      label: `Redeemed: ${reward.label}`, starChange: -reward.cost, category: "reward",
      note: "Reward redeemed.", visibleToKid: true, icon: reward.icon, rewardId: reward.id
    });
  }, {
    parentOnly,
    success: () => {
      historyPage = 1;
      showToast(t("redeemedToast", { label: displayRewardLabel(reward) }));
      showCelebration(t("rewardTime", { icon: reward.icon }));
    }
  });
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
  renderParentProfile();
  renderAvatarChoices();
  renderQuickActions();
  renderRewards();
  renderHistory();
  renderAccount();
  renderDisclosures();
  renderAvailability();
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
      <span class="today-icon" aria-hidden="true">${escapeHtml(event.icon || "⭐")}</span>
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
    const canRedeem = remainingStars === 0 && canMutate(false);
    const rewardLabel = displayRewardLabel(reward);
    const card = document.createElement("article");
    card.className = `kid-reward-card${canRedeem ? " is-ready" : ""}`;
    card.innerHTML = `
      <div class="kid-reward-icon" aria-hidden="true">${escapeHtml(reward.icon)}</div>
      <div class="kid-reward-copy">
        <strong>${escapeHtml(rewardLabel)}</strong>
        <span>${t("rewardCost", { count: reward.cost, unit: starUnit(reward.cost) })}</span>
      </div>
      <button class="kid-redeem-button" type="button" data-action="kid-redeem" ${canRedeem ? "" : "disabled"}>
        ${remainingStars === 0 ? t("redeemButton") : t("needMore", { count: remainingStars })}
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

function renderAvatar(element) {
  const avatar = getAvatarOption(state.child.avatar);
  element.replaceChildren();
  element.classList.toggle("has-photo", Boolean(avatarURL));
  if (avatarURL) {
    const image = document.createElement("img");
    image.src = avatarURL;
    image.alt = "";
    element.appendChild(image);
  } else {
    element.textContent = avatar.emoji;
  }
}

function renderKidAvatar() {
  renderAvatar(dom.kidAvatar);
}

function renderParentProfile() {
  dom.profileSummary.hidden = profileEditing;
  dom.profileForm.hidden = !profileEditing;
  dom.editProfileButton.hidden = profileEditing;
  dom.profileName.textContent = displayChildName(state.child.name);
  renderAvatar(dom.profileAvatar);
  if (!draftRevisions.has(dom.profileForm.id)) dom.childNameInput.value = state.child.name;
}

function startProfileEdit() {
  if (!canUseParentTools()) return;
  profileEditing = true;
  renderParentProfile();
  renderAvailability();
  dom.childNameInput.focus();
}

function cancelProfileEdit() {
  if (!canUseParentTools() || photoBusy || mutationInProgress) return;
  draftRevisions.delete(dom.profileForm.id);
  dom.childNameInput.value = state.child.name;
  dom.avatarFileInput.value = "";
  dom.avatarUploadError.textContent = "";
  profileEditing = false;
  render();
  dom.editProfileButton.focus();
}

async function loadAvatar() {
  const path = gardenSession.garden?.document.child.avatarPhotoPath || null;
  if (path === avatarPath && avatarURL) return;
  if (path !== avatarPath) {
    if (avatarURL) URL.revokeObjectURL(avatarURL);
    avatarURL = null;
    avatarPath = path;
    renderKidAvatar();
    renderParentProfile();
    renderAccount();
  }
  if (!path || !gardenSession.user) return;
  const epoch = gardenSession.epoch;
  try {
    const blob = await gardenSession.store.getPhoto(path, gardenSession.user.id);
    if (epoch !== gardenSession.epoch || path !== avatarPath) return;
    if (avatarURL) URL.revokeObjectURL(avatarURL);
    avatarURL = URL.createObjectURL(blob);
    renderKidAvatar();
    renderParentProfile();
    renderAccount();
  } catch (_) { /* The animal avatar remains available if the photo is not cached. */ }
}

async function chooseAnimal(value) {
  if (!canMutate()) return;
  const previousPath = state.child.avatarPhotoPath;
  const epoch = gardenSession.epoch;
  await mutateGarden((next) => {
    next.child.avatar = value;
    next.child.avatarPhotoPath = null;
  }, { success: () => {
    clearPhotoDraft();
    showToast(t("avatarUpdated"));
    if (previousPath && epoch === gardenSession.epoch) void gardenSession.store.removePhoto(previousPath).catch(() => {});
  } });
}

function renderParentGate() {
  dom.pinGate.hidden = parentUnlocked;
  dom.parentTools.hidden = !parentUnlocked;
  dom.parentBalance.textContent = t("balanceStars", { count: state.child.currentStars });
}

function renderAvatarChoices() {
  dom.avatarChoices.replaceChildren();

  AVATARS.forEach((avatar) => {
    const button = document.createElement("button");
    button.className = `avatar-choice${avatar.value === state.child.avatar && !state.child.avatarPhotoPath ? " is-selected" : ""}`;
    button.type = "button";
    button.dataset.mutation = "true";
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

    button.addEventListener("click", () => { void chooseAnimal(avatar.value); });
    dom.avatarChoices.appendChild(button);
  });
}

function renderQuickActions() {
  const earning = state.activityPresets.filter((preset) => preset.category === "earning");
  const corrections = state.activityPresets.filter((preset) => preset.category === "correction");

  renderActionGroup(dom.earningActions, earning);
  renderActionGroup(dom.correctionActions, corrections);
  updateQuickActionFormTitle();
}

function renderActionGroup(container, presets) {
  container.replaceChildren();

  presets.forEach((preset) => {
    const presetLabel = displayPresetLabel(preset);
    const card = document.createElement("article");
    card.className = "action-card";

    const button = document.createElement("button");
    button.className = `action-button${preset.defaultStarChange < 0 ? " is-correction" : ""}`;
    button.dataset.mutation = "true";
    button.type = "button";
    button.innerHTML = `
        <span class="action-icon" aria-hidden="true">${escapeHtml(preset.icon)}</span>
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

    const editButton = document.createElement("button");
    editButton.className = "small-button";
    editButton.type = "button";
    editButton.dataset.mutation = "true";
    editButton.textContent = t("editButton");
    editButton.addEventListener("click", () => startQuickActionEdit(preset));

    card.append(button, editButton);
    container.appendChild(card);
  });
}

function startQuickActionAdd() {
  if (!canMutate()) return;
  draftRevisions.set(dom.quickActionForm.id, gardenSession.garden.revision);
  setSection("quickActions", true);
  dom.quickActionIdInput.value = "";
  dom.quickActionLabelInput.value = "";
  dom.quickActionStarsInput.value = "1";
  dom.quickActionIconInput.value = "⭐";
  dom.quickActionCategoryInput.value = "earning";
  dom.quickActionVisibleInput.checked = true;
  dom.removeQuickActionButton.hidden = true;
  dom.quickActionForm.hidden = false;
  updateQuickActionFormTitle();
  dom.quickActionLabelInput.focus();
}

function startQuickActionEdit(preset) {
  if (!canMutate()) return;
  draftRevisions.set(dom.quickActionForm.id, gardenSession.garden.revision);
  setSection("quickActions", true);
  dom.quickActionIdInput.value = preset.id;
  dom.quickActionLabelInput.value = preset.label;
  dom.quickActionStarsInput.value = preset.defaultStarChange;
  dom.quickActionIconInput.value = preset.icon;
  dom.quickActionCategoryInput.value = preset.category;
  dom.quickActionVisibleInput.checked = preset.visibleToKid;
  dom.removeQuickActionButton.hidden = false;
  dom.quickActionForm.hidden = false;
  updateQuickActionFormTitle();
  dom.quickActionLabelInput.focus();
}

function updateQuickActionFormTitle() {
  dom.quickActionFormTitle.textContent = dom.quickActionIdInput.value
    ? t("quickActionEditTitle")
    : t("quickActionAddTitle");
}

function clearQuickActionForm() {
  draftRevisions.delete(dom.quickActionForm.id);
  dom.quickActionIdInput.value = "";
  dom.quickActionLabelInput.value = "";
  dom.quickActionStarsInput.value = "";
  dom.quickActionIconInput.value = "⭐";
  dom.quickActionCategoryInput.value = "earning";
  dom.quickActionVisibleInput.checked = true;
  dom.removeQuickActionButton.hidden = true;
  dom.quickActionForm.hidden = true;
  updateQuickActionFormTitle();
}

async function removeQuickAction(preset) {
  if (!canMutate()) return;
  if (!window.confirm(t("removeActionConfirm", { label: displayPresetLabel(preset) }))) return;
  await mutateGarden((next) => {
    next.activityPresets = next.activityPresets.filter((item) => item.id !== preset.id);
  }, {
    form: dom.quickActionForm,
    success: () => { clearQuickActionForm(); showToast(t("actionRemoved")); }
  });
}

function customEventCategoryDefaults(category) {
  if (category === "correction") {
    return {
      starChange: -1,
      visibleToKid: false,
      icon: "🌧️"
    };
  }

  if (category === "adjustment") {
    return {
      starChange: 0,
      visibleToKid: false,
      icon: "⭐"
    };
  }

  return {
    starChange: 1,
    visibleToKid: true,
    icon: "⭐"
  };
}

function applyCustomEventCategoryDefaults({ forceStars = false } = {}) {
  const defaults = customEventCategoryDefaults(dom.eventCategoryInput.value);
  if (forceStars || !customEventStarsEdited) {
    dom.eventStarsInput.value = String(defaults.starChange);
  }
  dom.eventVisibleInput.checked = defaults.visibleToKid;
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
          <span class="reward-icon" aria-hidden="true">${escapeHtml(reward.icon)}</span>
          <span>
            <strong>${escapeHtml(rewardLabel)}</strong>
            <span class="reward-meta">${t("rewardMeta", { count: reward.cost, redeemed: redeemedText })}</span>
          </span>
        </div>
      </div>
      <div class="reward-actions">
        <button class="small-button primary-small" type="button" data-action="redeem" data-mutation="true" data-unavailable="${!canRedeem}" ${canRedeem ? "" : "disabled"}>${t("redeemButton")}</button>
        <button class="small-button" type="button" data-action="target" data-mutation="true">${t("targetButton")}</button>
        <button class="small-button" type="button" data-action="edit" data-mutation="true">${t("editButton")}</button>
      </div>
    `;

    item.querySelector('[data-action="redeem"]').addEventListener("click", () => { void redeemReward(reward.id, { parentOnly: true }); });
    item.querySelector('[data-action="target"]').addEventListener("click", () => {
      void mutateGarden((next) => { next.child.activeRewardId = reward.id; }, {
        success: () => showToast(t("rewardTargetUpdated"))
      });
    });
    item.querySelector('[data-action="edit"]').addEventListener("click", () => startRewardEdit(reward));

    dom.rewardList.appendChild(item);
  });
}

function startRewardEdit(reward) {
  if (!canMutate()) return;
  draftRevisions.set(dom.rewardForm.id, gardenSession.garden.revision);
  setSection("rewards", true);
  dom.rewardIdInput.value = reward.id;
  dom.rewardLabelInput.value = reward.label;
  dom.rewardCostInput.value = reward.cost;
  dom.rewardIconInput.value = reward.icon;
  dom.cancelRewardEditButton.hidden = false;
  dom.rewardLabelInput.focus();
}

function clearRewardForm() {
  draftRevisions.delete(dom.rewardForm.id);
  dom.rewardIdInput.value = "";
  dom.rewardLabelInput.value = "";
  dom.rewardCostInput.value = "5";
  dom.rewardIconInput.value = "⭐";
  dom.cancelRewardEditButton.hidden = true;
}

function renderHistory() {
  dom.historyList.replaceChildren();
  dom.historyPageSizeSelect.value = String(state.settings.historyPageSize);

  if (!state.events.length) {
    dom.historyList.appendChild(emptyState(t("noEvents")));
    dom.historyPagination.hidden = true;
    return;
  }

  const pageSize = state.settings.historyPageSize;
  const totalPages = Math.max(1, Math.ceil(state.events.length / pageSize));
  historyPage = Math.min(Math.max(historyPage, 1), totalPages);
  const startIndex = (historyPage - 1) * pageSize;
  const visibleEvents = state.events.slice(startIndex, startIndex + pageSize);

  visibleEvents.forEach((event) => {
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

  dom.historyPagination.hidden = totalPages <= 1;
  dom.historyPrevButton.disabled = historyPage <= 1;
  dom.historyNextButton.disabled = historyPage >= totalPages;
  dom.historyPageIndicator.textContent = t("historyPageIndicator", {
    current: historyPage,
    total: totalPages
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

function captureDraft(form) {
  return {
    type: "form", formId: form.id, revision: draftRevisions.get(form.id) ?? gardenSession.garden.revision,
    fields: [...form.elements].filter((field) => field.id && /^(INPUT|SELECT|TEXTAREA)$/.test(field.tagName) && field.type !== "file")
      .map((field) => ({ id: field.id, value: field.value, checked: field.checked }))
  };
}

function restorePendingDraft() {
  if (!parentUnlocked) return;
  const pending = gardenSession.pending;
  const result = gardenSession.lastResult;
  const source = pending && !gardenSession.busy ? pending : result?.status === "conflict" ? result : null;
  const context = source?.context;
  if (!context || source === lastRestoredResult || dismissedDraftContexts.has(context)) return;
  lastRestoredResult = source;
  if (context.type === "form") {
    const form = [dom.profileForm, dom.quickActionForm, dom.customEventForm, dom.rewardForm].find((item) => item.id === context.formId);
    if (!form || draftRevisions.has(form.id)) return;
    for (const saved of context.fields || []) {
      const field = document.getElementById(saved.id);
      if (field && form.contains(field) && field.type !== "file") {
        field.value = saved.value;
        if (field.type === "checkbox") field.checked = saved.checked;
      }
    }
    draftRevisions.set(form.id, context.revision);
    if (form === dom.profileForm) {
      profileEditing = true;
    } else if (form === dom.quickActionForm) {
      dom.quickActionForm.hidden = false;
      dom.removeQuickActionButton.hidden = !dom.quickActionIdInput.value;
      setSection("quickActions", true);
    } else if (form === dom.rewardForm) {
      dom.cancelRewardEditButton.hidden = !dom.rewardIdInput.value;
      setSection("rewards", true);
    } else if (form === dom.customEventForm) setSection("customEvent", true);
  } else if (context.type === "photo" && !photoDraft) {
    photoDraft = { path: context.path, revision: context.revision };
    const epoch = gardenSession.epoch;
    void gardenSession.store.getPhoto(context.path, gardenSession.user.id).then((blob) => {
      if (epoch !== gardenSession.epoch || photoDraft?.path !== context.path) return;
      if (photoPreviewURL) URL.revokeObjectURL(photoPreviewURL);
      photoPreviewURL = URL.createObjectURL(blob);
      renderAccount();
    }).catch(() => {});
  }
}

function clearPhotoDraft() {
  const unusedPath = photoDraft?.path;
  photoDraft = null;
  if (photoPreviewURL) URL.revokeObjectURL(photoPreviewURL);
  photoPreviewURL = null;
  if (unusedPath && unusedPath !== state.child.avatarPhotoPath &&
      unusedPath !== gardenSession.pending?.document.child.avatarPhotoPath && gardenSession.user) {
    void gardenSession.store.removePhoto(unusedPath).catch(() => {});
  }
}

async function resizePhoto(file) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("photoInvalid");
  if (file.size > 5 * 1024 * 1024) throw new Error("photoTooLarge");
  // Check the encoded format as well as the file-picker MIME type.
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  const png = [137, 80, 78, 71, 13, 10, 26, 10].every((value, i) => bytes[i] === value);
  const webp = String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  if (!jpeg && !png && !webp) throw new Error("photoInvalid");
  let bitmap;
  try { bitmap = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch (_) { throw new Error("photoInvalid"); }
  const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
  if (!blob) throw new Error("photoInvalid");
  return blob;
}

async function uploadPhoto(file) {
  if (!file || !canMutate()) return;
  const epoch = gardenSession.epoch;
  const generation = parentGeneration;
  const revision = gardenSession.garden.revision;
  photoBusy = true;
  clearPhotoDraft();
  dom.avatarUploadError.textContent = "";
  render();
  try {
    const blob = await resizePhoto(file);
    if (epoch !== gardenSession.epoch || generation !== parentGeneration) return;
    photoPreviewURL = URL.createObjectURL(blob);
    renderAccount();
    const path = await gardenSession.store.uploadPhoto(blob);
    if (epoch !== gardenSession.epoch || generation !== parentGeneration) {
      if (epoch === gardenSession.epoch) void gardenSession.store.removePhoto(path).catch(() => {});
      return;
    }
    photoDraft = { path, revision };
  } catch (error) {
    if (epoch !== gardenSession.epoch || generation !== parentGeneration) return;
    clearPhotoDraft();
    dom.avatarUploadError.textContent = t(["photoInvalid", "photoTooLarge"].includes(error.message) ? error.message : "photoFailed");
  } finally {
    if (epoch === gardenSession.epoch) {
      photoBusy = false;
      dom.avatarFileInput.value = "";
      render();
    }
  }
  if (epoch === gardenSession.epoch && generation === parentGeneration && photoDraft) await savePhotoDraft();
}

async function savePhotoDraft() {
  if (!photoDraft || !canMutate()) return;
  const epoch = gardenSession.epoch;
  const generation = parentGeneration;
  const previousPath = state.child.avatarPhotoPath;
  const next = gardenDocument();
  next.child.avatarPhotoPath = photoDraft.path;
  const context = { type: "photo", path: photoDraft.path, revision: photoDraft.revision };
  pendingSuccess = () => {
    if (epoch !== gardenSession.epoch || generation !== parentGeneration) return;
    clearPhotoDraft();
    showToast(t("photoUpdated"));
    if (previousPath) void gardenSession.store.removePhoto(previousPath).catch(() => {});
  };
  photoBusy = true;
  render();
  let result;
  try { result = await gardenSession.commit(next, photoDraft.revision, context); }
  finally { if (epoch === gardenSession.epoch) photoBusy = false; }
  if (epoch !== gardenSession.epoch) return;
  if (["saved", "duplicate"].includes(result.status)) {
    pendingSuccess?.();
    pendingSuccess = null;
  } else if (result.status === "error" && gardenSession.pending?.document === next) {
    pendingSuccess.operationId = gardenSession.pending.operationId;
  } else pendingSuccess = null;
  render();
}

function wireEvents() {
  dom.appearanceSelect.addEventListener("change", () => {
    state.settings.appearance = SUPPORTED_APPEARANCES.includes(dom.appearanceSelect.value)
      ? dom.appearanceSelect.value
      : "modern";
    savePreferences();
    render();
  });
  dom.languageSelect.addEventListener("change", () => {
    state.settings.language = SUPPORTED_LANGUAGES.includes(dom.languageSelect.value) ? dom.languageSelect.value : "en";
    savePreferences();
    render();
  });
  dom.tabButtons.forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  dom.brandButton.addEventListener("click", () => setView("kid"));
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (button) pulseElement(button);
  });
  document.querySelectorAll("[data-section-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!canUseParentTools()) return;
      const name = button.dataset.sectionToggle;
      setSection(name, !expandedSections.has(name));
    });
  });
  dom.pinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!dom.parentView.classList.contains("is-active")) return;
    if (dom.pinInput.value !== PARENT_PIN) {
      dom.pinError.textContent = t("pinMismatchPunctuated");
      return;
    }
    parentUnlocked = true;
    dom.pinInput.value = "";
    dom.pinError.textContent = "";
    restorePendingDraft();
    render();
  });
  dom.lockParentButton.addEventListener("click", () => lockParent({ focus: true }));
  dom.editProfileButton.addEventListener("click", startProfileEdit);
  dom.cancelProfileEditButton.addEventListener("click", cancelProfileEdit);

  dom.accountForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!parentUnlocked || accountBusy || !navigator.onLine || !gardenSession.store.configured) return;
    accountBusy = true;
    dom.accountError.textContent = "";
    const password = dom.accountPasswordInput.value;
    const generation = parentGeneration;
    dom.accountPasswordInput.value = "";
    render();
    try { await gardenSession.signIn(dom.accountEmailInput.value.trim(), password); }
    catch (_) { if (generation === parentGeneration) dom.accountError.textContent = t("signInFailed"); }
    finally { accountBusy = false; render(); }
  });
  dom.signOutButton.addEventListener("click", async () => {
    if (!parentUnlocked || accountBusy) return;
    accountBusy = true;
    lockParent();
    try { await gardenSession.signOut(); }
    catch (_) { /* Local session is cleared even if network revocation failed. */ }
    finally { accountBusy = false; render(); }
  });
  const initialize = async (source) => {
    if (!parentUnlocked || !source) return;
    await gardenSession.initialize(gardenDocument(source));
  };
  dom.importGardenButton.addEventListener("click", () => { void initialize(legacyState); });
  dom.freshGardenButton.addEventListener("click", () => { void initialize(cloneDefaultState()); });

  dom.retrySaveButton.addEventListener("click", async () => {
    if (!parentUnlocked || gardenSession.busy || !navigator.onLine) return;
    if (gardenSession.pending) {
      const epoch = gardenSession.epoch;
      const generation = parentGeneration;
      const result = await gardenSession.retryPending();
      if (epoch !== gardenSession.epoch || generation !== parentGeneration) return;
      if (["saved", "duplicate"].includes(result.status)) {
        if (pendingSuccess?.operationId === gardenSession.lastResult?.operationId) pendingSuccess();
        else clearDrafts();
        pendingSuccess = null;
      } else if (result.status === "conflict") pendingSuccess = null;
    } else if (gardenSession.conflict) {
      // Explicit review adopts the latest revision; a form submit is still required.
      draftRevisions.forEach((_, id) => draftRevisions.set(id, gardenSession.garden.revision));
      if (photoDraft) photoDraft.revision = gardenSession.garden.revision;
      gardenSession.reviewConflict();
    }
    render();
  });
  dom.discardSaveButton.addEventListener("click", () => {
    if (!parentUnlocked || gardenSession.pending) return;
    clearDrafts();
    gardenSession.reviewConflict();
    render();
  });

  [dom.profileForm, dom.quickActionForm, dom.customEventForm, dom.rewardForm].forEach((form) => {
    for (const type of ["input", "change"]) form.addEventListener(type, (event) => {
      if (canUseParentTools() && event.target !== dom.avatarFileInput) markDraft(form);
    });
  });
  dom.profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = dom.childNameInput.value.trim().slice(0, 24) || "Little Star";
    void mutateGarden((next) => { next.child.name = name; }, {
      form: dom.profileForm, success: () => {
        profileEditing = false;
        showToast(t("profileUpdated"));
        render();
        dom.editProfileButton.focus();
      }
    });
  });
  dom.addQuickActionButton.addEventListener("click", startQuickActionAdd);
  dom.quickActionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canMutate() || !dom.quickActionForm.checkValidity()) return;
    const id = dom.quickActionIdInput.value;
    const label = dom.quickActionLabelInput.value.trim();
    const starChange = Number(dom.quickActionStarsInput.value);
    if (!label || !Number.isFinite(starChange)) return;
    const fields = {
      label, defaultStarChange: Math.round(starChange), icon: dom.quickActionIconInput.value,
      category: dom.quickActionCategoryInput.value, visibleToKid: dom.quickActionVisibleInput.checked
    };
    void mutateGarden((next) => {
      const preset = next.activityPresets.find((item) => item.id === id);
      if (id && !preset) { showToast(t("actionUnavailable"), "warning"); return false; }
      if (preset) Object.assign(preset, fields);
      else next.activityPresets.push({ id: createId("preset"), ...fields });
    }, { form: dom.quickActionForm, success: () => {
      clearQuickActionForm();
      showToast(t(id ? "actionSaved" : "actionAdded"));
    } });
  });
  dom.cancelQuickActionEditButton.addEventListener("click", clearQuickActionForm);
  dom.removeQuickActionButton.addEventListener("click", () => {
    const preset = state.activityPresets.find((item) => item.id === dom.quickActionIdInput.value);
    if (preset) void removeQuickAction(preset);
  });
  dom.eventStarsInput.addEventListener("input", () => { customEventStarsEdited = true; });
  dom.eventCategoryInput.addEventListener("change", () => applyCustomEventCategoryDefaults());
  dom.customEventForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canMutate() || !dom.customEventForm.checkValidity()) return;
    const label = dom.eventLabelInput.value.trim();
    const starChange = Number(dom.eventStarsInput.value);
    if (!label || !Number.isFinite(starChange)) return;
    const category = dom.eventCategoryInput.value;
    void addEvent({
      label, starChange, category, note: dom.eventNoteInput.value, visibleToKid: dom.eventVisibleInput.checked,
      icon: customEventCategoryDefaults(category).icon, feedbackMessage: t("customEventAdded")
    }, { form: dom.customEventForm });
  });
  dom.rewardForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!canMutate() || !dom.rewardForm.checkValidity()) return;
    const label = dom.rewardLabelInput.value.trim();
    const cost = clampStars(dom.rewardCostInput.value);
    const icon = dom.rewardIconInput.value;
    if (!label || cost < 1) return;
    const id = dom.rewardIdInput.value;
    void mutateGarden((next) => {
      const reward = next.rewards.find((item) => item.id === id);
      if (id && !reward) { showToast(t("rewardUnavailable"), "warning"); return false; }
      if (reward) Object.assign(reward, { label, cost, icon });
      else {
        const reward = { id: createId("reward"), label, cost, icon, active: true, redeemedAt: null };
        next.rewards.push(reward);
        next.child.activeRewardId = reward.id;
      }
    }, { form: dom.rewardForm, success: () => { clearRewardForm(); showToast(t("rewardSaved")); } });
  });
  dom.cancelRewardEditButton.addEventListener("click", clearRewardForm);
  dom.historyPageSizeSelect.addEventListener("change", () => {
    if (!canUseParentTools()) return;
    const size = Number(dom.historyPageSizeSelect.value);
    state.settings.historyPageSize = [20, 50, 200].includes(size) ? size : 20;
    historyPage = 1;
    savePreferences();
    render();
  });
  dom.historyPrevButton.addEventListener("click", () => {
    if (!canUseParentTools()) return;
    historyPage = Math.max(1, historyPage - 1);
    renderHistory();
  });
  dom.historyNextButton.addEventListener("click", () => {
    if (!canUseParentTools()) return;
    const total = Math.max(1, Math.ceil(state.events.length / state.settings.historyPageSize));
    historyPage = Math.min(total, historyPage + 1);
    renderHistory();
  });
  dom.uploadPhotoButton.addEventListener("click", () => {
    if (!canMutate()) return;
    if (photoDraft) void savePhotoDraft();
    else dom.avatarFileInput.click();
  });
  dom.avatarFileInput.addEventListener("change", () => { void uploadPhoto(dom.avatarFileInput.files?.[0]); });
  dom.removePhotoButton.addEventListener("click", () => { void chooseAnimal(state.child.avatar); });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.register("service-worker.js").catch((error) => {
    console.info("Service worker registration skipped.", error);
  });
}

gardenSession.addEventListener("change", (event) => {
  const settings = state.settings;
  state = gardenSession.garden ? { ...structuredClone(gardenSession.garden.document), settings } : { ...cloneDefaultState(), settings };
  if (event.detail.reason === "accountChanged") {
    pendingSuccess = null;
    photoBusy = false;
    mutationInProgress = false;
    lastRestoredResult = null;
    lockParent();
    if (avatarURL) URL.revokeObjectURL(avatarURL);
    avatarURL = null;
    avatarPath = null;
  }
  restorePendingDraft();
  render();
  void loadAvatar();
});
wireEvents();
render();
registerServiceWorker();
void gardenSession.start();
