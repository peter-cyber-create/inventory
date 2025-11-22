import { notification as antdNotification } from 'antd';

/**
 * Modern Notification Service
 * Features:
 * - Real-time notifications with event-driven architecture
 * - Grouped by priority and module
 * - Rich UI with icons and colors
 * - Toast notifications for immediate alerts
 * - Persistent storage with automatic cleanup
 * - Export/Import functionality
 */
class NotificationService {
    constructor() {
        this.notifications = [];
        this.subscribers = [];
        this.nextId = 1;
        this.maxNotifications = 100; // Limit notifications to prevent memory issues
        this.autoCleanupDays = 7; // Auto-delete notifications older than 7 days
        
        // Initialize from storage
        this.loadFromStorage();
        
        // Start auto-cleanup
        this.startAutoCleanup();
    }

    /**
     * Load notifications from localStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('moh_notifications');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    this.notifications = parsed;
                    const maxId = Math.max(...parsed.map(n => n.id || 0), 0);
                    this.nextId = maxId + 1;
                }
            }
        } catch (error) {
            console.error('Error loading notifications from storage:', error);
            this.notifications = [];
        }
    }

    /**
     * Save notifications to localStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem('moh_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications to storage:', error);
        }
    }

    /**
     * Subscribe to notification updates
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter(sub => sub !== callback);
        };
    }

    /**
     * Notify all subscribers
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => callback([...this.notifications]));
    }

    /**
     * Get notification icon based on type
     */
    getNotificationIcon(type) {
        const iconMap = {
            success: 'check-circle',
            error: 'close-circle',
            warning: 'exclamation-circle',
            info: 'info-circle'
        };
        return iconMap[type] || 'info-circle';
    }

    /**
     * Get notification color based on type
     */
    getNotificationColor(type) {
        const colorMap = {
            success: '#52c41a',
            error: '#ff4d4f',
            warning: '#faad14',
            info: '#1890ff'
        };
        return colorMap[type] || '#1890ff';
    }

    /**
     * Add a new notification
     */
    addNotification({
        title,
        message: msg,
        type = 'info',
        module = 'System',
        priority = 'medium',
        actionRequired = false,
        link = null,
        autoClose = true,
        duration = 4500
    }) {
        const newNotification = {
            id: this.nextId++,
            title,
            message: msg,
            type,
            module,
            priority,
            actionRequired,
            link,
            timestamp: new Date().toISOString(),
            read: false
        };

        // Add to beginning of array
        this.notifications.unshift(newNotification);

        // Limit notifications
        if (this.notifications.length > this.maxNotifications) {
            this.notifications = this.notifications.slice(0, this.maxNotifications);
        }

        // Save to storage
        this.saveToStorage();

        // Notify subscribers
        this.notifySubscribers();

        // Show toast notification
        if (autoClose) {
            antdNotification.open({
                message: title,
                description: msg,
                type,
                duration: duration,
                placement: 'topRight',
                onClick: link ? () => window.location.href = link : undefined
            });
        }

        return newNotification.id;
    }

    /**
     * Quick notification methods
     */
    success(title, message, module = 'System') {
        return this.addNotification({ title, message, type: 'success', module });
    }

    error(title, message, module = 'System') {
        return this.addNotification({ title, message, type: 'error', module, priority: 'high' });
    }

    warning(title, message, module = 'System') {
        return this.addNotification({ title, message, type: 'warning', module, priority: 'medium' });
    }

    info(title, message, module = 'System') {
        return this.addNotification({ title, message, type: 'info', module, priority: 'low' });
    }

    /**
     * Module-specific notification methods
     */
    fleet(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({ title, message, type, module: 'Fleet', priority });
    }

    stores(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({ title, message, type, module: 'Stores', priority });
    }

    assets(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({ title, message, type, module: 'Assets', priority });
    }

    finance(title, message, type = 'info', priority = 'medium') {
        return this.addNotification({ title, message, type, module: 'Finance', priority });
    }

    /**
     * Mark notification as read
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveToStorage();
            this.notifySubscribers();
        }
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveToStorage();
        this.notifySubscribers();
    }

    /**
     * Delete notification
     */
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveToStorage();
        this.notifySubscribers();
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        this.notifications = [];
        this.saveToStorage();
        this.notifySubscribers();
    }

    /**
     * Get all notifications
     */
    getAll() {
        return [...this.notifications];
    }

    /**
     * Get unread notifications
     */
    getUnread() {
        return this.notifications.filter(n => !n.read);
    }

    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    /**
     * Get notifications by module
     */
    getByModule(module) {
        return this.notifications.filter(n => n.module === module);
    }

    /**
     * Get notifications by type
     */
    getByType(type) {
        return this.notifications.filter(n => n.type === type);
    }

    /**
     * Get high priority notifications
     */
    getHighPriority() {
        return this.notifications.filter(n => n.priority === 'high');
    }

    /**
     * Auto-cleanup old notifications
     */
    startAutoCleanup() {
        setInterval(() => {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - this.autoCleanupDays);
            
            const initialCount = this.notifications.length;
            this.notifications = this.notifications.filter(n => {
                const notificationDate = new Date(n.timestamp);
                return notificationDate > cutoffDate;
            });
            
            if (this.notifications.length !== initialCount) {
                this.saveToStorage();
                this.notifySubscribers();
            }
        }, 24 * 60 * 60 * 1000); // Run once per day
    }

    /**
     * Export notifications as JSON
     */
    export() {
        const dataStr = JSON.stringify(this.notifications, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const fileName = `notifications-${new Date().toISOString().split('T')[0]}.json`;
        
        const link = document.createElement('a');
        link.setAttribute('href', dataUri);
        link.setAttribute('download', fileName);
        link.click();
    }

    /**
     * Clear session on logout
     */
    clearSession() {
        this.notifications = [];
        this.nextId = 1;
        localStorage.removeItem('moh_notifications');
        this.notifySubscribers();
    }
}

// Create and export singleton instance
const notificationService = new NotificationService();

export default notificationService;