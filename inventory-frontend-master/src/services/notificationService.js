import { message } from 'antd';

class NotificationService {
    constructor() {
        this.notifications = []; // Initialize as empty array
        this.subscribers = [];
        this.nextId = 1;
        this.storageKey = 'moh_notifications';
        this.sessionKey = 'moh_notification_session';
        this.initializeFromStorage();
    }

    // Initialize notifications from localStorage with session validation
    initializeFromStorage() {
        try {
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const currentSession = localStorage.getItem('userRole') + '_' + (currentUser.id || 'anonymous');
            const storedSession = localStorage.getItem(this.sessionKey);
            
            // Check if this is the same session
            if (storedSession === currentSession) {
                const storedNotifications = localStorage.getItem(this.storageKey);
                if (storedNotifications) {
                    try {
                        const parsed = JSON.parse(storedNotifications);
                        // Ensure parsed data is an array
                        if (Array.isArray(parsed)) {
                            this.notifications = parsed;
                            this.nextId = Math.max(...this.notifications.map(n => n.id), 0) + 1;
                        } else {
                            console.warn('Stored notifications is not an array, initializing with defaults');
                            this.notifications = [];
                            this.nextId = 1;
                        }
                    } catch (parseError) {
                        console.warn('Error parsing stored notifications:', parseError);
                        this.notifications = [];
                        this.nextId = 1;
                    }
                }
            } else {
                // New session, clear old notifications and start fresh
                this.clearStorageAndStartFresh(currentSession);
            }
        } catch (error) {
            console.warn('Error loading notifications from storage:', error);
            this.initializeDefaultNotifications();
        }
        
        // If no notifications exist, add default welcome notification
        if (this.notifications.length === 0) {
            this.initializeDefaultNotifications();
        }
    }

    clearStorageAndStartFresh(newSession) {
        localStorage.removeItem(this.storageKey);
        localStorage.setItem(this.sessionKey, newSession);
        this.notifications = [];
        this.nextId = 1;
        this.initializeDefaultNotifications();
    }

