/*
	The MIT License (MIT)

	Copyright (c) 2016 Meetecho

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the "Software"),
	to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense,
	and/or sell copies of the Software, and to permit persons to whom the
	Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included
	in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
	THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
	OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
	ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
	OTHER DEALINGS IN THE SOFTWARE.
 */

// List of sessions
Janus.sessions = {};
Janus.appointmentId = null;
Janus.authToken = null;
Janus.logger = null;
Janus.serverName = null;

Janus.logHttpResponse = function(response, body, error){
	const titlePart = "Janus: -- Got a response from Janus HTTP API:";
	const responseUrlPart = "Response Url: " + response.url;
	const statusPart = "Response HTTP Status: " + response.status + " " + response.statusText;

	const responseTypePart = "Response Type: " + response.type;
	const responseHeaders = Object.fromEntries(response.headers.entries());
	const responseHeadersPart = "Response Headers: " + JSON.stringify(responseHeaders);

	let parts = [titlePart, responseUrlPart, statusPart, responseTypePart, responseHeadersPart];

	if(body){
		const bodyPart = "Response Body: " + body;
		parts.push(bodyPart);
	}

	if(error){
		const errorPart = "Unable to print response body! Error: " + error;
		parts.push(errorPart);
	}

	let completeLogMessage = parts.join("\n");
	if(response.ok){
		Janus.log(completeLogMessage);
	} else {
		Janus.error(completeLogMessage);
	}
}

Janus.useDefaultDependencies = function (deps) {
	var f = (deps && deps.fetch) || fetch;
	var p = (deps && deps.Promise) || Promise;
	var socketCls = (deps && deps.WebSocket) || WebSocket;

	return {
		newWebSocket: function(server, proto) { return new socketCls(server, proto); },
		isArray: function(arr) { return Array.isArray(arr); },
		//webRTCAdapter: (deps && deps.adapter) || adapter,
		httpAPICall: function(url, options) {
			var fetchOptions = {
				method: options.verb,
				headers: {
					'Accept': 'application/json, text/plain, */*'
				},
				cache: 'no-cache'
			};
			if(options.verb === "POST") {
				fetchOptions.headers['Content-Type'] = 'application/json';
			}
			if(options.withCredentials !== undefined) {
				fetchOptions.credentials = options.withCredentials === true ? 'include' : (options.withCredentials ? options.withCredentials : 'omit');
			}
			if(options.body) {
				fetchOptions.body = JSON.stringify(options.body);
			}
			fetchOptions.headers['appointment'] = Janus.appointmentId;

			fetchOptions.headers['Auth'] = Janus.authToken;

			let endpoint = new URL(url);
			endpoint.searchParams.append("serverName", Janus.serverName);
			var fetching = f(endpoint, fetchOptions).catch(function(error) {
				Janus.error("Janus: Got an error from the fetch operation! There may be a network error or something that prevented the request from being completed. Error: " + error);
				return p.reject({message: 'Probably a network error, is the server down? error: ' + JsonUtil().jsonStringify(error), error: error});
			});

			/*
			 * fetch() does not natively support timeouts.
			 * Work around this by starting a timeout manually, and racing it agains the fetch() to see which thing resolves first.
			 */

			if(options.timeout) {
				var timeout = new p(function(resolve, reject) {
					var timerId = setTimeout(function() {
						clearTimeout(timerId);
						return reject({message: 'Janus: Request timed out. timeout: ' + timeout , timeout: options.timeout});
					}, options.timeout);
				});
				fetching = p.race([fetching, timeout]);
			}

			fetching.then(function(response) {
				let clonedResponse = response.clone();
				clonedResponse.text().then(body => {
					Janus.logHttpResponse(clonedResponse, body);
				}).catch(error => {
					Janus.logHttpResponse(clonedResponse, undefined, error);
				});

				if(response.ok) {
					if(typeof(options.success) === typeof(Janus.noop)) {
						return response.json().then(function(parsed) {
							options.success(parsed);
						}).catch(function(error) {
							let errorValue = JsonUtil().jsonStringify(error);
							let responseValue = JsonUtil().jsonStringify(response);
							return p.reject({message: 'Janus: Failed to parse response body. error: ' + errorValue + " response: " + responseValue, error: error, response: response});
						});
					}
				}
				else {
					Janus.logHttpResponse(clonedResponse);
					return p.reject({message: 'Janus: API call failed. response: ' + JsonUtil().jsonStringify(response), response: response});
				}
			}).catch(function(error) {
				Janus.error("Janus: Got an error from the fetch operation! Error: " + JSON.stringify(error));
				if(typeof(options.error) === typeof(Janus.noop)) {
					options.error(error.message || 'Janus: << internal error >>', error);
				}
			});

			return fetching;
		}
	}
};

Janus.noop = function() {};

Janus.dataChanDefaultLabel = "JanusDataChannel";

// Note: in the future we may want to change this, e.g., as was
// attempted in https://github.com/meetecho/janus-gateway/issues/1670
Janus.endOfCandidates = null;

