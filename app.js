// Form filling function
function fillForm(title, body, rowElement) {
    const titleInput = document.getElementById('title');
    const bodyInput = document.getElementById('body');
    
    titleInput.classList.remove('scam', 'legitimate');
    bodyInput.classList.remove('scam', 'legitimate');
    
    if (rowElement.classList.contains('scam') || rowElement.classList.contains('legitimate')) {
        const rowClass = rowElement.classList.contains('scam') ? 'scam' : 'legitimate';
        titleInput.classList.add(rowClass);
        bodyInput.classList.add(rowClass);
    }
    
    titleInput.value = title;
    bodyInput.value = body;
}

// Clear form colors on input
document.getElementById('title').addEventListener('input', function() {
    this.classList.remove('scam', 'legitimate');
});
document.getElementById('body').addEventListener('input', function() {
    this.classList.remove('scam', 'legitimate');
});

// Service worker registration
let serviceWorkerRegistration = null;

async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        console.log('Starting service worker registration...');
        try {
            serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
            console.log('ServiceWorker registration successful - scope:', serviceWorkerRegistration.scope);
            return true;
        } catch (err) {
            console.error('ServiceWorker registration failed:', err);
            console.log('Will retry registration when needed');
            return false;
        }
    }
    console.log('Service workers not supported in this browser');
    return false;
}

// Initialize on load
window.addEventListener('load', registerServiceWorker);

// Notification handling
document.getElementById('sendBtn').addEventListener('click', async () => {
    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body').value.trim();
    
    console.log('Notification button clicked - title:', title, 'body:', body);
    
    if (!title && !body) {
        console.log('Empty notification request - showing alert');
        alert('Please enter a title or message');
        return;
    }

    try {
        console.log('Checking notification permission...');
        const permission = await Notification.requestPermission();
        console.log('Permission status:', permission);
        
        if (permission !== 'granted') {
            console.warn('Notifications not granted by user');
            alert('Notifications are disabled. Please enable them in browser settings.');
            return;
        }

        // Ensure service worker is ready
        if (!serviceWorkerRegistration) {
            console.log('Service worker not registered - attempting registration');
            const registered = await registerServiceWorker();
            if (!registered) {
                throw new Error('Service worker registration failed');
            }
        }

        console.log('Preparing to show notification...');
        await serviceWorkerRegistration.showNotification(title || 'Notification', { 
            body: body || ''
        });
        console.log('Notification successfully shown');
        
    } catch (err) {
        console.error('Notification error:', {
            error: err,
            message: err.message,
            stack: err.stack
        });
        alert(`Notification failed: ${err.message}`);
    }
});
