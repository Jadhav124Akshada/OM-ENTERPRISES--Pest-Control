/**
 * Real-Time Event Bus for Om Enterprises Application
 * Enables instant synchronization across components and browser tabs
 * without requiring the user to reload the page.
 */

const CHANNEL_NAME = 'om_enterprises_sync_channel';

let channel = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not available in this environment:', e);
}

// In-memory listeners for the current window/tab
const listeners = new Set();

if (channel) {
  channel.onmessage = (event) => {
    if (event && event.data) {
      listeners.forEach((listener) => {
        try {
          listener(event.data);
        } catch (err) {
          console.error('Error executing sync event listener:', err);
        }
      });
    }
  };
}

// Fallback listener for cross-tab communication via storage events
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'om_sync_event' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        listeners.forEach((listener) => {
          try {
            listener(data);
          } catch (err) {
            console.error('Error executing storage sync listener:', err);
          }
        });
      } catch (err) {
        // ignore parse error
      }
    }
  });
}

/**
 * Broadcast an event to both the current tab and all other open tabs
 * @param {string} type - Event type (e.g. 'BOOKING_CREATED', 'BOOKING_STATUS_CHANGED', 'SERVICE_UPDATED')
 * @param {object} payload - Optional event data payload
 */
export const emitSyncEvent = (type, payload = {}) => {
  const eventData = {
    type,
    payload,
    timestamp: Date.now(),
  };

  // 1. Notify current window listeners immediately
  listeners.forEach((listener) => {
    try {
      listener(eventData);
    } catch (err) {
      console.error('Error executing in-app sync listener:', err);
    }
  });

  // 2. Broadcast to other tabs via BroadcastChannel
  if (channel) {
    try {
      channel.postMessage(eventData);
    } catch (err) {
      console.warn('Failed to postMessage to BroadcastChannel:', err);
    }
  }

  // 3. Broadcast to other tabs via localStorage storage event
  try {
    localStorage.setItem('om_sync_event', JSON.stringify(eventData));
  } catch (err) {
    // Ignore storage write issues
  }
};

/**
 * Subscribe to sync events
 * @param {function} callback - Function called with { type, payload, timestamp }
 * @returns {function} Cleanup/unsubscribe function
 */
export const subscribeSyncEvents = (callback) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};
