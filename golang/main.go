package main

import (
	"syscall/js"
)

var ws js.Value

func sendMessage() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		msg := args[0].String()
		readyState := ws.Get("readyState").Int()

		if readyState == 0 {
			ws.Call("addEventListener", "open", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
				ws.Call("send", msg)
				return nil
			}))
		} else {
			ws.Call("send", msg)
		}
		return nil
	})
}

func listenForMessages() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		onMessageReceive := args[0]
		ws.Call("addEventListener", "message", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			msg := args[0].Get("data")
			onMessageReceive.Invoke(msg)
			return nil
		}))
		return nil
	})
}

func connectToWebsocket() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		connectionString := args[0].String()
		ws = js.Global().Get("WebSocket").New(connectionString)

		return nil
	})
}

func main() {
	ch := make(chan struct{}, 0)
	js.Global().Set("connectToWebsocket", connectToWebsocket())
	js.Global().Set("sendMessage", sendMessage())
	js.Global().Set("listenForMessages", listenForMessages())
	<-ch
}