    // Save notifications to localStorage
    saveToStorage() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.notifications));
            
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const currentSession = localStorage.getItem('userRole') + '_' + (currentUser.id || 'anonymous');
            localStorage.setItem(this.sessionKey, currentSession);
        } catch (error) {
            console.warn('Error saving notifications to storage:', error);
        }
    }

    initializeDefaultNotifications() {
        // Initialize with some default notifications
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const userName = user.firstname ? `${user.firstname} ${user.lastname}` : 'User';
        
        this.addNotification({
            title: 'Welcome to MoH Uganda IMS',
            message: `Welcome ${userName}! You have successfully logged into the Inventory Management System.`,
            type: 'success',
            module: 'System',
            priority: 'low'
        });
    }

    // Subscribe to notification updates
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    // Notify all subscribers
    notifySubscribers() {
        this.subscribers.forEach(callback => callback(this.notifications));
    }

    // Add a new notification
    addNotification(notification) {
        const newNotification = {
            id: this.nextId++,
            title: notification.title,
            message: notification.message,
            type: notification.type || 'info',
            module: notification.module || 'System',
            priority: notification.priority || 'medium',
            timestamp: new Date().toISOString(),
            read: false,
            actionRequired: notification.actionRequired || false,
            link: notification.link || null
        };

        this.notifications.unshift(newNotification);
        this.saveToStorage(); // Save to localStorage
        this.notifySubscribers();

        // Show toast message for high priority notifications
        if (notification.priority === 'high') {
            message.error(`${notification.title}: ${notification.message}`);
        } else if (notification.priority === 'medium') {
            message.warning(`${notification.title}: ${notification.message}`);
        } else {
            message.info(`${notification.title}: ${notification.message}`);
        }

        return newNotification.id;
    }

    // Add system notification
    addSystemNotification(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({
            title,
            message,
            type,
            module: 'System',
            priority
        });
    }

    // Add fleet notification
    addFleetNotification(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({
            title,
            message,
            type,
            module: 'Fleet',
            priority
        });
    }

    // Add stores notification
    addStoresNotification(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({
            title,
            message,
            type,
            module: 'Stores',
            priority
        });
    }

    // Add assets notification
    addAssetsNotification(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({
            title,
            message,
            type,
            module: 'Assets',
            priority
        });
    }

    // Add finance notification
    addFinanceNotification(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({
            title,
            message,
            type,
            module: 'Finance',
            priority
        });
    }

    // Mark notification as read
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveToStorage(); // Save to localStorage
            this.notifySubscribers();
        }
    }

    // Mark all notifications as read
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveToStorage(); // Save to localStorage
        this.notifySubscribers();
    }

    // Delete notification
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveToStorage(); // Save to localStorage
        this.notifySubscribers();
    }

    // Clear all notifications
    clearAllNotifications() {
        this.notifications = [];
        this.saveToStorage(); // Save to localStorage
        this.notifySubscribers();
    }

    // Clear notifications on logout
    clearSessionNotifications() {
        this.notifications = [];
        this.nextId = 1;
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.sessionKey);
        this.notifySubscribers();
    }

    // Force reset notifications (for debugging/fixing corrupted data)
    forceResetNotifications() {
        console.log('Force resetting notifications...');
        this.clearSessionNotifications();
        this.initializeDefaultNotifications();
    }

    // Get all notifications
    getNotifications() {
        // Ensure notifications is always an array
        if (!Array.isArray(this.notifications)) {
            console.warn('Notifications is not an array, resetting to empty array');
            this.notifications = [];
        }
        return this.notifications;
    }

    // Get unread notifications
    getUnreadNotifications() {
        return this.notifications.filter(n => !n.read);
    }

    // Get notifications by module
    getNotificationsByModule(module) {
        return this.notifications.filter(n => n.module === module);
    }

    // Get notifications by type
    getNotificationsByType(type) {
        return this.notifications.filter(n => n.type === type);
    }

    // Get notifications by priority
    getNotificationsByPriority(priority) {
        return this.notifications.filter(n => n.priority === priority);
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Get unread count by module
    getUnreadCountByModule(module) {
        return this.notifications.filter(n => !n.read && n.module === module).length;
    }

    // Clear notifications by module
    clearNotificationsByModule(module) {
        this.notifications = this.notifications.filter(n => n.module !== module);
        this.saveToStorage(); // Save to localStorage
        this.notifySubscribers();
    }

    // Simulate real-time notifications (for demo purposes)
    startRealTimeNotifications() {
        setInterval(() => {
            // Randomly add notifications for demo
            const types = ['info', 'warning', 'error', 'success'];
            const modules = ['Fleet', 'Stores', 'Assets', 'Finance'];
            const priorities = ['low', 'medium', 'high'];
            
            if (Math.random() < 0.1) { // 10% chance every interval
                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomModule = modules[Math.floor(Math.random() * modules.length)];
                const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
                
                this.addNotification({
                    title: `Auto ${randomModule} Update`,
                    message: `Automated system update for ${randomModule} module`,
                    type: randomType,
                    module: randomModule,
                    priority: randomPriority
                });
            }
        }, 30000); // Every 30 seconds
    }

    // Stop real-time notifications
    stopRealTimeNotifications() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    // Export notifications
    exportNotifications() {
        const dataStr = JSON.stringify(this.notifications, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `notifications-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Import notifications
    importNotifications(jsonData) {
        try {
            const importedNotifications = JSON.parse(jsonData);
            if (Array.isArray(importedNotifications)) {
                this.notifications = importedNotifications;
                this.nextId = Math.max(...importedNotifications.map(n => n.id)) + 1;
                this.notifySubscribers();
                return true;
            }
        } catch (error) {
            console.error('Failed to import notifications:', error);
            return false;
        }
        return false;
    }
}

// Create singleton instance
const notificationService = new NotificationService();

// Start real-time notifications for demo
notificationService.startRealTimeNotifications();

export default notificationService;
