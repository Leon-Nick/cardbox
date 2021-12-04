# untap-upkeep-draw
A free web app for in-browser simulated games of Magic: the Gathering (which is a trading card game made and owned by Wizards of the Coast).

## Roadmap
- [ ] get a server set up and ready to go
- [ ] figure out how anonymous sessions will work (look at https://github.com/jbowens/codenames for inspiration)
- [ ] implement data sync between clients on the same session (card state e.g. position, tapped/untapped)
- [ ] implement decklist importer
- [ ] backup scryfall card data on our server
- [ ] implement keypress events (using keyboard buttons to interact with cards in addition to mouse) including a11y
- [ ] add shit to context menu
- [ ] figure out user accounts
- [ ] figure out animations (drag and drop, tap, flip)
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
- [ ] sound assets for animations
- [ ] responsiveness...?
- [ ] let users upload custom images for card sleeves, card alts, and table background image
- [ ] user keybind customization
- [ ] built-in card search (literally just use scryfall)
- [ ] if we ever get big enough, migrate to AWS or something

### Tentative (Default) Controls
| **Action** | **Keybind(s)** | **Context Menu**
| --- | --- | --- |
| **stateless** |
| zoom on card | alt | no |
| zoom on card back face | shift+alt | no |
| switch to board | w,a,s,d | yes |
| **stateful** |
| draw / move to hand | number keys | yes |
| tap / untap | e,q,t | single |
| flip | f | yes |
| flip to back face | shift+f | single |
| copy | ctrl+c | yes |
| paste | ctrl+v | yes |
| delete | backspace | yes |
| shuffle | r | stack |
| **a11y** |
| switch highlighted card | arrow keys | no |
| search card on battlefield | / | no |
| next search result | n | no |
| prev search result | shift+n | no |
| **extras** |
| shuffle | | yes |
| search | | yes |
| reveal | | yes |
| mill | | yes |
| reveal until | | yes |
| spawn tokens and emblems | | single |
| toggle token status | | single |
