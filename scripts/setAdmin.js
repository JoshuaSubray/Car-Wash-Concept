const mongoose = require('mongoose');
const { User } = require('../models/User');
const { url } = require('../config/db');

// set a user's account type to admin.
async function setAdmin() {
    try {
        const email = process.argv[2] || ''; // retrieves email argument from terminal.
        if (!email) {
            console.log("Include an account's email as an argument to set as an administrator.");
            return;
        }

        // find account using email.
        const user = await User.findOne({ email });

        // if account has not been located.
        if (!user) {
            console.log(`Account '${email}' has not been found.`);
            return;
        }

        // if account has been located.
        if (user.type === 'admin') { // if account is already admin, demote it to customer.
            user.type = 'customer';
            await user.save();
            console.log(`Account email '${user.email}' has been demoted to customer status.`);
        } else {
            user.type = 'admin';
            await user.save();
            console.log(`Account email '${user.email}' has been promoted to administrator status.`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.disconnect();
    }
}

// start.
setAdmin();