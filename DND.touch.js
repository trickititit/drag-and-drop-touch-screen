/*!
 * \class DndSimulatorDataTransfer
 *
 * \brief Re-implementation of the native \see DataTransfer object.
 *
 * \param data Optional: The data to initialize the data transfer object with.
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
 */


var DndSimulatorDataTransfer = function() {
	this.data = {};
};

/*!
 * \brief Controls the feedback currently given to the user.
 *
 * Must be any of the following strings:
 *
 * - "move"
 * - "copy"
 * - "link"
 * - "none"
 *
 * The default is "move".
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
 */
DndSimulatorDataTransfer.prototype.dropEffect = "move";

/*!
 * \brief Controls which kind of drag/drop operatins are allowed.
 *
 * Must be any of the following strings:
 *
 * - "none"
 * - "copy"
 * - "copyLink"
 * - "copyMove"
 * - "link"
 * - "linkMove"
 * - "move"
 * - "all"
 * - "uninitialized"
 *
 * The default is "all".
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
 */
DndSimulatorDataTransfer.prototype.effectAllowed = "before";

/*!
 * \brief List of files being dragged.
 *
 * This property will remain an empty list when the drag and drop operation
 * does not involve any files.
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/files
 */
DndSimulatorDataTransfer.prototype.files = [];

/*!
 * \brief Read-only list of items being dragged.
 *
 * This is actually a list of \see DataTransferItem
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem
 *
 * This property will remain an empty list when the drag and drop
 * operation does not involve any files.
 */
DndSimulatorDataTransfer.prototype.items = [];

/*!
 * \brief Read-only list of data formats that were set in
 *           the "dragstart" event.
 *
 * The order of the formats is the same order as the data
 * included in the drag operation.
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
 */
DndSimulatorDataTransfer.prototype.types = [];

/*!
 * \brief Removes all data.
 *
 * \param format Optional: Only remove the data associated with this format.
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/clearData
 */
DndSimulatorDataTransfer.prototype.clearData = function(format) {
	if(format) {
		delete this.data[format];

		var index = this.types.indexOf(format);
		delete this.types[index];
		delete this.data[index];
	} else {
		this.data = {};
	}
};

/*!
 * \brief Sets the drag operation"s drag data to the specified data
 *          and type.
 *
 * \param format A string describing the data"s format.
 * \param data   The data to store (formatted according to the
 *                 specified format).
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/setData
 */
DndSimulatorDataTransfer.prototype.setData = function(format, data) {
	this.data[format] = data;
	this.items.push(data);
	this.types.push(format);
};

/*!
 * \brief Retrives drag dta for the specified type.
 *
 * \param format A string describing the type of data to retrieve.
 *
 * \returns The drag data for the specified type, otherwise an empty string.
 *
 * \see https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData
 */
DndSimulatorDataTransfer.prototype.getData = function(format) {
	if(format in this.data) {
		return this.data[format];
	}

	return "";
};

/*!
 * \brief Sets a custom image to be displayed during dragging.
 *
 * \param img         An image elment to use for the drag feedback image.
 * \param xOffset    A long indicating the horizontal offset within the image.
 * \param yOffset   A long indicating the veritcal offset within the image.
 */
DndSimulatorDataTransfer.prototype.setDragImage = function(img, xOffset, yOffset) {
	/* since simulation doesn"t replicate the visual effects, there is
	no point in implementing this */
};


