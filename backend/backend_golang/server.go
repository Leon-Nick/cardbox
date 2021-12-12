package backend_golang

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
	store Store
	Server http.Server

	gameHandles map[string]*GameHandle
	mu sync.Mutex
	mux *http.ServeMux

	statOpenRequests int64 // atomic access
	statTotalRequests int64 // atomic access
}

