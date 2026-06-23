import { LocalNotifications } from '@capacitor/local-notifications';

export const requestNotificationPermissions = async () => {
  try {
    const { display } = await LocalNotifications.requestPermissions();
    if (display === 'granted') {
      scheduleReminders();
    }
  } catch (error) {
    console.error('Notification permission error:', error);
  }
};

const scheduleReminders = async () => {
  try {
    // Clear existing notifications
    await LocalNotifications.cancel({ notifications: [{ id: 1 }, { id: 2 }, { id: 3 }] });

    // Schedule Daily Expense Reminder at 8 PM
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Track your expenses!',
          body: "Don't forget to add today's expenses to stay on top of your budget.",
          id: 1,
          schedule: { on: { hour: 20, minute: 0 }, allowWhileIdle: true },
        },
        {
          title: 'Weekly Summary',
          body: 'Check out your weekly financial summary!',
          id: 2,
          schedule: { on: { weekday: 1, hour: 10, minute: 0 }, allowWhileIdle: true }, // Monday at 10 AM
        },
        {
          title: 'Budget Alert',
          body: 'Check your budget status to ensure you are not overspending.',
          id: 3,
          schedule: { on: { day: 25, hour: 9, minute: 0 }, allowWhileIdle: true }, // 25th of month
        }
      ]
    });
  } catch (error) {
    console.error('Failed to schedule notifications:', error);
  }
};

export const triggerBudgetAlert = async (category: string) => {
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Budget Limit Reached',
          body: `You have reached or exceeded your budget for ${category}.`,
          id: new Date().getTime(), // Unique ID
          schedule: { at: new Date(new Date().getTime() + 1000) } // Send in 1 second
        }
      ]
    });
  } catch (error) {
    console.error('Failed to trigger budget alert:', error);
  }
};
