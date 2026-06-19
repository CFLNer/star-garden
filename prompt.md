# Star Garden - Kid-Friendly Habit & Reward Tracker

## Product Idea

Star Garden is a small family app for helping a 4-year-old practice daily habits through positive reinforcement. Instead of tracking "performance" or money, the app uses stars, rewards, and friendly visual progress.

Parents can add stars when the child practices a target behavior, such as getting dressed, using the potty, brushing teeth, cleaning up toys, or using kind words. Parents can also privately record reminders or accidents, but the child-facing experience should stay encouraging and simple.

The goal is not to judge the child. The goal is to make growth visible, celebrate effort, and give parents a consistent tool.

## goal
- This machine is my mac laptop. We should aim to be able to open the app (in whichever format, html, app, whichever best) on my iphone.

## high-level requirements
- Ask me if you have any questions.

## Users

### Kid

The child should be able to open the app and immediately understand:

- How many stars they have.
- What reward they are working toward.
- Which friendly activities can earn stars.
- That progress feels fun, safe, and encouraging.

The kid view should use large visuals, icons, simple labels, and playful feedback. It should not show a detailed negative history.

### Parents

Parents should be able to:

- Add stars for positive behaviors.
- Record gentle corrections or reminders.
- Adjust the star balance when needed.
- Create or edit reward goals.
- Review a simple daily/weekly history.
- Keep parent-only controls separate from the kid view.

## MVP Behavior

The app starts with one child profile and one shared star balance.

Default starting balance: 10 stars.

Default earning events:

- Eat a meal well: +2
- Got dressed by self: +2
- Cleaned up toys: +2

Default correction events:

- Potty accident: -1
- Used bad words: -1
- Needed many reminders: -1
- Unsafe behavior: -3

## Rewards

Parents can define rewards with a star cost.

Default rewards:

- Parents accompany to sleep: 5 stars
- Playground trip: 5 stars
- Special snack: 5 stars
- Extra x minutes playtime: x stars

When the child reaches a reward, the kid view should show a clear celebration and let the parent mark the reward as redeemed.

## Screens

### Kid View

The first screen should be the kid view.

It should include:

- Child name or avatar.
- Current star count.
- Big progress bar or garden/tree progress visual.
- Current reward target.
- Celebration animation or visual feedback after stars are added.
- Simple history like "Today you earned stars!" without detailed negative entries.

### Parent View

The parent view should include:

- Quick action buttons for common events.
- Custom event form with star amount.
- Reward management.
- Daily log.
- Balance adjustment.
- Parent PIN or simple parent-only gate.

### History View

The history view should show:

- Date/time.
- Event label.
- Star change.
- Optional private parent note.
- Whether the event is visible to the kid.

## Data Model

A simple local-first v1 can use browser local storage or a local JSON store.

Main objects:

- Child profile
  - id
  - name
  - avatar/theme
  - currentStars
  - activeRewardId

- Event
  - id
  - timestamp
  - label
  - starChange
  - category
  - note
  - visibleToKid

- Reward
  - id
  - label
  - cost
  - icon
  - active
  - redeemedAt

- Activity preset
  - id
  - label
  - defaultStarChange
  - icon
  - category

## Design Principles

- Prefer stars, badges, flowers, or garden growth over money.
- Use mostly positive reinforcement.
- Keep numbers small and easy for a preschooler.
- Avoid shame, harsh red warning states, or long negative logs.
- Make parent actions fast: one tap for common events.
- Make kid view joyful and simple.
- Make parent view calm and practical.

## Technical Direction

For v1, build as a local-first web app or PWA.

Recommended stack:

- HTML/CSS/JavaScript or React.
- Local storage for persistence.
- Responsive layout for phone, tablet, and desktop.
- No backend required for the first prototype.

Later versions can add:

- Cloud sync.
- Multiple parent accounts.
- Multiple children.
- Authentication.
- Shared household access.
- Export or print weekly chart.

## Acceptance Criteria For First Prototype

- Parent can add a positive event and see star balance update.
- Parent can add a correction event and see star balance update.
- Kid view shows current stars and active reward progress.
- Parent can create/edit rewards.
- Parent can redeem a reward.
- Events persist after refresh.
- Kid view does not expose private parent notes.
- Interface works on a phone-sized screen.

## More thoughts

- The app use stars only for now
- No weekly reset in v1?
- v1 can stay single-device/local-only
- Can start with visual theme of animals
