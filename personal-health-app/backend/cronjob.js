const cron = require('node-cron');
const { User } = require('./server');

// Schedule a job to run every minute
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const users = await User.find({});

    for (let user of users) {
      if (user.lastReset.toISOString().split('T')[0] != today) {
        // Reset daily metrics without affecting goals
        const result = await User.updateOne(
          { _id: user._id },
          {
            $set: {
              steps: 0,
              waterIntake: 0,
              sleep: 0,
              calories: 0,
              lastReset: new Date()
            }
          }
        );

        // Log the result to check if the update was successful
        console.log(`Updated user ${user._id}:`, result);
      }
    }
    console.log('Daily metrics reset for all users');
  } catch (error) {
    console.error('Error resetting daily metrics:', error);
  }
});
