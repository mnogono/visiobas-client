var observable = modules.get("observable");
var globalActions = modules.get("global_actions").globalActions;

/**
 * global events for application
 * @constructor
 *
 * @fieldOf events_map
 * @extends observable.Observable
 */
function EventsMap() {
    EventsMap.superclass.constructor.call(this);
}
lib.objects.extend(EventsMap, observable.Observable);

EventsMap.prototype.notify = function(eventType, args) {
    if (!this.observers[eventType]) {
        return;
    }

    //check if event type was disabled
    if (this.disableEventType[eventType]) {
        return;
    }

    this.stopPropagationStatus[eventType] = false;

    var prevEventType = this.eventType;

    for (var i = 0; i < this.observers[eventType].length; ++i) {
        this.eventType = eventType;
        var item = this.observers[eventType][i];

        if (lib.baseTypes.isFunction(item.observer)) {
            //invoke observer as function
            item.observer.apply(item.context, args || []);
        } else {
            //invoke observer as function object
            if (item.observer[eventType]) {
                item.observer[eventType].apply(item.context, args || []);
                globalActions.notify(item.observer, eventType);
            }
        }

        if (this.stopPropagationStatus[this.eventType] === true) {
            //return lib.collections.breaker;
            break;
        }
    }

    if (!lib.baseTypes.isEmpty(prevEventType)) {
        this.eventType = prevEventType;
    }
};

/**
 * @fieldOf events_map
 * */
var eventsMap = new EventsMap();