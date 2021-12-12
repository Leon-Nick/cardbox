package backend

import (
	"encoding/json"
	"log"
	"sync"
)

type GameHandle struct {
	store Store
	game *Game
	mu sync.Mutex
	updated chan struct{} // closed when the game is updated
	replaced chan struct{} // closed when the game has been replaced
	marshalled []byte
}

func newHandle(g *Game, s Store) *GameHandle {
	gameHandle := &GameHandle{
		store: s,
		game: g,
		updated: make(chan struct{}),
		replaced: make(chan struct{}),
	}
	err := s.Save(g)
	if err != nil {
		log.Printf("Unable to write updated game %q to disk: %s\n", gameHandle.game.ID, err)
	}
	return gameHandle
}

func (gh *GameHandle) update(fn func(*Game) bool) {
	gh.mu.Lock()
	defer gh.mu.Unlock()
	ok := fn(gh.game)
	if !ok {
		// game wasn't updated
		return
	}

	gh.marshalled = nil
	ch := gh.updated
	gh.updated = make(chan struct{})

	// write the updated game to disk
	err := gh.store.Save(gh.game)
	if err != nil {
		log.Printf("Unable to write updated game %q to disk: %s\n", gh.game.ID, err)
	}

	close(ch)
}

func (gh *GameHandle) gameStateChanged(stateID *string) (updated <-chan struct{}, replaced <-chan struct{}) {
	if stateID == nil {
		return closed, nil
	}

	gh.mu.Lock()
	defer gh.mu.Unlock()
	if gh.game.StateID() != *stateID {
		return closed, nil
	}
	return gh.updated, gh.replaced
}

// MarshalJSON implements the encoding/json.Marshaler interface.
// It caches a marshalled value of the game object.
func (gh *GameHandle) MarshalJSON() ([]byte, error) {
	gh.mu.Lock()
	defer gh.mu.Unlock()

	var err error
	if gh.marshalled == nil {
		gh.marshalled, err = json.Marshal(struct {
			*Game
			StateID string `json:"state_id"`
		}{gh.game, gh.game.StateID()})
	}
	return gh.marshalled, err
}