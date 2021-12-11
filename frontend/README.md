# tcg-web-app

A free web app for simulating cards from trading card games in the browser

## Roadmap

- [ ] get a server set up and ready to go
- [ ] figure out how anonymous sessions will work (look at <https://github.com/jbowens/codenames> for inspiration)
- [ ] implement data sync between clients on the same session (card state e.g. position, tapped/untapped)
- [ ] implement decklist importer
- [ ] backup scryfall card data on our server
- [ ] add shit to context menu
- [ ] implement keypress events (using keyboard buttons to interact with cards in addition to mouse) including a11y
- [ ] figure out animations (drag and drop, tap, flip)
- [ ] figure out user accounts
- [ ] figure out how to do ads

## Tech Stack

- Front-end: NextJS, Typescript, Sass?
- Back-end: Express...? Maybe Go?
- server: Debian Stable?
- database:
  - non-relational
  - redis if server has enough RAM
  - maybe mongoDB?

## Low Priority Features

- [ ] grid snapping
- [ ] sound assets for animations
- [ ] responsiveness...?
- [ ] let users upload custom images for card sleeves, card alts, and table background image
- [ ] user keybind customization
- [ ] built-in card search (literally just use scryfall)
- [ ] if we ever get big enough, migrate to AWS or something

### Tentative (Default) Controls

| **Action**                 | **Keybind(s)** | **Context Menu** |
| -------------------------- | -------------- | ---------------- |
| **stateless**              |
| zoom on card               | alt            | no               |
| zoom on card back face     | shift+alt      | no               |
| switch to board            | w,a,s,d        | yes              |
| **stateful**               |
| draw / move to hand        | number keys    | yes              |
| tap / untap                | e,q,t          | single           |
| flip                       | f              | yes              |
| flip to back face          | shift+f        | single           |
| copy                       | ctrl+c         | yes              |
| paste                      | ctrl+v         | yes              |
| delete                     | backspace      | yes              |
| shuffle                    | r              | stack            |
| **a11y**                   |
| switch highlighted card    | arrow keys     | no               |
| search card on battlefield | /              | no               |
| next search result         | n              | no               |
| prev search result         | shift+n        | no               |
| **extras**                 |
| shuffle                    |                | stack            |
| search                     |                | stack            |
| mill                       |                | stack            |
| reveal                     |                | stack            |
| reveal until               |                | stack            |
| spawn tokens and emblems   |                | single           |
| toggle token status        |                | single           |
