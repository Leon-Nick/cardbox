# untap-upkeep-draw
A free web app for in-browser simulated games of Magic: the Gathering (which is a trading card game made and owned by Wizards of the Coast).

## Roadmap
- [ ] get a server set up and ready to go
- [ ] figure out how anonymous sessions will work (look at https://github.com/jbowens/codenames for inspiration)
- [ ] implement data sync between clients on the same session (card state e.g. position, tapped/untapped)
- [ ] implement decklist importer
- [ ] backup scryfall card data on our server
- [ ] figure out keypress events (using keyboard buttons to interact with cards in addition to mouse)
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
- [ ] let users upload custom images for card sleeves, card alts, and table background image
- [ ] user keybind customization
- [ ] built-in card search (literally just use scryfall)
- [ ] if we ever get big enough, migrate to AWS or something

### Tentative (Default) Keybinds
| ####Action | ####Keybind(s) |
| ---    | ---        |
| ####stateless |
| zoom on card | alt |
| zoom on card back face | shift+alt |
| switch to board | w,a,s,d |
| ####stateful |
| tap/untap | e,q,t |
| flip | f |
| flip to back face | shift+f |
| copy | ctrl+c |
| paste | ctrl+v |
| delete | backspace |
| ####a11y |
| move highlighter | arrow keys |
| switch highlighted card | arrow keys |
| search card on battlefield | / |
| next search result | n |
| prev search result | shift+n |
