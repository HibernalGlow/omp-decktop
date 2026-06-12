package main

import (
	"log"
	"os"
	"time"

	"github.com/omp-deck/desktop/internal/runtime"
	"github.com/wailsapp/wails/v3/pkg/application"
)

func main() {
	log.SetFlags(log.Ltime | log.Lshortfile)
	log.Println("[desktop] OMP Deck starting...")

	// Start the Bun server as a child process.
	server := &runtime.ServerProcess{}
	if err := server.Start(); err != nil {
		log.Fatalf("[desktop] failed to start server: %v", err)
	}
	defer server.Stop()

	// Wait for the server to become healthy.
	log.Println("[desktop] waiting for server to become healthy...")
	if err := server.WaitForHealthy(30 * time.Second); err != nil {
		log.Fatalf("[desktop] server health check failed: %v", err)
	}

	serverURL := server.URL()
	log.Printf("[desktop] server ready at %s", serverURL)

	// `wails3 dev` injects FRONTEND_DEVSERVER_URL and blocks startup until
	// that URL responds. This desktop shell does not use a separate Vite
	// server; it always loads the Bun-backed deck URL directly.
	_ = os.Setenv("FRONTEND_DEVSERVER_URL", serverURL)

	// Create the Wails application. No embedded assets are needed because the
	// window loads the Bun server URL directly.
	app := application.New(application.Options{
		Name:        "omp-decktop",
		Description: "omp-decktop - AI agent cockpit",
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	// Create the main window pointing to the Bun server.
	app.Window.NewWithOptions(application.WebviewWindowOptions{
		Title:  "omp-decktop",
		Width:  1280,
		Height: 800,
		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		BackgroundColour: application.NewRGB(27, 38, 54),
		URL:              serverURL + "/",
	})

	// Run the application (blocks until window is closed).
	if err := app.Run(); err != nil {
		log.Fatalf("[desktop] application error: %v", err)
	}

	log.Println("[desktop] OMP Deck exited")
}
