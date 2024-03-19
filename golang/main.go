package main

import (
	"syscall/js"
)

func connectToWebsocket() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		connectionString := args[0].String()
		onMessageReceive := args[1]

		ws := js.Global().Get("WebSocket").New(connectionString)

		ws.Call("addEventListener", "message", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			msg := args[0].Get("data")
			onMessageReceive.Invoke(msg)
			return nil
		}))

		return nil
	})
}

func main() {
	ch := make(chan struct{}, 0)
	js.Global().Set("connectToWebsocket", connectToWebsocket())
	<-ch
}
