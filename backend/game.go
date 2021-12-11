package backend

import "time"

type Game struct {
	// GameState
	// GameOptions
	ID             string    `json:"id"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}