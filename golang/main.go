package main

import (
	"context"
	"fmt"
	"syscall/js"

	"nhooyr.io/websocket"
)

var ws js.Value

var WS *websocket.Conn

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

func connectToWebSocketV2() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		connectionString := args[0].String()

		promisify := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]

			go func() {
				conn, _, err := websocket.Dial(context.Background(), connectionString, nil)

				if err != nil {
					fmt.Printf("Couldn't connect to %s", connectionString)
					reject.Invoke()
				}

				// store to use it later
				WS = conn

				resolve.Invoke()
			}()

			return nil
		})

		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(promisify)
	})
}

func listenForMessagesV2() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		onMessageReceive := args[0]

		go func() {
			for {
				_, payload, err := WS.Read(context.Background())

				if err != nil {
					fmt.Printf("we have error while reading from socket err: %s", err.Error())
				}

				onMessageReceive.Invoke(string(payload))
			}
		}()

		return nil
	})
}

func sendMessageV2() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		payload := args[0].String()

		err := WS.Write(context.Background(), websocket.MessageText, []byte(payload))

		if err != nil {
			fmt.Println(err.Error())
			panic(err)
		}

		return nil
	})
}

func main() {
	ch := make(chan struct{}, 0)
	// v1
	js.Global().Set("connectToWebsocket", connectToWebsocket())
	js.Global().Set("sendMessage", sendMessage())
	js.Global().Set("listenForMessages", listenForMessages())
	// v2
	js.Global().Set("connectToWebsocketV2", connectToWebSocketV2())
	js.Global().Set("sendMessageV2", sendMessageV2())
	js.Global().Set("listenForMessagesV2", listenForMessagesV2())
	<-ch
}