DnDTouchScreen = {
	touchHandled: "",
	_touchMoved: "",
	dragStartEvent: "",
	_touchEnd: function() {
		if (!DnDTouchScreen.touchHandled) {
			return;
		}

		// Simulate the mouseup event
		DnDTouchScreen.simulateMouseEvent(event, 'mouseup');
		// Simulate the mouseout event
		DnDTouchScreen.simulateMouseEvent(event, 'mouseout');


		// If the touch interaction did not move, it should trigger a click
		if (DnDTouchScreen._touchMoved) {
			var element = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
			var dropEvent = DnDTouchScreen.createEvent(
				"drop",
				{
					clientX: event.changedTouches[0].clientX,
					clientY: event.changedTouches[0].clientY,
					dataTransfer: DnDTouchScreen.dragStartEvent.dataTransfer
				}
			);
			element.dispatchEvent(dropEvent);
			/* simulate a drag end event on the source element */
			var dragEndEvent = DnDTouchScreen.createEvent(
				"dragend",
				{
					clientX: event.changedTouches[0].clientX,
					clientY: event.changedTouches[0].clientY,
					dataTransfer: DnDTouchScreen.dragStartEvent.dataTransfer
				}
			);

			element.dispatchEvent(dragEndEvent);
			// Simulate the click event

			// simulateMouseEvent(event, 'click');
		}

		// Unset the flag to allow other widgets to inherit the touch event
		DnDTouchScreen.touchHandled = false;
	},
	_touchMove: function(event) {
		DnDTouchScreen.touchHandled = true;
		// Ignore event if not handled
		if (!DnDTouchScreen.touchHandled) {
			return;
		}

		// Interaction was not a click
		DnDTouchScreen._touchMoved = true;

		DnDTouchScreen.dragStartEvent = DnDTouchScreen.createEvent(
			"dragstart",
			{
				clientX: event.changedTouches[0].clientX,
				clientY: event.changedTouches[0].clientY,
				dataTransfer: new DndSimulatorDataTransfer()
			}
		);

		event.target.dispatchEvent(DnDTouchScreen.dragStartEvent);

		var dragEvent = DnDTouchScreen.createEvent(
			"drag",
			{
				clientX: event.changedTouches[0].clientX,
				clientY: event.changedTouches[0].clientY,
				dataTransfer: DnDTouchScreen.dragStartEvent.dataTransfer,
			}
		);

		event.target.dispatchEvent(dragEvent);

		// Simulate the mousemove event
		DnDTouchScreen.simulateMouseEvent(event, 'mousemove');

		var element = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);

		var dragEnterEvent = DnDTouchScreen.createEvent(
			"dragenter",
			{
				clientX: event.changedTouches[0].clientX,
				clientY: event.changedTouches[0].clientY,
				dataTransfer: DnDTouchScreen.dragStartEvent.dataTransfer
			}
		);

		element.dispatchEvent(dragEnterEvent);

		/* simulate a drag over event on the target element */

		var dragOverEvent = DnDTouchScreen.createEvent(
			"dragover",
			{
				clientX: event.changedTouches[0].clientX,
				clientY: event.changedTouches[0].clientY,
				dataTransfer: DnDTouchScreen.dragStartEvent.dataTransfer
			}
		);

		element.dispatchEvent(dragOverEvent);
	},
	simulateMouseEvent: function (event, simulatedType) {
		// Ignore multi-touch events
		if (event.touches.length > 1) {
			return;
		}

		event.preventDefault();

		var touch = event.changedTouches[0],
			simulatedEvent = document.createEvent('MouseEvents');

		// Initialize the simulated mouse event using the touch event's coordinates
		simulatedEvent.initMouseEvent(
			simulatedType,    // type
			true,             // bubbles
			true,             // cancelable
			window,           // view
			1,                // detail
			touch.screenX,    // screenX
			touch.screenY,    // screenY
			touch.clientX,    // clientX
			touch.clientY,    // clientY
			false,            // ctrlKey
			false,            // altKey
			false,            // shiftKey
			false,            // metaKey
			0,                // button
			null              // relatedTarget
		);

		// Dispatch the simulated event to the target element
		event.target.dispatchEvent(simulatedEvent);
	},
	_touchStart: function(event) {
		// Ignore the event if another widget is already being handled
		if (DnDTouchScreen.touchHandled) {
			return;
		}

		// Set the flag to prevent other widgets from inheriting the touch event
		DnDTouchScreen.touchHandled = true;

		// Track movement to determine if interaction was a click
		DnDTouchScreen._touchMoved = false;

		// Simulate the mouseover event
		DnDTouchScreen.simulateMouseEvent(event, 'mouseover');

		// Simulate the mousemove event
		// simulateMouseEvent(event, 'mousemove');

		// Simulate the mousedown event
		DnDTouchScreen.simulateMouseEvent(event, 'mousedown');
	},
	init: function(element) {

		var touch = 'ontouchend' in document;

		if (!touch) {
			console.log("Dont use touch");
			return;
		}

		/* if strings are specified, assume they are CSS selectors */
		if(typeof element == "string") {
			element = document.querySelector(element);
		}

		if (!element) {
			return;
		}

		console.log(element);

		// element.addEventListener("touchstart", _touchStart, {passive: false});
		element.addEventListener("touchmove", this._touchMove, {passive: false});
		element.addEventListener("touchend", this._touchEnd, {passive: false});
	},

	/*!
	 * \brief Creates a new fake event ready to be dispatched.
	 *
	 * \param eventName The type of event to create.
	 *                    For example: "mousedown".
	 * \param options    Dictionary of options for this event.
	 *
	 * \returns An event ready for dispatching.
	 */
	createEvent: function(eventName, options) {
		var event = document.createEvent("CustomEvent");

		event.initCustomEvent(eventName, true, true, null);

		event.view = window;
		event.detail = 0;
		event.ctlrKey = false;
		event.altKey = false;
		event.shiftKey = false;
		event.metaKey = false;
		event.button = 0;
		event.relatedTarget = null;

		/* if the clientX and clientY options are specified,
		also calculated the desired screenX and screenY values */
		if(options.clientX && options.clientY) {
			event.screenX = window.screenX + options.clientX;
			event.screenY = window.screenY + options.clientY;
		}

		/* copy the rest of the options into
		the event object */
		for (var prop in options) {
			event[prop] = options[prop];
		}

		return event;
	}
};
