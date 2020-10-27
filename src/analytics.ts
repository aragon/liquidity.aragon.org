import { envVar } from './environment'
const analyticsEnabled = envVar('ANALYTICS_ENABLED')

const enabled = Boolean(analyticsEnabled)

/* eslint-disable */
// @ts-ignore
export function trackEvent(event, options): void {
  // @ts-ignore
  const countly = window.Countly
  if (enabled && countly?.q) {
    // See https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript-#custom-events
    countly.q.push([
      'add_event',
      {
        key: event,
        count: 1,
        ...options,
      },
    ])
  }
}

export function initializeAnalytics(): void {
  // @ts-ignore
  const countly = window.Countly

  if (enabled && countly?.q) {
    console.info('[Analytics] Events enabled')
    countly.q.push(['track_sessions'])
    countly.q.push(['track_pageview'])
    countly.q.push(['track_clicks'])
    countly.q.push(['track_errors'])
  }
}