// Initialization
Janus.init = function(options) {
	options = options || {};
	options.callback = (typeof options.callback == "function") ? options.callback : Janus.noop;
	Janus.appointmentId = options.appointmentId;
	Janus.authToken = options.authToken;
	Janus.logger = options.logger;
	Janus.serverName = options.serverName;
	
	if(Janus.initDone) {
		// Already initialized
		options.callback();
	} else {
		Janus.trace = Janus.logger.trace;
		Janus.debug = Janus.logger.debug;
		Janus.vdebug = Janus.logger.debug;
		Janus.log = Janus.logger.info;
		Janus.warn = Janus.logger.warn;
		Janus.error = Janus.logger.error;

		Janus.log("Janus: Initializing library");

		var usedDependencies = options.dependencies || Janus.useDefaultDependencies();
		Janus.isArray = usedDependencies.isArray;
		//Janus.webRTCAdapter = usedDependencies.webRTCAdapter;
		Janus.httpAPICall = usedDependencies.httpAPICall;
		Janus.newWebSocket = usedDependencies.newWebSocket;

		Janus.initDone = true;
		options.callback();
	}
};

// Helper method to create random identifiers (e.g., transaction)
Janus.randomString = function(len) {
	var charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	return randomString;
};

function Janus(gatewayCallbacks) {
	gatewayCallbacks = gatewayCallbacks || {};
	gatewayCallbacks.success = (typeof gatewayCallbacks.success == "function") ? gatewayCallbacks.success : Janus.noop;
	gatewayCallbacks.error = (typeof gatewayCallbacks.error == "function") ? gatewayCallbacks.error : Janus.noop;
	gatewayCallbacks.destroyed = (typeof gatewayCallbacks.destroyed == "function") ? gatewayCallbacks.destroyed : Janus.noop;
	if(!Janus.initDone) {
		gatewayCallbacks.error("Janus: Library not initialized");
		return {};
	}

	Janus.log("Janus: Library initialized: " + Janus.initDone);
	if(!gatewayCallbacks.server) {
		gatewayCallbacks.error("Invalid server url");
		return {};
	}
	var websockets = false;
	var ws = null;
	var wsHandlers = {};
	var wsKeepaliveTimeoutId = null;
	var servers = null;
	var serversIndex = 0;
	var server = gatewayCallbacks.server;
	if(Janus.isArray(server)) {
		Janus.log("Janus: Multiple servers provided (" + server.length + "), will use the first that works");
		server = null;
		servers = gatewayCallbacks.server;
		Janus.debug(servers);
	} else {
		if(server.indexOf("ws") === 0) {
			websockets = true;
			Janus.log("Janus: Using WebSockets to contact Janus: " + server);
		} else {
			websockets = false;
			Janus.log("Janus: Using REST API to contact Janus: " + server);
		}
	}
	var iceServers = gatewayCallbacks.iceServers || [{urls: "stun:stun.l.google.com:19302"}];
	var iceTransportPolicy = gatewayCallbacks.iceTransportPolicy;
	var bundlePolicy = gatewayCallbacks.bundlePolicy;
	// Whether IPv6 candidates should be gathered
	var ipv6Support = (gatewayCallbacks.ipv6 === true);
	// Whether we should enable the withCredentials flag for XHR requests
	var withCredentials = false;
	if(gatewayCallbacks.withCredentials !== undefined && gatewayCallbacks.withCredentials !== null)
		withCredentials = gatewayCallbacks.withCredentials === true;
	// Optional max events
	var maxev = 10;
	if(gatewayCallbacks.max_poll_events !== undefined && gatewayCallbacks.max_poll_events !== null)
		maxev = gatewayCallbacks.max_poll_events;
	if(maxev < 1)
		maxev = 1;
	// Token to use (only if the token based authentication mechanism is enabled)
	var token = null;
	if(gatewayCallbacks.token !== undefined && gatewayCallbacks.token !== null)
		token = gatewayCallbacks.token;
	// API secret to use (only if the shared API secret is enabled)
	var apisecret = null;
	if(gatewayCallbacks.apisecret !== undefined && gatewayCallbacks.apisecret !== null)
		apisecret = gatewayCallbacks.apisecret;
	// Whether we should destroy this session when onbeforeunload is called
	this.destroyOnUnload = true;
	if(gatewayCallbacks.destroyOnUnload !== undefined && gatewayCallbacks.destroyOnUnload !== null)
		this.destroyOnUnload = (gatewayCallbacks.destroyOnUnload === true);
	// Some timeout-related values
	var keepAlivePeriod = 25000;
	if(gatewayCallbacks.keepAlivePeriod !== undefined && gatewayCallbacks.keepAlivePeriod !== null)
		keepAlivePeriod = gatewayCallbacks.keepAlivePeriod;
	if(isNaN(keepAlivePeriod))
		keepAlivePeriod = 25000;
	var longPollTimeout = 60000;
	if(gatewayCallbacks.longPollTimeout !== undefined && gatewayCallbacks.longPollTimeout !== null)
		longPollTimeout = gatewayCallbacks.longPollTimeout;
	if(isNaN(longPollTimeout))
		longPollTimeout = 60000;

	var connected = false;
	var sessionId = null;
	var pluginHandles = {};
	var that = this;
	var retries = 0;
	var transactions = {};
	createSession(gatewayCallbacks);

	// Public methods
	this.getServer = function() { return server; };
	this.isConnected = function() { return connected; };
	this.reconnect = function(callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success == "function") ? callbacks.success : Janus.noop;
		callbacks.error = (typeof callbacks.error == "function") ? callbacks.error : Janus.noop;
		callbacks["reconnect"] = true;
		createSession(callbacks);
	};
	this.getSessionId = function() { return sessionId; };
	this.destroy = function(callbacks) { destroySession(callbacks); };
	this.attach = function(callbacks) { createHandle(callbacks); };

	function eventHandler() {
		if(sessionId == null)
			return;
		Janus.debug('Janus: Long poll...');
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			return;
		}
		var longpoll = server + "/" + sessionId + "?rid=" + new Date().getTime();
		if(maxev)
			longpoll = longpoll + "&maxev=" + maxev;
		if(token)
			longpoll = longpoll + "&token=" + encodeURIComponent(token);
		if(apisecret)
			longpoll = longpoll + "&apisecret=" + encodeURIComponent(apisecret);
		Janus.httpAPICall(longpoll, {
			verb: 'GET',
			withCredentials: withCredentials,
			success: handleEvent,
			timeout: longPollTimeout,
			error: function(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown);
				retries++;
				if(retries > 3) {
					// Did we just lose the server? :-(
					connected = false;
					gatewayCallbacks.error("Janus: Lost connection to the server (is it down?)");
					return;
				}
				eventHandler();
			}
		});
	}

	// Private event handler: this will trigger plugin callbacks, if set
	function handleEvent(json, skipTimeout) {
		retries = 0;
		if(!websockets && sessionId !== undefined && sessionId !== null && skipTimeout !== true)
			eventHandler();
		if(!websockets && Janus.isArray(json)) {
			// We got an array: it means we passed a maxev > 1, iterate on all objects
			for(var i=0; i<json.length; i++) {
				handleEvent(json[i], true);
			}
			return;
		}
		if(json["janus"] === "keepalive") {
			// Nothing happened
			Janus.vdebug("Janus: Got a keepalive on session " + sessionId);
			return;
		} else if(json["janus"] === "ack") {
			// Just an ack, we can probably ignore
			Janus.debug("Janus: Got an ack on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			
			var transaction = json["transaction"];
			if(transaction) {
				var reportSuccess = transactions[transaction];
				if(reportSuccess)
					reportSuccess(json);
				delete transactions[transaction];
			}
			return;
		} else if(json["janus"] === "success") {
			// Success!
			Janus.debug("Janus: Got a success on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var transaction = json["transaction"];
			if(transaction) {
				var reportSuccess = transactions[transaction];
				if(reportSuccess)
					reportSuccess(json);
				delete transactions[transaction];
			}
			return;
		} else if(json["janus"] === "webrtcup") {
			// The PeerConnection with the server is up! Notify this
			Janus.debug("Janus: Got a webrtcup event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				Janus.debug("Janus: This handle is not attached to this session");
				return;
			}
			pluginHandle.webrtcState(true);
			return;
		} else if(json["janus"] === "hangup") {
			// A plugin asked the core to hangup a PeerConnection on one of our handles
			Janus.debug("Janus: Got a hangup event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				Janus.debug("Janus: This handle is not attached to this session");
				return;
			}
			pluginHandle.webrtcState(false, json["reason"]);
			pluginHandle.hangup();
		} else if(json["janus"] === "detached") {
			// A plugin asked the core to detach one of our handles
			Janus.debug("Janus: Got a detached event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				// Don't warn here because destroyHandle causes this situation.
				return;
			}
			pluginHandle.detached = true;
			pluginHandle.ondetached();
			pluginHandle.detach();
		} else if(json["janus"] === "media") {
			// Media started/stopped flowing
			Janus.debug("Janus: Got a media event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				Janus.debug("Janus: This handle is not attached to this session");
				return;
			}
			pluginHandle.mediaState(json["type"], json["receiving"]);
		} else if(json["janus"] === "slowlink") {
			Janus.debug("Janus: Got a slowlink event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			// Trouble uplink or downlink
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				Janus.debug("Janus: This handle is not attached to this session");
				return;
			}
			pluginHandle.slowLink(json["uplink"], json["lost"]);
		} else if(json["janus"] === "error") {
			// Oops, something wrong happened
			Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
			Janus.debug("Janus: " + JSON.stringify(json));
			var transaction = json["transaction"];
			if(transaction) {
				var reportSuccess = transactions[transaction];
				if(reportSuccess) {
					reportSuccess(json);
				}
				delete transactions[transaction];
			}
			return;
		} else if(json["janus"] === "event") {
			Janus.debug("Janus: Got a plugin event on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			var sender = json["sender"];
			if(!sender) {
				Janus.warn("Janus: Missing sender...");
				return;
			}
			var plugindata = json["plugindata"];
			if(!plugindata) {
				Janus.warn("Janus: Missing plugindata...");
				return;
			}
			Janus.debug("Janus:  -- Event is coming from " + sender + " (" + plugindata["plugin"] + ")");
			var data = plugindata["data"];
			Janus.debug("Janus: " + JSON.stringify(json));
			var pluginHandle = pluginHandles[sender];
			if(!pluginHandle) {
				Janus.warn("Janus: This handle is not attached to this session");
				return;
			}
			var jsep = json["jsep"];
			if(jsep) {
				Janus.debug("Janus: Handling SDP as well...");
				Janus.debug("Janus: " + JSON.stringify(jsep));
			}
			var callback = pluginHandle.onmessage;
			if(callback) {
				Janus.debug("Janus: Notifying application...");
				// Send to callback specified when attaching plugin handle
				callback(data, jsep);
			} else {
				// Send to generic callback (?)
				Janus.debug("Janus: No provided notification callback");
			}
		} else if(json["janus"] === "timeout") {
			Janus.error("Janus: Timeout on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
			if (websockets) {
				ws.close(3504, "Gateway timeout");
			}
			return;
		} else {
			Janus.warn("Janus: Unknown message/event  '" + json["janus"] + "' on session " + sessionId);
			Janus.debug("Janus: " + JSON.stringify(json));
		}
	}

	// Private helper to send keep-alive messages on WebSockets
	function keepAlive() {
		if(!server || !websockets || !connected)
			return;
		wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
		var request = { "janus": "keepalive", "session_id": sessionId, "transaction": Janus.randomString(12) };
		if(token)
			request["token"] = token;
		if(apisecret)
			request["apisecret"] = apisecret;
		ws.send(JSON.stringify(request));
	}

	// Private method to create a session
	function createSession(callbacks) {
		var transaction = Janus.randomString(12);
		var request = { "janus": "create", "transaction": transaction };
		if(callbacks["reconnect"]) {
			// We're reconnecting, claim the session
			connected = false;
			request["janus"] = "claim";
			request["session_id"] = sessionId;
			// If we were using websockets, ignore the old connection
			if(ws) {
				ws.onopen = null;
				ws.onerror = null;
				ws.onclose = null;
				if(wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
					wsKeepaliveTimeoutId = null;
				}
			}
		}
		if(token)
			request["token"] = token;
		if(apisecret)
			request["apisecret"] = apisecret;
		if(!server && Janus.isArray(servers)) {
			// We still need to find a working server from the list we were given
			server = servers[serversIndex];
			if(server.indexOf("ws") === 0) {
				websockets = true;
				Janus.log("Janus: Server #" + (serversIndex+1) + ": trying WebSockets to contact Janus (" + server + ")");
			} else {
				websockets = false;
				Janus.log("Janus: Server #" + (serversIndex+1) + ": trying REST API to contact Janus (" + server + ")");
			}
		}
		if(websockets) {
			let endpoint = server;
			if(Janus.serverName)
				endpoint = server + "?serverName=" + encodeURIComponent(Janus.serverName);
			
			ws = Janus.newWebSocket(endpoint, 'janus-protocol');
			wsHandlers = {
				'error': function() {
					Janus.error("Janus: Error connecting to the Janus WebSockets server... " + server);
					if (Janus.isArray(servers) && !callbacks["reconnect"]) {
						serversIndex++;
						if (serversIndex === servers.length) {
							// We tried all the servers the user gave us and they all failed
							callbacks.error("Janus: Error connecting to any of the provided Janus servers: Is the server down?");
							return;
						}
						// Let's try the next server
						server = null;
						setTimeout(function() {
							createSession(callbacks);
						}, 200);
						return;
					}
					callbacks.error("Janus: Error connecting to the Janus WebSockets server: Is the server down?");
				},

				'open': function() {
					// We need to be notified about the success
					transactions[transaction] = function(json) {
						Janus.debug("Janus: " + JSON.stringify(json));
						if (json["janus"] !== "success") {
							Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
							callbacks.error(json["error"].reason);
							return;
						}
						wsKeepaliveTimeoutId = setTimeout(keepAlive, keepAlivePeriod);
						connected = true;
						sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
						if(callbacks["reconnect"]) {
							Janus.log("Janus: Claimed session: " + sessionId);
						} else {
							Janus.log("Janus: Created session: " + sessionId);
						}
						Janus.sessions[sessionId] = that;
						callbacks.success();
					};
					ws.send(JSON.stringify(request));
				},

				'message': function(event) {
					handleEvent(JSON.parse(event.data));
				},

				'close': function() {
					if (!server || !connected) {
						return;
					}
					connected = false;
					// FIXME What if this is called when the page is closed?
					gatewayCallbacks.error("Janus: Lost connection to the server (is it down?)");
				}
			};

			for(var eventName in wsHandlers) {
				ws.addEventListener(eventName, wsHandlers[eventName]);
			}

			return;
		}
		Janus.httpAPICall(server, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] !== "success") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
					callbacks.error(json["error"].reason);
					return;
				}
				connected = true;
				sessionId = json["session_id"] ? json["session_id"] : json.data["id"];
				if(callbacks["reconnect"]) {
					Janus.log("Janus: Claimed session: " + sessionId);
				} else {
					Janus.log("Created session: " + sessionId);
				}
				Janus.sessions[sessionId] = that;
				eventHandler();
				callbacks.success();
			},
			error: function(textStatus, errorThrown) {
				Janus.error("Janus: " + textStatus + ":", errorThrown);	// FIXME
				if(Janus.isArray(servers) && !callbacks["reconnect"]) {
					serversIndex++;
					if(serversIndex === servers.length) {
						// We tried all the servers the user gave us and they all failed
						callbacks.error("Error connecting to any of the provided Janus servers: Is the server down?");
						return;
					}
					// Let's try the next server
					server = null;
					setTimeout(function() { createSession(callbacks); }, 200);
					return;
				}
				if(errorThrown === "")
					callbacks.error(textStatus + ": Is the server down?");
				else
					callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to destroy a session
	function destroySession(callbacks) {
		callbacks = callbacks || {};
		// FIXME This method triggers a success even when we fail
		callbacks.success = (typeof callbacks.success == "function") ? callbacks.success : Janus.noop;
		callbacks.error = (typeof callbacks.error == "function") ? callbacks.error : Janus.noop;
		var unload = (callbacks.unload === true);
		var notifyDestroyed = true;
		if(callbacks.notifyDestroyed !== undefined && callbacks.notifyDestroyed !== null)
			notifyDestroyed = (callbacks.notifyDestroyed === true);
		var cleanupHandles = (callbacks.cleanupHandles === true);
		Janus.log("Janus: Destroying session " + sessionId + " (unload=" + unload + ")");
		if(!sessionId) {
			Janus.warn("Janus: No session to destroy");
			callbacks.success();
			if(notifyDestroyed)
				gatewayCallbacks.destroyed();
			return;
		}
		if(cleanupHandles) {
			for(var handleId in pluginHandles)
				destroyHandle(handleId, { noRequest: true });
		}
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			sessionId = null;
			callbacks.success();
			return;
		}
		// No need to destroy all handles first, Janus will do that itself
		var request = { "janus": "destroy", "transaction": Janus.randomString(12) };
		if(token)
			request["token"] = token;
		if(apisecret)
			request["apisecret"] = apisecret;
		if(unload) {
			// We're unloading the page: use sendBeacon for HTTP instead,
			// or just close the WebSocket connection if we're using that
			if(websockets) {
				ws.onclose = null;
				ws.close();
				ws = null;
			} else {
				navigator.sendBeacon(server + "/" + sessionId, JSON.stringify(request));
			}
			Janus.log("Janus: Destroyed session:");
			sessionId = null;
			connected = false;
			callbacks.success();
			if(notifyDestroyed)
				gatewayCallbacks.destroyed();
			return;
		}
		if(websockets) {
			request["session_id"] = sessionId;

			var unbindWebSocket = function() {
				for(var eventName in wsHandlers) {
					ws.removeEventListener(eventName, wsHandlers[eventName]);
				}
				ws.removeEventListener('message', onUnbindMessage);
				ws.removeEventListener('error', onUnbindError);
				if(wsKeepaliveTimeoutId) {
					clearTimeout(wsKeepaliveTimeoutId);
				}
				ws.close();
			};

			var onUnbindMessage = function(event){
				var data = JSON.parse(event.data);
				if(data.session_id == request.session_id && data.transaction == request.transaction) {
					unbindWebSocket();
					callbacks.success();
					if(notifyDestroyed)
						gatewayCallbacks.destroyed();
				}
			};
			var onUnbindError = function(event) {
				unbindWebSocket();
				callbacks.error("Failed to destroy the server: Is the server down?");
				if(notifyDestroyed)
					gatewayCallbacks.destroyed();
			};

			ws.addEventListener('message', onUnbindMessage);
			ws.addEventListener('error', onUnbindError);

			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.log("Janus: Destroyed session:");
				Janus.debug("Janus: " + JSON.stringify(json));
				sessionId = null;
				connected = false;
				if(json["janus"] !== "success") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
				}
				callbacks.success();
				if(notifyDestroyed)
					gatewayCallbacks.destroyed();
			},
			error: function(textStatus, errorThrown) {
				Janus.error("Janus:" + textStatus + ":", errorThrown);	// FIXME
				// Reset everything anyway
				sessionId = null;
				connected = false;
				callbacks.success();
				if(notifyDestroyed)
					gatewayCallbacks.destroyed();
			}
		});
	}

	// Private method to create a plugin handle
	function createHandle(callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success == "function") ? callbacks.success : Janus.noop;
		callbacks.error = (typeof callbacks.error == "function") ? callbacks.error : Janus.noop;
		callbacks.consentDialog = (typeof callbacks.consentDialog == "function") ? callbacks.consentDialog : Janus.noop;
		callbacks.iceState = (typeof callbacks.iceState == "function") ? callbacks.iceState : Janus.noop;
		callbacks.mediaState = (typeof callbacks.mediaState == "function") ? callbacks.mediaState : Janus.noop;
		callbacks.webrtcState = (typeof callbacks.webrtcState == "function") ? callbacks.webrtcState : Janus.noop;
		callbacks.slowLink = (typeof callbacks.slowLink == "function") ? callbacks.slowLink : Janus.noop;
		callbacks.onmessage = (typeof callbacks.onmessage == "function") ? callbacks.onmessage : Janus.noop;
		callbacks.onlocalstream = (typeof callbacks.onlocalstream == "function") ? callbacks.onlocalstream : Janus.noop;
		callbacks.onremotestream = (typeof callbacks.onremotestream == "function") ? callbacks.onremotestream : Janus.noop;
		callbacks.ondata = (typeof callbacks.ondata == "function") ? callbacks.ondata : Janus.noop;
		callbacks.ondataopen = (typeof callbacks.ondataopen == "function") ? callbacks.ondataopen : Janus.noop;
		callbacks.oncleanup = (typeof callbacks.oncleanup == "function") ? callbacks.oncleanup : Janus.noop;
		callbacks.ondetached = (typeof callbacks.ondetached == "function") ? callbacks.ondetached : Janus.noop;
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var plugin = callbacks.plugin;
		if(!plugin) {
			Janus.error("Janus: Invalid plugin");
			callbacks.error("Invalid plugin");
			return;
		}
		var opaqueId = callbacks.opaqueId;
		var handleToken = callbacks.token ? callbacks.token : token;
		var transaction = Janus.randomString(12);
		var request = { "janus": "attach", "plugin": plugin, "opaque_id": opaqueId, "transaction": transaction };
		if(handleToken)
			request["token"] = handleToken;
		if(apisecret)
			request["apisecret"] = apisecret;
		if(websockets) {
			transactions[transaction] = function(json) {
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] !== "success") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
					callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
					return;
				}
				var handleId = json.data["id"];
				Janus.log("Janus: Created handle: " + handleId);
				var pluginHandle =
					{
						session : that,
						plugin : plugin,
						id : handleId,
						token : handleToken,
						detached : false,
						webrtcStuff : {
							started : false,
							myStream : null,
							streamExternal : false,
							remoteStream : null,
							mySdp : null,
							mediaConstraints : null,
							pc : null,
							dataChannel : {},
							dtmfSender : null,
							trickle : true,
							iceDone : false,
							volume : {
								value : null,
								timer : null
							},
							bitrate : {
								value : null,
								bsnow : null,
								bsbefore : null,
								tsnow : null,
								tsbefore : null,
								timer : null
							}
						},
						getId : function() { return handleId; },
						getPlugin : function() { return plugin; },
						getVolume : function() {},
						getRemoteVolume : function() {},
						getLocalVolume : function() {},
						isAudioMuted : function() {},
						muteAudio : function() {},
						unmuteAudio : function() {},
						isVideoMuted : function() {},
						muteVideo : function() {},
						unmuteVideo : function() {},
						getBitrate : function() {},
						send : function(callbacks) { sendMessage(handleId, callbacks); },
						data : function(callbacks) {},
						dtmf : function(callbacks) {},
						sendTrickleCandidate: function (c) { sendTrickleCandidate(handleId, c); },
						consentDialog : callbacks.consentDialog,
						iceState : callbacks.iceState,
						mediaState : callbacks.mediaState,
						webrtcState : callbacks.webrtcState,
						slowLink : callbacks.slowLink,
						onmessage : callbacks.onmessage,
						createOffer : function(callbacks) {},
						createAnswer : function(callbacks) {},
						handleRemoteJsep : function(callbacks) {},
						onlocalstream : callbacks.onlocalstream,
						onremotestream : callbacks.onremotestream,
						ondata : callbacks.ondata,
						ondataopen : callbacks.ondataopen,
						oncleanup : callbacks.oncleanup,
						ondetached : callbacks.ondetached,
						hangup : function(sendRequest) { cleanupWebrtc(handleId, sendRequest === true); },
						detach : function(callbacks) { destroyHandle(handleId, callbacks); }
					};
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			};
			request["session_id"] = sessionId;
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] !== "success") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
					callbacks.error("Ooops: " + json["error"].code + " " + json["error"].reason);
					return;
				}
				var handleId = json.data["id"];
				Janus.log("Janus: Created handle: " + handleId);
				var pluginHandle =
					{
						session : that,
						plugin : plugin,
						id : handleId,
						token : handleToken,
						detached : false,
						webrtcStuff : {
							started : false,
							myStream : null,
							streamExternal : false,
							remoteStream : null,
							mySdp : null,
							mediaConstraints : null,
							pc : null,
							dataChannel : {},
							dtmfSender : null,
							trickle : true,
							iceDone : false,
							volume : {
								value : null,
								timer : null
							},
							bitrate : {
								value : null,
								bsnow : null,
								bsbefore : null,
								tsnow : null,
								tsbefore : null,
								timer : null
							}
						},
						getId : function() { return handleId; },
						getPlugin : function() { return plugin; },
						getVolume : function() {},
						getRemoteVolume : function() {},
						getLocalVolume : function() {},
						isAudioMuted : function() {},
						muteAudio : function() {},
						unmuteAudio : function() {},
						isVideoMuted : function() {},
						muteVideo : function() {},
						unmuteVideo : function() {},
						getBitrate : function() {},
						send : function(callbacks) { sendMessage(handleId, callbacks); },
						data : function(callbacks) {},
						dtmf : function(callbacks) {},
						sendTrickleCandidate: function (c) { sendTrickleCandidate(handleId, c); },
						consentDialog : callbacks.consentDialog,
						iceState : callbacks.iceState,
						mediaState : callbacks.mediaState,
						webrtcState : callbacks.webrtcState,
						slowLink : callbacks.slowLink,
						onmessage : callbacks.onmessage,
						createOffer : function(callbacks) {},
						createAnswer : function(callbacks) {},
						handleRemoteJsep : function(callbacks) {},
						onlocalstream : callbacks.onlocalstream,
						onremotestream : callbacks.onremotestream,
						ondata : callbacks.ondata,
						ondataopen : callbacks.ondataopen,
						oncleanup : callbacks.oncleanup,
						ondetached : callbacks.ondetached,
						hangup : function(sendRequest) { cleanupWebrtc(handleId, sendRequest === true); },
						detach : function(callbacks) { destroyHandle(handleId, callbacks); }
					}
				pluginHandles[handleId] = pluginHandle;
				callbacks.success(pluginHandle);
			},
			error: function(textStatus, errorThrown) {
				Janus.error("Janus: " + textStatus + ":", errorThrown);	// FIXME
				if(errorThrown === "")
					callbacks.error(textStatus + ": Is the server down?");
				else
					callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to send a message
	function sendMessage(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success == "function") ? callbacks.success : Janus.noop;
		callbacks.error = (typeof callbacks.error == "function") ? callbacks.error : Janus.noop;
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if(!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Janus: Invalid handle");
			callbacks.error("Invalid handle");
			return;
		}
		var message = callbacks.message;
		var jsep = callbacks.jsep;
		var transaction = Janus.randomString(12);
		var request = { "janus": "message", "body": message, "transaction": transaction };
		if(pluginHandle.token)
			request["token"] = pluginHandle.token;
		if(apisecret)
			request["apisecret"] = apisecret;
		if(jsep) {
			request.jsep = {
				type: jsep.type,
				sdp: jsep.sdp
			};
			if(jsep.e2ee)
				request.jsep.e2ee = true;
		}
		Janus.debug("Janus: Sending message to plugin (handle=" + handleId + "):");
		Janus.debug("Janus: " + JSON.stringify(request));
		if(websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			transactions[transaction] = function(json) {
				Janus.debug("Janus: Message sent!");
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] === "success") {
					// We got a success, must have been a synchronous transaction
					var plugindata = json["plugindata"];
					if(!plugindata) {
						Janus.warn("Janus: Request succeeded, but missing plugindata...");
						callbacks.success();
						return;
					}
					Janus.log("Janus: Synchronous transaction successful (" + plugindata["plugin"] + ")");
					var data = plugindata["data"];
					Janus.debug("Janus: " + JSON.stringify(data));
					callbacks.success(data);
					return;
				} else if(json["janus"] !== "ack") {
					// Not a success and not an ack, must be an error
					if(json["error"]) {
						//Janus.error("Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
						Janus.error("Janus: Oooops: " + json["error"].reason);
						callbacks.error(json["error"].code + " " + json["error"].reason);
					} else {
						Janus.error("Janus: Unknown error");	// FIXME
						callbacks.error("Unknown error");
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			};
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.debug("Janus: Message sent!");
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] === "success") {
					// We got a success, must have been a synchronous transaction
					var plugindata = json["plugindata"];
					if(!plugindata) {
						Janus.warn("Janus: Request succeeded, but missing plugindata...");
						callbacks.success();
						return;
					}
					Janus.log("Janus: Synchronous transaction successful (" + plugindata["plugin"] + ")");
					var data = plugindata["data"];
					Janus.debug(data);
					callbacks.success(data);
					return;
				} else if(json["janus"] !== "ack") {
					// Not a success and not an ack, must be an error
					if(json["error"]) {
						Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
						callbacks.error(json["error"].code + " " + json["error"].reason);
					} else {
						Janus.error("Janus: Unknown error");	// FIXME
						callbacks.error("Unknown error");
					}
					return;
				}
				// If we got here, the plugin decided to handle the request asynchronously
				callbacks.success();
			},
			error: function(textStatus, errorThrown) {
				Janus.error("Janus: " + textStatus + ":", errorThrown);	// FIXME
				callbacks.error(textStatus + ": " + errorThrown);
			}
		});
	}

	// Private method to send a trickle candidate
	function sendTrickleCandidate(handleId, candidate) {
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			return;
		}
		var pluginHandle = pluginHandles[handleId];
		if(!pluginHandle || !pluginHandle.webrtcStuff) {
			Janus.warn("Janus: Invalid handle");
			return;
		}
		var request = { "janus": "trickle", "candidate": candidate, "transaction": Janus.randomString(12) };
		if(pluginHandle.token)
			request["token"] = pluginHandle.token;
		if(apisecret)
			request["apisecret"] = apisecret;
		Janus.vdebug("Janus: Sending trickle candidate (handle=" + handleId + "):");
		Janus.vdebug("Janus: " + JSON.stringify(request));

		if(websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			ws.send(JSON.stringify(request));
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.vdebug("Janus: Candidate sent!");
				Janus.vdebug("Janus: " + JSON.stringify(json));
				if(json["janus"] !== "ack") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
					return;
				}
			},
			error: function(textStatus, errorThrown) {
				Janus.error("Janus: " + textStatus + ":", errorThrown);	// FIXME
			}
		});
	}

	// Private method to destroy a plugin handle
	function destroyHandle(handleId, callbacks) {
		callbacks = callbacks || {};
		callbacks.success = (typeof callbacks.success == "function") ? callbacks.success : Janus.noop;
		callbacks.error = (typeof callbacks.error == "function") ? callbacks.error : Janus.noop;
		var noRequest = (callbacks.noRequest === true);
		Janus.log("Janus: Destroying handle " + handleId + " (only-locally=" + noRequest + ")");
		cleanupWebrtc(handleId);
		var pluginHandle = pluginHandles[handleId];
		if(!pluginHandle || pluginHandle.detached) {
			// Plugin was already detached by Janus, calling detach again will return a handle not found error, so just exit here
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if(noRequest) {
			// We're only removing the handle locally
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		if(!connected) {
			Janus.warn("Janus: Is the server down? (connected=false)");
			callbacks.error("Is the server down? (connected=false)");
			return;
		}
		var request = { "janus": "detach", "transaction": Janus.randomString(12) };
		if(pluginHandle.token)
			request["token"] = pluginHandle.token;
		if(apisecret)
			request["apisecret"] = apisecret;
		if(websockets) {
			request["session_id"] = sessionId;
			request["handle_id"] = handleId;
			ws.send(JSON.stringify(request));
			delete pluginHandles[handleId];
			callbacks.success();
			return;
		}
		Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
			verb: 'POST',
			withCredentials: withCredentials,
			body: request,
			success: function(json) {
				Janus.log("Janus: Destroyed handle:");
				Janus.debug("Janus: " + JSON.stringify(json));
				if(json["janus"] !== "success") {
					Janus.error("Janus: Ooops: " + json["error"].code + " " + json["error"].reason);	// FIXME
				}
				delete pluginHandles[handleId];
				callbacks.success();
			},
			error: function(textStatus, errorThrown) {
				Janus.error(textStatus + ":", errorThrown);	// FIXME
				// We cleanup anyway
				delete pluginHandles[handleId];
				callbacks.success();
			}
		});
	}

	// WebRTC stuff
	function cleanupWebrtc(handleId, hangupRequest) {
		Janus.log("Janus: Cleaning WebRTC stuff");
		var pluginHandle = pluginHandles[handleId];
		if(!pluginHandle) {
			// Nothing to clean
			return;
		}
		var config = pluginHandle.webrtcStuff;
		if(config) {
			if(hangupRequest === true) {
				// Send a hangup request (we don't really care about the response)
				var request = { "janus": "hangup", "transaction": Janus.randomString(12) };
				if(pluginHandle.token)
					request["token"] = pluginHandle.token;
				if(apisecret)
					request["apisecret"] = apisecret;
				Janus.debug("Janus: Sending hangup request (handle=" + handleId + "):");
				Janus.debug("Janus: " + JSON.stringify(request));
				
				if(websockets) {
					request["session_id"] = sessionId;
					request["handle_id"] = handleId;
					ws.send(JSON.stringify(request));
				} else {
					Janus.httpAPICall(server + "/" + sessionId + "/" + handleId, {
						verb: 'POST',
						withCredentials: withCredentials,
						body: request
					});
				}
			}
		}
		pluginHandle.oncleanup();
	}
}

window.Janus = Janus;
