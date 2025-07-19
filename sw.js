// Service Worker with detailed logging
self.addEventListener('push', event => {
  console.log('Push event received:', event);
  
  try {
    const payload = event.data?.json() || {};
    console.log('Notification payload:', payload);
    
    const notificationPromise = self.registration.showNotification(
      payload.title || 'Notification',
      {
        body: payload.body || '',
        icon: '/icon.png'
      }
    );
    
    event.waitUntil(notificationPromise);
    console.log('Notification display initiated');
  } catch (err) {
    console.error('Push handling failed:', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
});

self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event.notification);
  event.notification.close();
  
  const clickPromise = clients.openWindow('/');
  event.waitUntil(clickPromise);
  console.log('Window open initiated after click');
});
