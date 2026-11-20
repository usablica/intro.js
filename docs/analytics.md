# Tour analytics

`tour.onEvent()` lets you send every tour lifecycle event to your analytics tool. You can then see how many users start a tour, which step they leave on, and how many finish it.

Unlike `onExit`, `onComplete` and the other `on*` callbacks, you can add any number of `onEvent` listeners. Adding analytics never replaces your own callbacks. If a listener throws, Intro.js logs the error and the tour keeps running.

## Events

| `type`     | When                                                    |
| ---------- | ------------------------------------------------------- |
| `start`    | The tour started                                        |
| `step`     | A step was shown to the user                            |
| `skip`     | The user skipped the tour (not sent if `onSkip` returned `false`) |
| `complete` | The tour completed. `reason` is `"done"`, `"end"` or `"skip"` |
| `exit`     | The tour closed for any reason. Always the last event   |

Each event is an object with these fields:

```ts
type TourEvent = {
  type: "start" | "step" | "skip" | "complete" | "exit";
  tourId?: string;     // the `tourId` option, if set
  step?: number;       // zero-based index of the current step (not on `start`)
  totalSteps: number;
  stepTitle?: string;  // title of the current step, if it has one
  reason?: "skip" | "end" | "done"; // only on `complete`
  timestamp: number;   // Date.now()
};
```

To tell several tours apart, give each tour a `tourId`:

```javascript
introJs.tour().setOptions({ tourId: "onboarding", steps: [/* ... */] });
```

To find where users drop off, look at the `step` of `exit` events that have no `complete` before them.

## Google Analytics 4

```javascript
introJs
  .tour()
  .setOptions({ tourId: "onboarding", steps: [/* ... */] })
  .onEvent((event) => {
    gtag("event", `tour_${event.type}`, {
      tour_id: event.tourId,
      step: event.step,
      total_steps: event.totalSteps,
      reason: event.reason,
    });
  })
  .start();
```

## Mixpanel

```javascript
tour.onEvent((event) => {
  mixpanel.track(`Tour ${event.type}`, {
    tourId: event.tourId,
    step: event.step,
    totalSteps: event.totalSteps,
    stepTitle: event.stepTitle,
    reason: event.reason,
  });
});
```

## Segment

```javascript
tour.onEvent((event) => {
  analytics.track(`Tour ${event.type}`, event);
});
```

## Removing a listener

```javascript
const track = (event) => { /* ... */ };

tour.onEvent(track);
// later
tour.offEvent(track);
```
