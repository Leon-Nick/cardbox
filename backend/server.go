package backend

import (
	"io"
	"net/http"
	"sync"
)

var closed chan struct{}

func init() {
	closed = make(chan struct{})
	close(closed)
}

type Store interface {
	Save(*Game) error
	Delete(*Game) error
	Checkpoint(io.Writer) error
}

type Server struct {
	Store
	Server http.Server

	games map[string]*Game
	mu sync.Mutex
	mux *http.ServeMux

	statOpenRequests int64 // atomic access
	statTotalRequests int64 // atomic access
}

type GameHandle struct {
	Store
	Game
	mu sync.Mutex
	updated   chan struct{} // closed when the game is updated
	replaced  chan struct{} // closed when the game has been replaced
}