package main

import (
	"io"
	"net/http"
	"syscall/js"
)

// will take one parameter
// method: 'GET' | 'POST' | 'PUT' | 'DELETE'
// url: string
// payload: interface{}

type ReturnType struct {
	Url     string
	Method  string
	Payload js.Value
}

func useGolangHttpCall() js.Func {
	return js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// Get the URL as argument
		requestUrl := args[0].String()
		// return a Promise because HTTP requests are blocking in Go
		handler := js.FuncOf(func(this js.Value, args []js.Value) interface{} {
			resolve := args[0]
			reject := args[1]
			go func() {
				// The HTTP request
				res, err := http.DefaultClient.Get(requestUrl)
				if err != nil {
					errorConstructor := js.Global().Get("Error")
					errorObject := errorConstructor.New(err.Error())
					reject.Invoke(errorObject)
					return
				}
				defer res.Body.Close()

				// Read the response body
				data, err := io.ReadAll(res.Body)
				if err != nil {
					// Handle errors here too
					errorConstructor := js.Global().Get("Error")
					errorObject := errorConstructor.New(err.Error())
					reject.Invoke(errorObject)
					return
				}
				arrayConstructor := js.Global().Get("Uint8Array")
				dataJS := arrayConstructor.New(len(data))
				js.CopyBytesToJS(dataJS, data)
				responseConstructor := js.Global().Get("Response")
				response := responseConstructor.New(dataJS)
				resolve.Invoke(response)
			}()
			return nil
		})
		promiseConstructor := js.Global().Get("Promise")
		return promiseConstructor.New(handler)
	})
}

func main() {
	ch := make(chan struct{}, 0)
	js.Global().Set("useGolangHttpCall", useGolangHttpCall())
	<-ch
}
